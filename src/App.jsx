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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  // Efecto para verificar autenticación al cargar y escuchar cambios
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };
    
    checkAuth();
    
    // Escuchar el evento personalizado de cambio de autenticación
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

  const handleLogin = (userData) => {
    console.log("Usuario logueado: ", userData);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
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
          
          {/* Rutas que usan la estructura completa del dashboard */}
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
          
          {/* Ruta de consulta presencial */}
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
          
          {/* Ruta para lista de teleconsultas */}
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

          {/* Ruta para teleconsulta individual */}
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
          
          {/* Ruta de seguimiento - IMPORTANTE: Ya está incluida en tu App.jsx */}
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