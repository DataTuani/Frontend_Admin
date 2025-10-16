import React from 'react';
import { authService } from '../services/auth';
import './MinsaDashboardPage.css';

// Componentes simples (fuera del componente)
const Card = ({ children, className = '' }) => (
  <div className={`minsa-card ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`minsa-card-header ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`minsa-card-title ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`minsa-card-content ${className}`}>{children}</div>
);

const Badge = ({ children, className = '' }) => (
  <span className={`minsa-badge ${className}`}>{children}</span>
);

export default function MinsaDashboardPage() {
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

  // Datos para las tarjetas de estadísticas
  const statsData = [
    { 
      label: "Casos activos", 
      value: "1,287", 
      trend: "+19.5% vs. período anterior",
      trendType: "positive" 
    },
    { 
      label: "Alertas de brotes", 
      value: "8", 
      trend: "+2 vs. período anterior",
      trendType: "positive" 
    },
    { 
      label: "Pacientes Hospitalizados", 
      value: "1,234", 
      trend: "+5.2% vs. período anterior",
      trendType: "negative" // Este será rojo
    },
    { 
      label: "Personal Médico Disponible", 
      value: "4,521", 
      trend: "+3.1% vs. período anterior",
      trendType: "positive" 
    },
    { 
      label: "Alertas de brotes", 
      value: "8", 
      trend: "+2 vs. período anterior",
      trendType: "positive" 
    }
  ];

  // Datos para alertas de brote
  const outbreakAlerts = [
    {
      disease: "COVID-19 Variante",
      location: "Región Norte - Departamento de Estelí",
      detected: "18",
      expected: "45",
      trend: "+150%",
      score: "87%"
    },
    {
      disease: "Indicaciones Respiratorias Agudas",
      location: "Región Norte - Departamento de Estelí", 
      detected: "127",
      expected: "45",
      trend: "+185%",
      score: "92%"
    }
  ];

  return (
    <div className="minsa-dashboard">
      {/* Header */}
      <header className="minsa-header">
        <div className="minsa-header-content">
          <div className="minsa-header-left">
            <div className="minsa-logo-container">
              <div className='minsa-logo-wrapper'>
                <img  
                  src='/minsa-logo.jpg'
                  alt= "MINSA Logo"
                  className='minsa-logo-img'
                />
              </div>
    
            </div>
          </div>
          
          <nav className="minsa-nav">
            <a href="/minsa/dashboard" className="minsa-nav-link active">
              Inicio
            </a>
            <a href="/minsa/integracion" className="minsa-nav-link">
              Integración comunitaria
            </a>
          </nav>

          <div className="minsa-header-right">
            <div className="minsa-user-info">
              <div className="minsa-user-avatar">
                <span className="minsa-avatar-text">M</span>
              </div>
              <span className="minsa-user-name">{nombre_completo_usuario}</span>
            </div>
            <button 
              className="minsa-header-button"
              onClick={handleGoToCitas}
              title="Ir al Sistema de Citas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button 
              className="minsa-logout-button"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="minsa-main-content">
        <h1 className="minsa-title">Dashboard</h1>

        {/* Stats Cards */}
        <div className="minsa-stats-grid">
          {statsData.map((stat, index) => (
            <Card key={index} className="minsa-stat-card">
              <CardContent className="minsa-stat-content">
                <div className="minsa-stat-info">
                  <p className="minsa-stat-label">{stat.label}</p>
                  <p className="minsa-stat-value">{stat.value}</p>
                  <p className={`minsa-stat-trend ${stat.trendType}`}>
                    <svg className="minsa-trend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    {stat.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="minsa-content-grid">
          {/* Left Column - Outbreak Detection */}
          <div className="minsa-left-column">
            <Card className="minsa-main-card">
              <CardHeader className="minsa-card-header">
                <CardTitle className="minsa-card-title">Detección temprana de brote</CardTitle>
                <p className="minsa-card-subtitle">Alertas basadas en algoritmos de detección de anomalías</p>
              </CardHeader>
              <CardContent className="minsa-card-content">
                {outbreakAlerts.map((alert, index) => (
                  <div key={index} className="minsa-outbreak-alert">
                    <div className="minsa-alert-header">
                      <div className="minsa-alert-title">
                        <div className="minsa-disease-name">{alert.disease}</div>
                        <Badge className="minsa-alert-badge monitoring">Monitoreo</Badge>
                      </div>
                      <button className="minsa-details-button">
                        <svg className="minsa-details-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver detalles
                      </button>
                    </div>
                    <div className="minsa-alert-location">
                      <svg className="minsa-location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {alert.location}
                    </div>
                    <div className="minsa-alert-stats">
                      <div className="minsa-stat-item">
                        <p className="minsa-stat-label-small">Casos detectados</p>
                        <p className="minsa-stat-value-small">{alert.detected}</p>
                      </div>
                      <div className="minsa-stat-item">
                        <p className="minsa-stat-label-small">Casos esperados</p>
                        <p className="minsa-stat-value-small">{alert.expected}</p>
                      </div>
                      <div className="minsa-stat-item">
                        <p className="minsa-stat-label-small">Tendencia</p>
                        <p className="minsa-stat-value-small trend-negative">
                          <svg className="minsa-trend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          {alert.trend}
                        </p>
                      </div>
                    </div>
                    <div className="minsa-anomaly-score">
                      <div className="minsa-score-header">
                        <span className="minsa-score-label">Puntuación de Anomalía</span>
                        <span className="minsa-score-value">{alert.score}</span>
                      </div>
                      <div className="minsa-score-bar">
                        <div className="minsa-score-progress" style={{ width: alert.score }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detected Patterns */}
          <div className="minsa-right-column">
            <Card className="minsa-patterns-card">
              <CardHeader className="minsa-card-header">
                <CardTitle className="minsa-card-title">Patrones detectados</CardTitle>
                <p className="minsa-card-subtitle">Análisis de comportamiento inusual</p>
              </CardHeader>
              <CardContent className="minsa-patterns-content">
                {[
                  {
                    title: "Incremento inusual de síntomas respiratorios",
                    location: "Carazo",
                    cases: "3 casos detectados",
                    time: "Últimas 48 horas",
                    percent: "87%",
                  },
                  {
                    title: "Incremento inusual de síntomas respiratorios", 
                    location: "Carazo",
                    cases: "3 casos detectados",
                    time: "Últimas 48 horas",
                    percent: "81%",
                  },
                  {
                    title: "Incremento inusual de síntomas respiratorios",
                    location: "Carazo", 
                    cases: "3 casos detectados",
                    time: "Últimas 48 horas",
                    percent: "81%",
                  },
                ].map((pattern, i) => (
                  <div key={i} className="minsa-pattern-item">
                    <p className="minsa-pattern-title">{pattern.title}</p>
                    <p className="minsa-pattern-location">{pattern.location}</p>
                    <div className="minsa-pattern-details">
                      <span>{pattern.cases}</span>
                      <span>{pattern.time}</span>
                    </div>
                    <div className="minsa-pattern-progress-bar">
                      <div className="minsa-pattern-progress" style={{ width: pattern.percent }}></div>
                    </div>
                  </div>
                ))}
                <button className="minsa-view-all-button">
                  Ver todos los patrones
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}