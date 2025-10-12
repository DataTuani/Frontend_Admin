import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './TeleConsulta.css';

export default function TeleConsulta() {
  const params = useParams();
  const location = useLocation();
  const { cita } = location.state || {};
  
  // Usar datos de la cita o valores por defecto
  const patientName = cita ? 
    `${cita.paciente.usuario.primer_nombre} ${cita.paciente.usuario.primer_apellido}` : 
    decodeURIComponent(params.patient || 'Paciente');
  
  const [chatMessages, setChatMessages] = useState([
    { sender: "patient", message: "Hola doctor, ¿me puede escuchar bien?" },
    { sender: "doctor", message: "Si, perfectamente ¿Cómo se siente hoy?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [medications, setMedications] = useState([]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { sender: "doctor", message: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-main">
        {/* Header */}
        <header className="teleconsulta-header">
          <div className="header-content">
            <h1 className="header-title">Teleconsulta - {patientName}</h1>
            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">
                  <span className="avatar-text">M</span>
                </div>
                <span className="user-name">Dr. Melanie Espinoza</span>
              </div>
              <button className="header-button">
                <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="teleconsulta-content">
          {/* Video Call Section */}
          <div className="video-section">
            <div className="video-container">
              <div className="video-placeholder">
                <div className="patient-avatar-large">
                  <span className="avatar-text">
                    {patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="patient-info-overlay">
                  {patientName}
                  <div className="patient-role">Paciente</div>
                </div>
              </div>

              {/* Doctor's video feed (small) */}
              <div className="doctor-video-feed">
                <div className="doctor-avatar-small">
                  <span className="avatar-text">ME</span>
                </div>
              </div>

              {/* Video controls */}
              <div className="video-controls">
                <button className="control-btn video-btn">
                  <svg className="control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="control-btn audio-btn">
                  <svg className="control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
                <button className="control-btn end-call-btn">
                  <svg className="control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 3l1.5 1.5M21 21l-1.5-1.5m0 0L3 3m16.5 16.5L21 21M12 18l.5-1.5m-.5 1.5l-.5-1.5m.5 1.5V21m0-3l1.5-.5M12 18l-1.5-.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Consultation Form - Con el mismo estilo que consultas presenciales */}
            <div className="consultation-form">
              <div className="form-header">
                <h2 className="form-title">Consulta Virtual - {patientName}</h2>
                <div className="patient-details">
                  <span><strong>Cédula:</strong> {cita?.paciente?.usuario?.cedula || 'N/A'}</span>
                  <span className="allergy-badge">Consulta Virtual</span>
                  <span><strong>Expediente:</strong> {cita?.expediente?.folio || 'N/A'}</span>
                </div>
              </div>

              <div className="form-content">
                <div className="form-columns">
                  {/* Left Column */}
                  <div className="form-column">
                    <div className="form-group">
                      <label className="form-label">Motivo de Consulta</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Motivo de la consulta..." 
                        rows="3"
                        defaultValue={cita?.motivo_consulta || ''}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Evolución</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Describe la evolución del paciente..." 
                        rows="4"
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="form-column">
                    <div className="form-group">
                      <label className="form-label">Diagnóstico</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Diagnóstico principal y secundario" 
                        rows="4"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Plan de manejo</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="Plan terapéutico y de recomendaciones" 
                        rows="4"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Bottom Sections */}
                <div className="form-bottom">
                  <div className="form-group">
                    <div className="form-group-header">
                      <label className="form-label">Medicamentos</label>
                      <button className="add-button">
                        + Agregar
                      </button>
                    </div>
                    <div className="medications-container">
                      {medications.length === 0 ? (
                        <p className="empty-state">No hay medicamentos agregados</p>
                      ) : (
                        medications.map((med, index) => (
                          <div key={index} className="medication-item">
                            <div className="medication-name">{med.name}</div>
                            <div className="medication-details">
                              {med.dose} - {med.frequency}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-header">
                      <label className="form-label">Órdenes de laboratorio</label>
                      <button className="add-button">
                        + Agregar
                      </button>
                    </div>
                    <div className="lab-orders-container">
                      <p className="empty-state">Tipos de exámenes</p>
                      <select className="form-select">
                        <option>Urgente</option>
                        <option>Normal</option>
                        <option>Rutina</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="outline-button">
                    Generar Resumen
                  </button>
                  <button className="primary-button">
                    Finalizar Consulta
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="chat-sidebar">
            <div className="chat-container">
              <div className="chat-header">
                <h3 className="chat-title">
                  <svg className="chat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Chat de la consulta
                </h3>
              </div>
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index}>
                    {index === 0 && <div className="message-time">15:05</div>}
                    <div className={`message ${msg.sender}-message`}>
                      <div className="message-content">{msg.message}</div>
                      {msg.sender === 'doctor' && <div className="message-time">15:06</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input-container">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribir mensaje..."
                  className="chat-input"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} className="send-button">
                  <svg className="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}