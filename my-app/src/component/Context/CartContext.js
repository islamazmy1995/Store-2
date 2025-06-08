import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { getToken } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load cart from server
  const loadCartFromServer = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/cart`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (response.data?.status === 'success' && response.data.data) {
        const serverCartItems = response.data.data.products.map(item => ({
          productId: item.product._id,
          quantity: item.count,
          title: item.product.title,
          price: item.product.price,
          image: item.product.imageCover,
          size: item.size || undefined,
          product: item.product // Keep full product data
        }));
        setCartItems(serverCartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to load cart from server:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to load cart');
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  // Load cart when token changes
  useEffect(() => {
    loadCartFromServer();
  }, [loadCartFromServer]);

  // Add item to cart
  const addToCart = async (productId, quantity, size, productData = null) => {
    const token = getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = { 
        productId, 
        quantity,
        ...(size && { size })
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/cart`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === 'success') {
        await loadCartFromServer();
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to add product to cart:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, size = null) => {
    const token = getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/cart/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: size ? { size } : undefined, // Send size in request body if provided
        }
      );

      if (response.data?.status === 'success') {
        await loadCartFromServer();
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to remove item from cart:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to remove from cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    const token = getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/cart`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === 'success') {
        setCartItems([]);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to clear cart:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to clear cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (productId, newQuantity, size = null) => {
    const token = getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    if (newQuantity < 1) {
      return removeFromCart(productId, size);
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = { 
        quantity: newQuantity,
        ...(size && { size })
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/cart/${productId}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === 'success') {
        await loadCartFromServer();
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to update cart item quantity:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to update quantity');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total items in cart
  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Calculate cart total
  const getCartTotal = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }, [cartItems]);

  // Check if a product is in the cart
  const isInCart = useCallback((productId, size = null) => {
    return cartItems.some(item => 
      item.productId === productId && 
      (size !== null ? item.size === size : true)
    );
  }, [cartItems]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((productId, size = null) => {
    const item = cartItems.find(item => 
      item.productId === productId && 
      (size !== null ? item.size === size : true)
    );
    return item ? item.quantity : 0;
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        getCartItemCount,
        getCartTotal,
        isInCart,
        getItemQuantity,
        isLoading,
        error,
        loadCartFromServer
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
