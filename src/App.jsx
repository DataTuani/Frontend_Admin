import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import DashboardPage from "./pages/Dashboard/Dashboard";
import ConsultaPage from "./pages/Citas/Consulta";
import Layout from "./components/layout/Layout";
import "./App.css";
import TeleConsulta from "./pages/Teleconsultas/Teleconsulta";
import ExpedientePage from "./pages/Expedientes/Expediente";
import ArchivosPage from "./pages/Archivos/Archivos";
import SeguimientoPage from "./pages/Seguimiento/Seguimiento";
import ConfiguracionPage from "./pages/Configuracion/Configuracion";
import TeleconsultasList from "./pages/Teleconsultas/TeleconsultasList";
import { authService } from "./hooks/auth";
import MinsaDashboardPage from "./pages/Minsa/MinsaDashboardPage";
import MinsaLoginPage from "./pages/Minsa/MinsaLoginPage";
import IntegracionComunitariaPage from "./pages/Minsa/IntegracionComunitariaPage";

// Componente para manejar la autenticación
function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const [isMinsaAuthenticated, setIsMinsaAuthenticated] = useState(
    authService.isAuthenticatedMinsa()
  );

  // Efecto para verificar autenticación de citas
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };
    
    checkAuth();
    
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Efecto para verificar autenticación de MINSA
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

  const handleLogin = (userData) => {
    console.log("Usuario logueado: ", userData);
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      {/* Rutas del Sistema de Citas */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/consulta/:patient"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <ConsultaPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/teleconsultas"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <TeleconsultasList />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/teleconsulta/:patient"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <TeleConsulta />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/expediente"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <ExpedientePage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/archivos"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <ArchivosPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/seguimiento"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <SeguimientoPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/configuracion"
        element={
          isAuthenticated ? (
            <Layout isAuthenticated={isAuthenticated}>
              <ConfiguracionPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Rutas para MINSA */}
      <Route
        path="/minsa/login"
        element={
          isMinsaAuthenticated ? (
            <Navigate to="/minsa/dashboard" replace />
          ) : (
            <MinsaLoginPage />
          )
        }
      />

      <Route
        path="/minsa/dashboard"
        element={
          isMinsaAuthenticated ? (
            <MinsaDashboardPage />
          ) : (
            <Navigate to="/minsa/login" replace />
          )
        }
      />

      {/* Nueva ruta para Integración Comunitaria */}
      <Route
        path="/minsa/integracion"
        element={
          isMinsaAuthenticated ? (
            <IntegracionComunitariaPage />
          ) : (
            <Navigate to="/minsa/login" replace />
          )
        }
      />
      
      {/* Ruta por defecto */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
      
      {/* Ruta de fallback para 404 */}
      <Route
        path="*"
        element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>404 - Página no encontrada</h1>
            <p>La página que buscas no existe.</p>
            <button onClick={() => window.location.href = '/'}>
              Volver al inicio
            </button>
          </div>
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