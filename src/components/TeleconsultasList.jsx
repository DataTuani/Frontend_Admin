import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './TeleconsultasList.css';

export default function TeleconsultasList() {
  // Datos de ejemplo para las teleconsultas
  const teleconsultas = [
    {
      id: 1,
      hora: "9:00",
      paciente: "María González",
      tipo: "Virtual",
      estado: "En curso",
    },
    {
      id: 2,
      hora: "9:00",
      paciente: "Luis Hernandez",
      tipo: "Virtual",
      estado: "Pendiente",
    },
    {
      id: 3,
      hora: "10:30",
      paciente: "Ana Martinez",
      tipo: "Virtual",
      estado: "Pendiente",
    }
  ];

  // Estadísticas
  const stats = {
    consultasHoy: 3,
    tiempoPromedio: "22 min",
    satisfaccion: "4.8/5"
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-main">
        {/* Header */}
        <header className="teleconsultas-header">
          <div className="header-content">
            <h1 className="header-title">Teleconsultas de hoy</h1>
            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">
                  <span className="avatar-text">M</span>
                </div>
                <span className="user-name">Dr. Melanie Espinoza</span>
              </div>
            </div>
          </div>
        </header>

        <div className="teleconsultas-content">
          <div className="teleconsultas-main">
            {/* Lista de Teleconsultas */}
            <div className="teleconsultas-grid">
              {teleconsultas.map(consulta => (
                <div key={consulta.id} className="consulta-card">
                  <div className="card-time">{consulta.hora}</div>
                  <div className="card-content">
                    <h3 className="card-paciente">{consulta.paciente}</h3>
                    <div className="card-tipo">
                      <span className="tipo-indicator">○</span>
                      {consulta.tipo}
                    </div>
                  </div>
                  <div className="card-actions">
                    <span className={`card-estado ${consulta.estado.toLowerCase().replace(' ', '-')}`}>
                      {consulta.estado}
                    </span>
                    <Link 
                      to={`/teleconsulta/${encodeURIComponent(consulta.paciente)}`}
                      className="card-btn"
                    >
                      Unirse
                    </Link>
                  </div>
                </div>
              ))}
              
              {/* Card para nueva teleconsulta */}
              <div className="new-consulta-card">
                <div className="new-card-content">
                  <div className="plus-icon">+</div>
                  <div className="new-card-text">Nueva Teleconsulta</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar de Estadísticas */}
          <div className="teleconsultas-sidebar">
            <div className="stats-card">
              <h3 className="stats-title">Estadísticas</h3>
              
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-value">{stats.consultasHoy}</div>
                  <div className="stat-label">Consultas hoy</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-value">{stats.tiempoPromedio}</div>
                  <div className="stat-label">Tiempo promedio</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-value">{stats.satisfaccion}</div>
                  <div className="stat-label">Satisfacción</div>
                </div>
              </div>
            </div>
            
            <div className="doctor-card">
              <h3 className="doctor-name">Dr. Melanie Espinoza</h3>
              <p className="doctor-availability">Próxima disponibilidad: 10:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}