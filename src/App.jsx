import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/Login";
import DashboardPage from "./components/Dashboard";
import ConsultaPage from "./components/Consulta";
import Layout from "./components/Layout";
import "./App.css";
import TeleConsulta from "./components/Teleconsulta";
import ExpedientePage from "./components/Expediente";
import ArchivosPage from "./components/Archivos";
import SeguimientoPage from "./components/Seguimiento";
import ConfiguracionPage from "./components/Configuracion";
import TeleconsultasList from "./components/TeleconsultasList";
import { authService } from "./services/auth";
import MinsaDashboardPage from "./components/MinsaDashboardPage";
import MinsaLoginPage from "./components/MinsaLoginPage";

function App() {
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
    <Router>
      <div className="App">
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;