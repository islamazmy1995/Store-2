import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on initial load
  useEffect(() => {
    const loadToken = () => {
      const tokenFromStorage = localStorage.getItem('userToken');
      if (tokenFromStorage) {
        let token = tokenFromStorage;
        // Ensure token has Bearer prefix
        if (!token.startsWith('Bearer ')) {
          token = `Bearer ${token}`;
          localStorage.setItem('userToken', token);
        }

        try {
          // Validate token expiration
          const decodedToken = jwtDecode(token.replace('Bearer ', ''));
          if (decodedToken.exp * 1000 < Date.now()) {
            // Token expired
            localStorage.removeItem('userToken');
            setUserToken(null);
          } else {
            // Valid token
            setUserToken(token);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('userToken');
          setUserToken(null);
        }
      }
      setIsLoading(false);
    };

    loadToken();
  }, []);

  // Sync token with localStorage
  useEffect(() => {
    if (userToken) {
      const token = userToken.startsWith('Bearer ') ? userToken : `Bearer ${userToken}`;
      localStorage.setItem('userToken', token);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [userToken]);

  // Logout function
  const logout = useCallback(() => {
    setUserToken(null);
    localStorage.removeItem('userToken');
  }, []);

  // Get token without 'Bearer ' prefix
  const getToken = useCallback(() => {
    if (!userToken) return null;
    return userToken.replace(/^Bearer\s+/, '');
  }, [userToken]);

  return (
    <UserContext.Provider 
      value={{
        userToken,
        setUserToken,
        logout,
        getToken,
        isAuthenticated: !!userToken,
        isLoading
      }}
    >
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
