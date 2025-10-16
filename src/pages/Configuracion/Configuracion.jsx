import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Configuracion.css';
import { authService } from '../../hooks/auth';

// Componentes simples para reemplazar los de shadcn/ui
const Card = ({ children, className = '' }) => (
  <div className={`configuracion-card ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`configuracion-card-header ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`configuracion-card-title ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`configuracion-card-content ${className}`}>{children}</div>
);

const Input = ({ defaultValue, className = '', ...props }) => (
  <input 
    className={`configuracion-input ${className}`}
    defaultValue={defaultValue}
    {...props}
  />
);

const Button = ({ children, className = '', ...props }) => (
  <button className={`configuracion-button ${className}`} {...props}>
    {children}
  </button>
);

const Switch = ({ checked, onCheckedChange }) => (
  <button
    type="button"
    className={`configuracion-switch ${checked ? 'checked' : ''}`}
    onClick={() => onCheckedChange(!checked)}
  >
    <span className="configuracion-switch-thumb" />
  </button>
);

export default function ConfiguracionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState({
    appointments: true,
    teleconsultations: true,
    labResults: true,
  });

  const nombre_completo_usuario = authService.getUser()
    ? `${authService.getUser().primer_nombre} ${authService.getUser().primer_apellido}`
    : 'Invitado';

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
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

  // Función para verificar si una ruta está activa (igual que en Sidebar)
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

  const handleGoToMinsa = () => {
    localStorage.clear();
    window.location.href = '/minsa/login';
  };

  const handleSaveChanges = () => {
    alert('Cambios guardados exitosamente');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar - IDÉNTICO al Sidebar.jsx */}
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
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
              >
                {item.icon}
                <span className="nav-text">{item.text}</span>
              </button>
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
      <div className="dashboard-main">
        {/* Header - IDÉNTICO al Header.jsx */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826 2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h1 className="header-title">Configuración Y Perfil</h1>
            </div>

            <div className="header-right">
              <button 
                className="header-button minsa-button"
                onClick={handleGoToMinsa}
                title="Ir al Sistema MINSA"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                MINSA
              </button>
              
              <div className="user-info">
                <div className="user-avatar">
                  <span className="avatar-text">C</span>
                </div>
                <span className="user-name">Dr(a). {nombre_completo_usuario}</span>
              </div>
              <button className="header-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="configuracion-content">
          <div className="configuracion-content-inner">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="configuracion-section-title">
                  <svg className="configuracion-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                  </svg>
                  Configuraciones de notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="configuracion-card-content-inner">
                <div className="configuracion-setting-item">
                  <div className="configuracion-setting-info">
                    <div className="configuracion-setting-title">Recordatorios de citas</div>
                    <div className="configuracion-setting-description">Recibir notificaciones 15 min antes</div>
                  </div>
                  <Switch
                    checked={notifications.appointments}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, appointments: checked })}
                  />
                </div>
                <div className="configuracion-setting-item">
                  <div className="configuracion-setting-info">
                    <div className="configuracion-setting-title">Nuevas teleconsultas</div>
                    <div className="configuracion-setting-description">Notificar cuando se programe una teleconsulta</div>
                  </div>
                  <Switch
                    checked={notifications.teleconsultations}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, teleconsultations: checked })}
                  />
                </div>
                <div className="configuracion-setting-item">
                  <div className="configuracion-setting-info">
                    <div className="configuracion-setting-title">Resultados de laboratorio</div>
                    <div className="configuracion-setting-description">Alertas cuando lleguen nuevos resultados</div>
                  </div>
                  <Switch
                    checked={notifications.labResults}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, labResults: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Clinic Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="configuracion-section-title">
                  <svg className="configuracion-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Configuraciones de la clínica
                </CardTitle>
              </CardHeader>
              <CardContent className="configuracion-card-content-inner">
                <div className="configuracion-form-grid">
                  <div className="configuracion-form-group">
                    <label className="configuracion-form-label">Nombre Completo</label>
                    <Input defaultValue="Centro Médico San Rafael" className="configuracion-form-input" />
                  </div>
                  <div className="configuracion-form-group">
                    <label className="configuracion-form-label">Teléfono de la Clínica</label>
                    <Input defaultValue="+505 2246 3431" className="configuracion-form-input" />
                  </div>
                </div>
                <div className="configuracion-form-group">
                  <label className="configuracion-form-label">Dirección</label>
                  <Input defaultValue="Donde fue la terminar Mr4, 2C arriba" className="configuracion-form-input" />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="configuracion-actions">
              <Button className="configuracion-button-cancel" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button className="configuracion-button-save" onClick={handleSaveChanges}>
                Guardar Cambios
              </Button>
              <Button className="configuracion-button-logout" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}