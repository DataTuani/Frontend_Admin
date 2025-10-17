import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { authService } from "./hooks/auth";
import MinsaDashboardPage from "./pages/Minsa/MinsaDashboardPage";
import MinsaLoginPage from "./pages/Minsa/MinsaLoginPage";
import IntegracionComunitariaPage from "./pages/Minsa/IntegracionComunitariaPage";
import "./App.css";

function AppRoutes() {
  const [isMinsaAuthenticated, setIsMinsaAuthenticated] = useState(
    authService.isAuthenticatedMinsa()
  );

  useEffect(() => {
    const checkMinsaAuth = () => {
      setIsMinsaAuthenticated(authService.isAuthenticatedMinsa());
    };
    
    checkMinsaAuth();
    
    const handleMinsaAuthChange = () => {
      checkMinsaAuth();
    };
    
    window.addEventListener('authChange', handleMinsaAuthChange);
    window.addEventListener('storage', handleMinsaAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleMinsaAuthChange);
      window.removeEventListener('storage', handleMinsaAuthChange);
    };
  }, []);

  return (
    <Routes>
      {/* Ruta de login - SOLO MINSA */}
      <Route
        path="/login"
        element={
          isMinsaAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <MinsaLoginPage />
          )
        }
      />

      {/* Ruta dashboard - SOLO MINSA */}
      <Route
        path="/dashboard"
        element={
          isMinsaAuthenticated ? (
            <MinsaDashboardPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Ruta integración comunitaria - SOLO MINSA */}
      <Route
        path="/integracion"
        element={
          isMinsaAuthenticated ? (
            <IntegracionComunitariaPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Ruta por defecto - SIEMPRE va al login de MINSA */}
      <Route
        path="/"
        element={
          <Navigate to="/login" replace />
        }
      />
      
      {/* Cualquier otra ruta va al login de MINSA */}
      <Route
        path="*"
        element={
          <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;