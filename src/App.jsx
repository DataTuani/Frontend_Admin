import React, { useState } from "react";
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
              <Layout isAuthenticated={isAuthenticated}>
                <DashboardPage />
              </Layout>
            }
          />
          
          {/* Ruta de consulta presencial */}
          <Route
            path="/consulta/:patient"
            element={
              <Layout isAuthenticated={isAuthenticated}>
                <ConsultaPage />
              </Layout>
            }
          />
          
          {/* Ruta para lista de teleconsultas */}
          <Route
            path="/teleconsultas"
            element={
              <Layout isAuthenticated={isAuthenticated}>
                <TeleconsultasList />
              </Layout>
            }
          />

          {/* Ruta para teleconsulta individual */}
          <Route
            path="/teleconsulta/:patient"
            element={
              <Layout isAuthenticated={isAuthenticated}>
                <TeleConsulta />
              </Layout>
            }
          />
          
          <Route
            path="/expediente"
            element={
              <Layout isAuthenticated={isAuthenticated}>
                <ExpedientePage />
              </Layout>
            }
          />
          
          <Route
            path="/archivos"
            element={
              <Layout isAuthenticated={isAuthenticated}>
                <ArchivosPage />
              </Layout>
            }
          />
          
          <Route
            path="/seguimiento"
            element={
              <Layout isAuthenticated={isAuthenticated}>
                <SeguimientoPage />
              </Layout>
            }
          />
          
          <Route
            path="/configuracion"
            element={
              <Layout isAuthenticated={isAuthenticated}>
                <ConfiguracionPage />
              </Layout>
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