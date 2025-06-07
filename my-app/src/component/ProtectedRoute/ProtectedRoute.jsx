import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { userToken } = useUser();
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
