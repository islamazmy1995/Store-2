import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '../Context/UserContext'; // Assuming UserContext is in ../Context/
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userToken } = useUser();
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to load cart from server
  const loadCartFromServer = useCallback(async (currentToken) => {
    if (!currentToken) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );
      if (response.data && response.data.status === 'success' && response.data.data) {
        const serverCartItems = response.data.data.products.map(item => ({
          productId: item.product._id,
          quantity: item.count,
          title: item.product.title,
          price: item.product.price, // unit price
          image: item.product.imageCover,
          // size: item.product.size || undefined, // If backend supports size per cart item variant
        }));
        setCartItems(serverCartItems);
      } else {
        // Handle cases where response is not as expected but not an outright error
        console.warn('Cart data from server was not in the expected format:', response.data);
        setCartItems([]); // Or handle as appropriate, e.g. keep local if server cart is empty/invalid
      }
    } catch (error) {
      console.error('Failed to load cart from server:', error);
      // If loading fails (e.g. 404 if cart is empty, or other errors), clear local cart or handle error
      // For now, let's clear local cart if server fetch fails to avoid stale data, 
      // unless it's a network error where user might want to keep local for offline.
      // This needs careful consideration based on desired UX.
      // A common pattern is to clear if it's a definitive 'no cart' or 'auth error'.
      if (error.response && (error.response.status === 404 || error.response.status === 401 || error.response.status === 403)) {
         setCartItems([]); // Clear cart if not found or auth issue
      }
      // Otherwise, might retain local cart for offline or temporary server issues.
    }
  }, []); // useCallback with empty dependency, relies on token passed as arg

  // Effect to load cart when userToken changes or on initial load with token
  useEffect(() => {
    if (userToken) {
      loadCartFromServer(userToken);
    } else {
      // User logged out or no token initially
      setCartItems([]); // Clear cart if no user token
    }
  }, [userToken, loadCartFromServer]);

  // const token = localStorage.getItem('userToken'); // This is now replaced by userToken from context

  const addToCart = async (productId, quantity, size, productData = null) => {
    try {
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/cart`,
        { productId, quantity, size }, // Add size to the request body
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Check if the response is successful
      if (!response.data || response.data.status !== 'success') {
        throw new Error('Failed to add product to cart');
      }

      // First update local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(
          item => item.productId === productId && item.size === size
        );
        if (existingItem) {
          return prevItems.map(item =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const product = productData || response.data.data.product;
          return [
            ...prevItems,
            {
              productId,
              quantity,
              size,
              title: product.title,
              price: product.price,
              image: product.imageCover,
            },
          ];
        }
      });

      // Return the server response
      return response.data;
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId, size) => {
    const previousCartItems = [...cartItems]; // Store previous state for rollback

    // Optimistic client-side removal
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.productId === productId && item.size === size))
    );

    if (userToken) { // Only attempt server delete if user is logged in
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${userToken}` },
          data: { productId }, // Ensure your API expects productId in the body for DELETE
        });
        // Server deletion successful
      } catch (err) {
        console.error('خطأ في حذف المنتج من الـ API:', err);
        // Rollback client-side change if server deletion fails
        setCartItems(previousCartItems);
        // Optionally, notify the user about the failure
      }
    } else {
      // If no userToken, the item is only removed from the local (localStorage) cart.
      // No server call to make or rollback.
    }
  };

  const clearCart = async () => {
    if (!userToken) {
      console.error('User token not found. Cannot clear server-side cart.');
      // Optionally, prevent local clear or notify user
      // For now, we proceed to clear locally if no token, though ideally this path isn't hit for logged-in users.
      // Or better: if no token, we probably shouldn't even attempt server clear.
      // Let's assume token should be present for this operation.
    }
    try {
      // API call to clear cart on the server
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // If server call is successful, then clear the local cart
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart on server:', error);
      // If server call fails, the local cart is not cleared to maintain consistency
      // or to allow for a retry. User could be notified here.
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
