// routes/ProtectedRoutes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  
  return user ? element : <Navigate to="/login" />;
};

export const RestrictedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  
  return !user ? element : <Navigate to="/" />;
};
