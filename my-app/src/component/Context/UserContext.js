import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('userToken');
    if (tokenFromStorage) {
      try {
        // First validate token format
        let token = tokenFromStorage;
        if (!token.startsWith('Bearer ')) {
          token = `Bearer ${token}`;
          localStorage.setItem('userToken', token);
        }

        // Try to decode token
        try {
          const decodedToken = jwtDecode(token.replace('Bearer ', ''));
          if (decodedToken.exp * 1000 < Date.now()) {
            // Token is expired
            localStorage.removeItem('userToken');
            setUserToken(null);
          } else {
            // Token is valid
            setUserToken(token);
            // Try to load cart
            loadUserCart(token);
          }
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          localStorage.removeItem('userToken');
          setUserToken(null);
        }
      } catch (error) {
        console.error('Token format error:', error);
        localStorage.removeItem('userToken');
        setUserToken(null);
      }
    }
  }, []);

  const loadUserCart = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.status === 'success') {
        // Cart loaded successfully
        console.log('Cart loaded successfully');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Don't throw error here as it's handled in the CartContext
    }
  };

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
