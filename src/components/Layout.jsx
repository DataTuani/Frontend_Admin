import React from 'react';
import { Navigate } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      {children}
    </div>
  );
}