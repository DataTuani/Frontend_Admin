// components/Layout.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Layout({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}