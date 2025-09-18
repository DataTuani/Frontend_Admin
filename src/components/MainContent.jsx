import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainContent.css';

export default function MainContent() {
  const navigate = useNavigate();
  
  const appointments = [
    {
      id: 1,
      time: "9:00",
      patient: "María González",
      type: "Virtual",
      status: "Confirmada",
      statusColor: "status-confirmed"
    },
    {
      id: 2,
      time: "9:00",
      patient: "Carlos Rodriguez",
      type: "Presencial",
      status: "Pendiente",
      statusColor: "status-pending"
    },
    {
      id: 3,
      time: "9:00",
      patient: "Ana Martinez",
      type: "Presencial",
      status: "Confirmada",
      statusColor: "status-confirmed"
    },
    {
      id: 4,
      time: "9:00",
      patient: "Luis Hernandez",
      type: "Virtual",
      status: "Pendiente",
      statusColor: "status-pending"
    }
  ];

  const handleAttend = (appointmentId) => {
    navigate(`/consulta/${appointmentId}`);
  };

  return (
    <div className="main-content">
      {/* Quick Search */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Búsqueda Rápida</h2>
        </div>
        <div className="card-content">
          <div className="search-container">
            <div className="search-input-container">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Buscar paciente, expediente, cita..." 
                className="search-input"
              />
            </div>
            <button className="filter-button">
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Daily Agenda */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-content">
            <h2 className="card-title">Agenda del día - Viernes 22 Nov 2024</h2>
            <button className="new-appointment-button">
              + Nueva Cita
            </button>
          </div>
        </div>
        <div className="card-content">
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-info">
                  <div className="appointment-time">{appointment.time}</div>
                  <div className="appointment-details">
                    <div className="patient-name">{appointment.patient}</div>
                    <div className="appointment-type">
                      <svg className="type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {appointment.type}
                    </div>
                  </div>
                </div>
                <div className="appointment-actions">
                  <span className={`status-badge ${appointment.statusColor}`}>
                    {appointment.status}
                  </span>
                <button 
                  className="attend-button"
                  onClick={() => navigate(`/consulta/${encodeURIComponent(appointment.patient)}`)}
                >
                  Atender
                </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}