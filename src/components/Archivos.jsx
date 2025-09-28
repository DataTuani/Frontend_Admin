import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './Archivos.css';

export default function ArchivosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const files = [
    {
      id: 1,
      name: "Hemograma completo - María González",
      date: "21/11/2024",
      size: "21 MB",
      type: "Laboratorio",
      typeColor: "badge-green",
    },
    {
      id: 2,
      name: "Radiografía tórax - Carlos Rodriguez",
      date: "21/11/2024",
      size: "21 MB",
      type: "Imagenes",
      typeColor: "badge-pink",
    },
    {
      id: 3,
      name: "Electrocardiograma - Ana Martinez",
      date: "22/11/2024",
      size: "21 MB",
      type: "Estudios",
      typeColor: "badge-red",
    },
    {
      id: 4,
      name: "Ultrasonido abdominal - Luis Hernández",
      date: "23/11/2024",
      size: "21 MB",
      type: "Imagenes",
      typeColor: "badge-pink",
    },
    {
      id: 5,
      name: "Perfil lipídico - Carmen López",
      date: "23/11/2024",
      size: "21 MB",
      type: "Laboratorio",
      typeColor: "badge-green",
    },
    {
      id: 6,
      name: "Resonancia magnética - Pedro Sánchez",
      date: "22/11/2024",
      size: "21 MB",
      type: "Imagenes",
      typeColor: "badge-pink",
    },
  ];

  const menuItems = [
    {
      path: "/dashboard",
      icon: (
        <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      text: "Agenda de Citas"
    },
    {
      path: "/teleconsultas",
      icon: (
        <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      text: "Teleconsultas"
    },
    {
      path: "/expediente",
      icon: (
        <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      text: "Expediente Clínico"
    },
    {
      path: "/archivos",
      icon: (
        <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2z" />
        </svg>
      ),
      text: "Archivos y Resultados"
    },
    {
      path: "/seguimiento",
      icon: (
        <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      text: "Seguimiento y Control"
    },
    {
      path: "/configuracion",
      icon: (
        <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826 2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      text: "Configuración / Perfil"
    }
  ];

  // Función para verificar si una ruta está activa
  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname.startsWith("/consulta/")) {
      return true;
    }
    if (path === "/teleconsultas" && location.pathname.startsWith("/teleconsulta/")) {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || file.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className={`archivos-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-logo">
            <img src="/sinaes-logo.png" alt="SINAES Logo" className="logo-img" />
            <span className="logo-text">SINAES</span>
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
              >
                {item.icon}
                <span className="nav-text">{item.text}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="logout-text">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="archivos-main">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h1 className="header-title">Archivos y Resultados</h1>
            </div>

            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">
                  <span className="avatar-text">M</span>
                </div>
                <span className="user-name">Dr. Melanie Espinoza</span>
              </div>
              <button className="header-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="archivos-content">
          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Buscar Archivos..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="imagenes">Imágenes</option>
              <option value="estudios">Estudios</option>
            </select>
            <button className="upload-button">
              Subir Archivo
            </button>
          </div>

          {/* Files Grid */}
          <div className="files-grid">
            {filteredFiles.map((file) => (
              <div key={file.id} className="file-card">
                <div className="file-card-content">
                  {/* File Icon and Badge */}
                  <div className="file-header">
                    <div className="file-icon">
                      <svg className="file-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className={`file-badge ${file.typeColor}`}>{file.type}</span>
                  </div>

                  {/* File Info */}
                  <div className="file-info">
                    <h3 className="file-name">{file.name}</h3>
                    <div className="file-details">
                      <span>{file.date}</span>
                      <span>{file.size}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="file-actions">
                    <button className="action-button view-button">
                      <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Ver
                    </button>
                    <button className="action-button download-button">
                      <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}