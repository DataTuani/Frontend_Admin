import React, { useState } from 'react';
import { authService } from '../services/auth';
import './IntegracionComunitariaPage.css';

// Componentes simples para reemplazar los de shadcn/ui
const Card = ({ children, className = '' }) => (
  <div className={`integracion-card ${className}`}>{children}</div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`integracion-card-content ${className}`}>{children}</div>
);

const Badge = ({ children, className = '' }) => (
  <span className={`integracion-badge ${className}`}>{children}</span>
);

const Button = ({ children, variant = 'outline', size = 'sm', className = '', ...props }) => (
  <button className={`integracion-button ${variant} ${size} ${className}`} {...props}>
    {children}
  </button>
);

export default function IntegracionComunitariaPage() {
  const [activeTab, setActiveTab] = useState('brigadas');
  const minsaUser = authService.getMinsaUser();
  const nombre_completo_usuario = minsaUser
    ? `${minsaUser.primer_nombre} ${minsaUser.primer_apellido}`
    : 'Usuario MINSA';

  const handleLogout = () => {
    authService.logoutMinsa();
    window.location.href = '/minsa/login';
  };

  const handleGoToCitas = () => {
    authService.logoutMinsa();
    window.location.href = '/login';
  };

  const handleGoToDashboard = () => {
    window.location.href = '/minsa/dashboard';
  };

  // Datos para Brigadas
  const brigades = [
    { id: 1, status: "Activo", statusColor: "status-active", progress: 82 },
    { id: 2, status: "Completado", statusColor: "status-completed", progress: 82 },
    { id: 3, status: "Programado", statusColor: "status-scheduled", progress: 0 },
    { id: 4, status: "Programado", statusColor: "status-scheduled", progress: 0 },
    { id: 5, status: "Activo", statusColor: "status-active", progress: 82 },
    { id: 6, status: "Completado", statusColor: "status-completed", progress: 82 },
  ];

  // Datos para Vacunación
  const vacunaciones = [
    { id: 1, status: "Activo", statusColor: "status-active", progress: 75 },
    { id: 2, status: "Completado", statusColor: "status-completed", progress: 100 },
    { id: 3, status: "Programado", statusColor: "status-scheduled", progress: 0 },
    { id: 4, status: "Activo", statusColor: "status-active", progress: 60 },
    { id: 5, status: "Programado", statusColor: "status-scheduled", progress: 0 },
    { id: 6, status: "Completado", statusColor: "status-completed", progress: 100 },
  ];

  // Datos para Actividades
  const actividades = [
    { id: 1, status: "Activo", statusColor: "status-active", progress: 45 },
    { id: 2, status: "Completado", statusColor: "status-completed", progress: 100 },
    { id: 3, status: "Programado", statusColor: "status-scheduled", progress: 0 },
    { id: 4, status: "Activo", statusColor: "status-active", progress: 30 },
    { id: 5, status: "Programado", statusColor: "status-scheduled", progress: 0 },
    { id: 6, status: "Completado", statusColor: "status-completed", progress: 100 },
  ];

  // Renderizar contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'brigadas':
        return (
          <div className="integracion-grid">
            {brigades.map((brigade) => (
              <Card key={brigade.id} className="integracion-brigade-card">
                <CardContent>
                  <div className="integracion-brigade-content">
                    {/* Header */}
                    <div className="integracion-brigade-header">
                      <h3 className="integracion-brigade-name">Brigada Norte</h3>
                      <Badge className={`integracion-brigade-status ${brigade.statusColor}`}>
                        {brigade.status}
                      </Badge>
                    </div>

                    {/* Brigade ID */}
                    <p className="integracion-brigade-id">BM-001</p>

                    {/* Location */}
                    <div className="integracion-brigade-info">
                      <svg className="integracion-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Estelí - Sabana Grande
                    </div>

                    {/* Time */}
                    <div className="integracion-brigade-info">
                      <svg className="integracion-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      8:00 AM - 12:00 PM
                    </div>

                    {/* Stats */}
                    <div className="integracion-brigade-stats">
                      <div className="integracion-stat">
                        <p className="integracion-stat-label">Personal</p>
                        <p className="integracion-stat-value">8</p>
                      </div>
                      <div className="integracion-stat">
                        <p className="integracion-stat-label">Pacientes</p>
                        <p className="integracion-stat-value">145/200</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {brigade.progress > 0 && (
                      <div className="integracion-progress">
                        <div className="integracion-progress-header">
                          <span className="integracion-progress-label">Progreso</span>
                          <span className="integracion-progress-value">{brigade.progress} %</span>
                        </div>
                        <div className="integracion-progress-bar">
                          <div 
                            className="integracion-progress-fill" 
                            style={{ width: `${brigade.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="integracion-brigade-actions">
                      <Button variant="outline" size="sm">
                        Consultas generales
                      </Button>
                      <Button variant="outline" size="sm">
                        Vacunación
                      </Button>
                      <Button variant="outline" size="sm">
                        Medicina Preventiva
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      
      case 'vacunacion':
        return (
          <div className="integracion-grid">
            {vacunaciones.map((vacunacion) => (
              <Card key={vacunacion.id} className="integracion-brigade-card">
                <CardContent>
                  <div className="integracion-brigade-content">
                    {/* Header */}
                    <div className="integracion-brigade-header">
                      <h3 className="integracion-brigade-name">Puesto de Vacunación</h3>
                      <Badge className={`integracion-brigade-status ${vacunacion.statusColor}`}>
                        {vacunacion.status}
                      </Badge>
                    </div>

                    {/* Vacunación ID */}
                    <p className="integracion-brigade-id">PV-001</p>

                    {/* Location */}
                    <div className="integracion-brigade-info">
                      <svg className="integracion-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Centro de Salud Central
                    </div>

                    {/* Time */}
                    <div className="integracion-brigade-info">
                      <svg className="integracion-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      7:00 AM - 3:00 PM
                    </div>

                    {/* Stats */}
                    <div className="integracion-brigade-stats">
                      <div className="integracion-stat">
                        <p className="integracion-stat-label">Vacunadores</p>
                        <p className="integracion-stat-value">5</p>
                      </div>
                      <div className="integracion-stat">
                        <p className="integracion-stat-label">Vacunados</p>
                        <p className="integracion-stat-value">150/200</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {vacunacion.progress > 0 && (
                      <div className="integracion-progress">
                        <div className="integracion-progress-header">
                          <span className="integracion-progress-label">Progreso</span>
                          <span className="integracion-progress-value">{vacunacion.progress} %</span>
                        </div>
                        <div className="integracion-progress-bar">
                          <div 
                            className="integracion-progress-fill" 
                            style={{ width: `${vacunacion.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="integracion-brigade-actions">
                      <Button variant="outline" size="sm">
                        Registro
                      </Button>
                      <Button variant="outline" size="sm">
                        Reportes
                      </Button>
                      <Button variant="outline" size="sm">
                        Inventario
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      
      case 'actividades':
        return (
          <div className="integracion-grid">
            {actividades.map((actividad) => (
              <Card key={actividad.id} className="integracion-brigade-card">
                <CardContent>
                  <div className="integracion-brigade-content">
                    {/* Header */}
                    <div className="integracion-brigade-header">
                      <h3 className="integracion-brigade-name">Charla Comunitaria</h3>
                      <Badge className={`integracion-brigade-status ${actividad.statusColor}`}>
                        {actividad.status}
                      </Badge>
                    </div>

                    {/* Actividad ID */}
                    <p className="integracion-brigade-id">AC-001</p>

                    {/* Location */}
                    <div className="integracion-brigade-info">
                      <svg className="integracion-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Casa Comunal Barrio Norte
                    </div>

                    {/* Time */}
                    <div className="integracion-brigade-info">
                      <svg className="integracion-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      2:00 PM - 4:00 PM
                    </div>

                    {/* Stats */}
                    <div className="integracion-brigade-stats">
                      <div className="integracion-stat">
                        <p className="integracion-stat-label">Facilitadores</p>
                        <p className="integracion-stat-value">3</p>
                      </div>
                      <div className="integracion-stat">
                        <p className="integracion-stat-label">Asistentes</p>
                        <p className="integracion-stat-value">45/100</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {actividad.progress > 0 && (
                      <div className="integracion-progress">
                        <div className="integracion-progress-header">
                          <span className="integracion-progress-label">Progreso</span>
                          <span className="integracion-progress-value">{actividad.progress} %</span>
                        </div>
                        <div className="integracion-progress-bar">
                          <div 
                            className="integracion-progress-fill" 
                            style={{ width: `${actividad.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="integracion-brigade-actions">
                      <Button variant="outline" size="sm">
                        Materiales
                      </Button>
                      <Button variant="outline" size="sm">
                        Asistencia
                      </Button>
                      <Button variant="outline" size="sm">
                        Evaluación
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="integracion-comunitaria">
      {/* Header */}
      <header className="integracion-header">
        <div className="integracion-header-content">
          <div className="integracion-header-left">
            <div className="integracion-logo-container">
              <div className="integracion-logo-text">MINISTERIO DE SALUD</div>
              <div className="integracion-logo-subtitle">Sistema de Vigilancia Epidemiológica</div>
            </div>
          </div>
          
          <nav className="integracion-nav">
            <a href="/minsa/dashboard" className="integracion-nav-link" onClick={handleGoToDashboard}>
              Inicio
            </a>
            <a href="/minsa/dashboard" className="integracion-nav-link" onClick={handleGoToDashboard}>
              Dashboard
            </a>
            <a href="#" className="integracion-nav-link">
              Detección
            </a>
            <a href="#" className="integracion-nav-link">
              Reportes
            </a>
            <a href="/minsa/integracion" className="integracion-nav-link active">
              Integración comunitaria
            </a>
          </nav>

          <div className="integracion-header-right">
            <div className="integracion-user-info">
              <div className="integracion-user-avatar">
                <span className="integracion-avatar-text">M</span>
              </div>
              <span className="integracion-user-name">{nombre_completo_usuario}</span>
            </div>
            <button 
              className="integracion-header-button"
              onClick={handleGoToCitas}
              title="Ir al Sistema de Citas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button 
              className="integracion-logout-button"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="integracion-main-content">
        <h1 className="integracion-title">Integración comunitaria</h1>

        {/* Statistics Section */}
        <div className="integracion-section">
          <div className="integracion-section-header">
            <div className="integracion-accent-bar"></div>
            <h2 className="integracion-section-title">Estadísticas</h2>
          </div>

          {/* Filter Tabs */}
          <div className="integracion-tabs">
            <button 
              className={`integracion-tab ${activeTab === 'brigadas' ? 'active' : ''}`}
              onClick={() => setActiveTab('brigadas')}
            >
              <svg className="integracion-tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Brigadas Móviles
            </button>
            <button 
              className={`integracion-tab ${activeTab === 'vacunacion' ? 'active' : ''}`}
              onClick={() => setActiveTab('vacunacion')}
            >
              <svg className="integracion-tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Vacunación
            </button>
            <button 
              className={`integracion-tab ${activeTab === 'actividades' ? 'active' : ''}`}
              onClick={() => setActiveTab('actividades')}
            >
              <svg className="integracion-tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Actividades
            </button>
          </div>
        </div>

        {/* Render Content Based on Active Tab */}
        {renderContent()}
      </div>
    </div>
  )
}