import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './Expediente.css';

export default function ExpedientePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("María González")
  const [activeView, setActiveView] = useState("info")

  const patients = [
    {
      id: 1,
      name: "María González",
      age: "45 años",
      initials: "MG",
      color: "patient-pink",
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      age: "38 años",
      initials: "CR",
      color: "patient-blue",
    },
    {
      id: 3,
      name: "Ana Martinez",
      age: "29 años",
      initials: "AM",
      color: "patient-purple",
    },
  ]

  const patientData = {
    "María González": {
      personalData: {
        nombre: "María González",
        edad: "45 años",
        genero: "Femenino",
        telefono: "+52 55 1234 5678",
        email: "maria.gonzalez@example.com",
      },
      medicalInfo: {
        tipoSangre: "O+",
        alergias: "Penicilina, Mariscos",
        condiciones: "Diabetes tipo 2, Hipertensión arterial",
      },
      medications: ["Metformina 500mg", "Losartán 50mg"],
      prescriptions: [
        {
          medication: "Metformina 500mg",
          frequency: "1 tableta cada 12 horas",
          date: "23/11/2024",
          status: "ACTIVA",
        },
      ],
      history: [
        {
          date: "10/11/2024",
          type: "Consulta",
          description: "Chequeo general",
          doctor: "Dr. Juan Pérez",
          color: "badge-blue",
        },
        {
          date: "05/11/2024",
          type: "Laboratorio",
          description: "Análisis de sangre",
          doctor: "Dr. Laura García",
          color: "badge-green",
        },
        {
          date: "01/11/2024",
          type: "Emergencia",
          description: "Dolor de pecho",
          doctor: "Dr. Carlos Ruiz",
          color: "badge-red",
        },
      ],
    },
    "Carlos Rodriguez": {
      personalData: {
        nombre: "Carlos Rodriguez",
        edad: "38 años",
        genero: "Masculino",
        telefono: "+52 55 9876 5432",
        email: "carlos.rodriguez@example.com",
      },
      medicalInfo: {
        tipoSangre: "A+",
        alergias: "Ninguna conocida",
        condiciones: "Hipertensión",
      },
      medications: ["Enalapril 10mg"],
      prescriptions: [],
      history: [
        {
          date: "08/11/2024",
          type: "Consulta",
          description: "Control de presión",
          doctor: "Dr. Ana López",
          color: "badge-blue",
        },
      ],
    },
    "Ana Martinez": {
      personalData: {
        nombre: "Ana Martinez",
        edad: "29 años",
        genero: "Femenino",
        telefono: "+52 55 5555 1234",
        email: "ana.martinez@example.com",
      },
      medicalInfo: {
        tipoSangre: "B+",
        alergias: "Aspirina",
        condiciones: "Migraña crónica",
      },
      medications: ["Sumatriptán 50mg"],
      prescriptions: [],
      history: [
        {
          date: "12/11/2024",
          type: "Consulta",
          description: "Seguimiento migraña",
          doctor: "Dr. Pedro Sánchez",
          color: "badge-blue",
        },
      ],
    },
  }

  const currentPatient = patientData[selectedPatient] || patientData["María González"]

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

  return (
    <div className={`expediente-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
      <div className="expediente-main">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h1 className="header-title">Expediente Clínico</h1>
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
        <div className="expediente-content">
          <div className="content-layout">
            {/* Patient List Sidebar */}
            <div className="patients-sidebar">
              <div className="patients-card">
                <div className="card-header">
                  <h2 className="card-title">Pacientes</h2>
                </div>
                <div className="card-content">
                  <div className="patients-list">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient.name)}
                        className={`patient-item ${selectedPatient === patient.name ? 'patient-selected' : ''}`}
                      >
                        <div className={`patient-avatar ${patient.color}`}>
                          <span className="patient-initials">{patient.initials}</span>
                        </div>
                        <div className="patient-info">
                          <div className="patient-name">{patient.name}</div>
                          <div className="patient-age">{patient.age}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="main-content-area">
              {/* Patient Information */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-row">
                    <h2 className="card-title">
                      <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Información del paciente
                    </h2>
                    <div className="view-buttons">
                      <button
                        className={`view-button ${activeView === "info" ? "view-active" : ""}`}
                        onClick={() => setActiveView("info")}
                      >
                        Datos Personales
                      </button>
                      <button
                        className={`view-button ${activeView === "prescriptions" ? "view-active" : ""}`}
                        onClick={() => setActiveView("prescriptions")}
                      >
                        Información Médica
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  {activeView === "info" ? (
                    <div className="tabs-container">
                      <div className="tabs-header">
                        <button className="tab-button tab-active">Datos Personales</button>
                        <button className="tab-button">Información Médica</button>
                      </div>
                      <div className="tab-content">
                        <div className="personal-data">
                          <div className="data-grid">
                            <div className="data-field">
                              <label className="field-label">Nombre:</label>
                              <p className="field-value">{currentPatient.personalData.nombre}</p>
                            </div>
                            <div className="data-field">
                              <label className="field-label">Edad:</label>
                              <p className="field-value">{currentPatient.personalData.edad}</p>
                            </div>
                            <div className="data-field">
                              <label className="field-label">Género:</label>
                              <p className="field-value">{currentPatient.personalData.genero}</p>
                            </div>
                            <div className="data-field">
                              <label className="field-label">Teléfono:</label>
                              <p className="field-value">{currentPatient.personalData.telefono}</p>
                            </div>
                            <div className="data-field full-width">
                              <label className="field-label">Email:</label>
                              <p className="field-value">{currentPatient.personalData.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="medical-content">
                      {/* Medications and Prescriptions */}
                      <div className="medications-section">
                        <h3 className="section-title">Medicamentos Actuales</h3>
                        <div className="medications-grid">
                          {currentPatient.medications.map((medication, index) => (
                            <div key={index} className="medication-item">
                              <p className="medication-name">{medication}</p>
                            </div>
                          ))}
                        </div>

                        <h3 className="section-title">Recetas Electrónicas</h3>
                        {currentPatient.prescriptions.length > 0 ? (
                          <div className="prescriptions-list">
                            {currentPatient.prescriptions.map((prescription, index) => (
                              <div key={index} className="prescription-item">
                                <div className="prescription-info">
                                  <p className="prescription-medication">{prescription.medication}</p>
                                  <p className="prescription-frequency">{prescription.frequency}</p>
                                  <p className="prescription-date">Fecha: {prescription.date}</p>
                                </div>
                                <div className="prescription-actions">
                                  <span className="prescription-status">{prescription.status}</span>
                                  <button className="print-button">Imprimir</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-prescriptions">No hay recetas electrónicas</p>
                        )}

                        <div className="new-prescription">
                          <h4 className="new-prescription-title">Crear nueva receta</h4>
                          <div className="prescription-form">
                            <div className="form-grid">
                              <input type="text" placeholder="Medicamento" className="form-input" />
                              <input type="text" placeholder="Dosis" className="form-input" />
                              <input type="text" placeholder="Frecuencia" className="form-input" />
                              <input type="text" placeholder="Duración" className="form-input" />
                            </div>
                            <input type="text" placeholder="Instrucciones Especiales" className="form-input full-width" />
                            <div className="form-buttons">
                              <button className="primary-button">Guardar Receta</button>
                              <button className="secondary-button">Guardar Borrador</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Medical History */}
              <div className="history-card">
                <div className="card-header">
                  <h2 className="card-title">Historial Médico</h2>
                </div>
                <div className="card-content">
                  <div className="history-list">
                    {currentPatient.history.map((entry, index) => (
                      <div key={index} className="history-item">
                        <div className="history-info">
                          <div className="history-date">{entry.date}</div>
                          <div className="history-details">
                            <p className="history-description">{entry.description}</p>
                            <p className="history-doctor">{entry.doctor}</p>
                          </div>
                        </div>
                        <span className={`history-badge ${entry.color}`}>{entry.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents and Studies */}
              <div className="documents-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Documentos y Estudios
                  </h2>
                </div>
                <div className="card-content">
                  <div className="documents-grid">
                    <div className="document-item">
                      <svg className="document-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="document-info">
                        <p className="document-name">Análisis de sangre</p>
                        <p className="document-date">23/11/2024</p>
                      </div>
                    </div>
                    <div className="document-item">
                      <svg className="document-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="document-info">
                        <p className="document-name">Radiografía de tórax</p>
                        <p className="document-date">10/11/2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}