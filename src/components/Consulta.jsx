import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Consulta.css';

export default function ConsultationPage() {
  const { patient } = useParams();
  
  // Decode the patient name from URL
  const patientName = decodeURIComponent(patient || 'María González');

  // Mock patient data
  const patientData = {
    name: patientName,
    age: "45 años",
    id: "P-001234",
    type: "Presencial",
    initials: patientName.split(" ").map((n) => n[0]).join(""),
    lastVisit: "15/11/2024",
    allergies: ["Penicilina", "Mariscos"],
    currentMedications: ["Metformina 500mg", "Losartán 50mg"],
    currentDiagnosis: ["Diabetes tipo 2"],
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar estático */}
      <div className="sidebar">
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-logo">
            <img src="/sinaes-logo.png" alt="SINAES Logo" className="logo-img" />
            <span className="logo-text">SINAES</span>
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="nav-item">
              <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="nav-text">Agenda de Citas</span>
            </Link>

            <Link to="#" className="nav-item">
              <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="nav-text">Teleconsultas</span>
            </Link>

            <Link to="#" className="nav-item nav-item-active">
              <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="nav-text">Expediente Clínico</span>
            </Link>

            <Link to="#" className="nav-item">
              <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              <span className="nav-text">Archivos y Resultados</span>
            </Link>

            <Link to="#" className="nav-item">
              <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="nav-text">Seguimiento y Control</span>
            </Link>

            <Link to="#" className="nav-item">
              <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826 2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="nav-text">Configuración / Perfil</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header estático */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="header-title">Consulta - {patientData.name}</h1>
            </div>

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

        {/* Patient Info Header */}
        <div className="patient-header-info">
          <div className="patient-header-content">
            <div className="patient-identity">
              <div className="patient-avatar-large">
                <span className="avatar-text">{patientData.initials}</span>
              </div>
              <div className="patient-details">
                <h2 className="patient-name-large">{patientData.name}</h2>
                <p className="patient-info-large">
                  {patientData.age} • {patientData.id} • {patientData.type}
                </p>
              </div>
            </div>

            <Link to="/dashboard" className="close-consultation-btn">
              <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cerrar Consulta
            </Link>
          </div>
        </div>

        {/* Consultation Content */}
        <div className="consultation-content">
          {/* Left Panel - Patient Quick Record */}
          <div className="patient-record-panel">
            <div className="record-card">
              <div className="card-header">
                <h3 className="card-title">Expediente Rápido</h3>
              </div>
              <div className="card-content">
                {/* Basic Information */}
                <div className="info-section">
                  <h4 className="info-section-title">Información Básica</h4>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="info-label">Edad:</span>
                      <span className="info-value">{patientData.age}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">ID:</span>
                      <span className="info-value">{patientData.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Última visita:</span>
                      <span className="info-value">{patientData.lastVisit}</span>
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div className="info-section">
                  <h4 className="info-section-title">Alergias</h4>
                  <div className="allergies-grid">
                    {patientData.allergies.map((allergy, index) => (
                      <div key={index} className="allergy-item">
                        {allergy}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div className="info-section">
                  <h4 className="info-section-title">Medicamentos Actuales</h4>
                  <div className="medications-list">
                    {patientData.currentMedications.map((medication, index) => (
                      <div key={index} className="medication-item">
                        {medication}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Diagnosis */}
                <div className="info-section">
                  <h4 className="info-section-title">Diagnóstico Actual</h4>
                  <div className="diagnosis-list">
                    {patientData.currentDiagnosis.map((diagnosis, index) => (
                      <div key={index} className="diagnosis-item">
                        {diagnosis}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Consultation Record */}
          <div className="consultation-record-panel">
            <div className="record-card">
              <div className="card-header">
                <h3 className="card-title">Registro de consulta</h3>
              </div>
              <div className="card-content">
                {/* Patient Evolution */}
                <div className="form-section">
                  <h4 className="form-section-title">Evolución del paciente</h4>
                  <textarea
                    placeholder="Describe la evolución y síntomas actuales del paciente..."
                    className="consultation-textarea"
                    rows={3}
                  />
                </div>

                {/* Diagnosis */}
                <div className="form-section">
                  <h4 className="form-section-title">Diagnóstico</h4>
                  <input 
                    type="text" 
                    placeholder="Diagnóstico principal" 
                    className="consultation-input"
                  />
                </div>

                {/* Management Plan */}
                <div className="form-section">
                  <h4 className="form-section-title">Plan de manejo</h4>
                  <textarea
                    placeholder="Describe el plan de tratamientos y recomendaciones."
                    className="consultation-textarea"
                    rows={3}
                  />
                </div>

                {/* Doctor Signature */}
                <div className="doctor-signature">
                  <p className="doctor-name">Dr. Melanie Espinoza</p>
                </div>
              </div>
            </div>

            {/* Medications Section */}
            <div className="record-card">
              <div className="card-header">
                <div className="medication-header">
                  <h3 className="card-title">Medicamentos</h3>
                  <button className="add-medication-btn">
                    + Agregar
                  </button>
                </div>
              </div>
              <div className="card-content">
                <div className="empty-medications">
                  No hay medicamentos agregados
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}