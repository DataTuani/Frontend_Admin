import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Consulta.css';

export default function ConsultationPage() {
  const { patient } = useParams();
  
  // Decode the patient name from URL
  const patientName = decodeURIComponent(patient || 'María González');

  // State for medications
  const [medications, setMedications] = useState([]);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showPdfSummary, setShowPdfSummary] = useState(false);
  const [medicationForm, setMedicationForm] = useState({
    medicamento: "",
    dosis: "",
    frecuencia: "",
    duracion: "",
    instrucciones: "",
  });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const medicationsPerPage = 5;
  
  // State for next appointment
  const [nextAppointment, setNextAppointment] = useState({
    fecha: "",
    hora: "",
    tipo: "Presencial",
  });
  
  // State for lab orders
  const [labOrders, setLabOrders] = useState([]);
  const [showLabOrderForm, setShowLabOrderForm] = useState(false);
  const [labOrderForm, setLabOrderForm] = useState({
    estudio: "",
    indicaciones: "",
  });

  const handleAddMedication = () => {
    if (medicationForm.medicamento.trim()) {
      const newMedication = {
        id: Date.now().toString(),
        ...medicationForm,
      };
      setMedications([...medications, newMedication]);
      setMedicationForm({
        medicamento: "",
        dosis: "",
        frecuencia: "",
        duracion: "",
        instrucciones: "",
      });
      setShowMedicationForm(false);
      // Reset to first page when adding a new medication
      setCurrentPage(1);
    }
  };

  const handleCancelMedication = () => {
    setMedicationForm({
      medicamento: "",
      dosis: "",
      frecuencia: "",
      duracion: "",
      instrucciones: "",
    });
    setShowMedicationForm(false);
  };
  
  const handleAddLabOrder = () => {
    if (labOrderForm.estudio.trim()) {
      const newLabOrder = {
        id: Date.now().toString(),
        ...labOrderForm,
      };
      setLabOrders([...labOrders, newLabOrder]);
      setLabOrderForm({
        estudio: "",
        indicaciones: "",
      });
      setShowLabOrderForm(false);
    }
  };
  
  const handleCancelLabOrder = () => {
    setLabOrderForm({
      estudio: "",
      indicaciones: "",
    });
    setShowLabOrderForm(false);
  };
  
  const handleScheduleAppointment = () => {
    if (nextAppointment.fecha) {
      alert(`Cita programada para el ${nextAppointment.fecha} a las ${nextAppointment.hora || '--:--'} (${nextAppointment.tipo})`);
      // Aquí iría la lógica para guardar la cita
    } else {
      alert("Por favor, selecciona una fecha para la cita");
    }
  };

  const handleSaveConsultation = () => {
    setShowPdfSummary(true);
  };

  // ... (código anterior se mantiene igual)

const handlePrintPdf = () => {
  // Forzar un re-render antes de imprimir
  setShowPdfSummary(true);
  
  // Usar un timeout para asegurar que el modal se haya renderizado
  setTimeout(() => {
    const originalTitle = document.title;
    document.title = `Resumen_Consulta_${patientData.name.replace(/\s+/g, '_')}`;
    
    // Ocultar elementos que no deben imprimirse
    const actionButtons = document.querySelector('.pdf-action-buttons');
    const closeButton = document.querySelector('.pdf-close-btn');
    const modalHeader = document.querySelector('.pdf-header');
    
    if (actionButtons) actionButtons.style.display = 'none';
    if (closeButton) closeButton.style.display = 'none';
    if (modalHeader) modalHeader.style.display = 'none';
    
    window.print();
    
    // Restaurar los elementos después de imprimir
    setTimeout(() => {
      if (actionButtons) actionButtons.style.display = 'flex';
      if (closeButton) closeButton.style.display = 'block';
      if (modalHeader) modalHeader.style.display = 'flex';
      
      document.title = originalTitle;
    }, 500);
  }, 100);
};

  const handleEmailPdf = () => {
    // In a real app, this would trigger email functionality
    alert("Funcionalidad de envío por email próximamente");
  };

  // Get current date for the PDF summary
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  // Pagination logic
  const indexOfLastMedication = currentPage * medicationsPerPage;
  const indexOfFirstMedication = indexOfLastMedication - medicationsPerPage;
  const currentMedications = medications.slice(indexOfFirstMedication, indexOfLastMedication);
  const totalPages = Math.ceil(medications.length / medicationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                  <button 
                    className="add-medication-btn"
                    onClick={() => setShowMedicationForm(true)}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
              <div className="card-content">
                {showMedicationForm ? (
                  <div className="medication-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="medicamento" className="form-label">Medicamento</label>
                        <input
                          id="medicamento"
                          type="text"
                          className="form-input"
                          value={medicationForm.medicamento}
                          onChange={(e) => setMedicationForm({...medicationForm, medicamento: e.target.value})}
                          placeholder="Medicamento"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="dosis" className="form-label">Dosis</label>
                        <input
                          id="dosis"
                          type="text"
                          className="form-input"
                          value={medicationForm.dosis}
                          onChange={(e) => setMedicationForm({...medicationForm, dosis: e.target.value})}
                          placeholder="Dosis"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="frecuencia" className="form-label">Frecuencia</label>
                        <input
                          id="frecuencia"
                          type="text"
                          className="form-input"
                          value={medicationForm.frecuencia}
                          onChange={(e) => setMedicationForm({...medicationForm, frecuencia: e.target.value})}
                          placeholder="Frecuencia"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="duracion" className="form-label">Duración</label>
                        <input
                          id="duracion"
                          type="text"
                          className="form-input"
                          value={medicationForm.duracion}
                          onChange={(e) => setMedicationForm({...medicationForm, duracion: e.target.value})}
                          placeholder="Duración"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="instrucciones" className="form-label">Instrucciones Especiales</label>
                      <textarea
                        id="instrucciones"
                        className="form-textarea"
                        value={medicationForm.instrucciones}
                        onChange={(e) => setMedicationForm({...medicationForm, instrucciones: e.target.value})}
                        placeholder="Instrucciones especiales"
                        rows={3}
                      />
                    </div>
                    <div className="form-buttons">
                      <button 
                        className="cancel-button"
                        onClick={handleCancelMedication}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="accept-button"
                        onClick={handleAddMedication}
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {medications.length === 0 ? (
                      <div className="empty-medications">
                        No hay medicamentos agregados
                      </div>
                    ) : (
                      <div>
                        <div className="medications-list">
                          {currentMedications.map((medication) => (
                            <div key={medication.id} className="medication-card">
                              <h4 className="medication-name">{medication.medicamento}</h4>
                              <div className="medication-details">
                                <div className="medication-detail">
                                  <span className="detail-label">Dosis:</span> {medication.dosis}
                                </div>
                                <div className="medication-detail">
                                  <span className="detail-label">Frecuencia:</span> {medication.frecuencia}
                                </div>
                                <div className="medication-detail">
                                  <span className="detail-label">Duración:</span> {medication.duracion}
                                </div>
                                {medication.instrucciones && (
                                  <div className="medication-detail">
                                    <span className="detail-label">Instrucciones:</span> {medication.instrucciones}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="pagination-controls">
                            <button
                              className="pagination-btn"
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              &laquo; Anterior
                            </button>
                            
                            <div className="pagination-numbers">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                <button
                                  key={pageNumber}
                                  className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                                  onClick={() => paginate(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              ))}
                            </div>
                            
                            <button
                              className="pagination-btn"
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Siguiente &raquo;
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lab Orders Section */}
            <div className="record-card">
              <div className="card-header">
                <div className="medication-header">
                  <h3 className="card-title">Órdenes de laboratorio</h3>
                  <button 
                    className="add-medication-btn"
                    onClick={() => setShowLabOrderForm(true)}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
              <div className="card-content">
                {showLabOrderForm ? (
                  <div className="medication-form">
                    <div className="form-group">
                      <label htmlFor="estudio" className="form-label">Estudio</label>
                      <input
                        id="estudio"
                        type="text"
                        className="form-input"
                        value={labOrderForm.estudio}
                        onChange={(e) => setLabOrderForm({...labOrderForm, estudio: e.target.value})}
                        placeholder="Nombre del estudio"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="indicaciones" className="form-label">Indicaciones</label>
                      <textarea
                        id="indicaciones"
                        className="form-textarea"
                        value={labOrderForm.indicaciones}
                        onChange={(e) => setLabOrderForm({...labOrderForm, indicaciones: e.target.value})}
                        placeholder="Indicaciones especiales"
                        rows={3}
                      />
                    </div>
                    <div className="form-buttons">
                      <button 
                        className="cancel-button"
                        onClick={handleCancelLabOrder}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="accept-button"
                        onClick={handleAddLabOrder}
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {labOrders.length === 0 ? (
                      <div className="empty-medications">
                        No hay órdenes de laboratorio
                      </div>
                    ) : (
                      <div className="medications-list">
                        {labOrders.map((order) => (
                          <div key={order.id} className="medication-card">
                            <h4 className="medication-name">{order.estudio}</h4>
                            {order.indicaciones && (
                              <div className="medication-detail">
                                <span className="detail-label">Indicaciones:</span> {order.indicaciones}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Next Appointment Section */}
            <div className="record-card">
              <div className="card-header">
                <div className="medication-header">
                  <h3 className="card-title">Próxima cita</h3>
                  <button 
                    className="add-medication-btn"
                    onClick={handleScheduleAppointment}
                  >
                    Programar Cita
                  </button>
                </div>
              </div>
              <div className="card-content">
                <div className="appointment-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fecha" className="form-label">Fecha</label>
                      <input
                        id="fecha"
                        type="date"
                        className="form-input"
                        value={nextAppointment.fecha}
                        onChange={(e) => setNextAppointment({...nextAppointment, fecha: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="hora" className="form-label">Hora</label>
                      <input
                        id="hora"
                        type="time"
                        className="form-input"
                        value={nextAppointment.hora}
                        onChange={(e) => setNextAppointment({...nextAppointment, hora: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="tipo-cita" className="form-label">Tipo de Cita</label>
                    <select
                      id="tipo-cita"
                      className="form-input"
                      value={nextAppointment.tipo}
                      onChange={(e) => setNextAppointment({...nextAppointment, tipo: e.target.value})}
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual">Virtual</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="action-buttons">
              <Link to="/dashboard" className="cancel-action-btn">
                Cancelar
              </Link>
              <button className="save-consultation-btn" onClick={handleSaveConsultation}>
                Guardar Consulta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Summary Modal */}
      {showPdfSummary && (
        <div className="pdf-modal-overlay">
          <div className="pdf-modal-content">
            <div className="pdf-header">
              <h1 className="pdf-title">Resumen de consulta-{patientData.name}</h1>
              <button 
                className="pdf-close-btn"
                onClick={() => setShowPdfSummary(false)}
              >
                &times;
              </button>
            </div>

            <div className="pdf-content">
              {/* Doctor Info Section */}
              <div className="pdf-doctor-info">
                <h2 className="pdf-doctor-name">Dr. Melanie Espinoza</h2>
                <p className="pdf-doctor-specialty">Medicina General</p>
                <p className="pdf-doctor-contact">Cédula: 001-241003-10338 Tel: 7616-8096</p>
                
                <div className="pdf-consultation-info">
                  <h3 className="pdf-consultation-title">Resumen de Consulta Médica</h3>
                  <p className="pdf-consultation-date">Fecha: {formattedDate}</p>
                </div>
              </div>

              <div className="pdf-divider"></div>

              {/* Patient Information */}
              {/* Patient Information */}
              {/* Patient Information */}
              <div className="pdf-patient-info">
                <h3 className="pdf-section-title">Paciente</h3>
                <table className="pdf-patient-details">
                  <tbody>
                    <tr className="pdf-patient-detail">
                      <td className="pdf-detail-label">Nombre:</td>
                      <td className="pdf-detail-value">{patientData.name}</td>
                    </tr>
                    <tr className="pdf-patient-detail">
                      <td className="pdf-detail-label">Expediente:</td>
                      <td className="pdf-detail-value">{patientData.id}</td>
                    </tr>
                    <tr className="pdf-patient-detail">
                      <td className="pdf-detail-label">Edad:</td>
                      <td className="pdf-detail-value">{patientData.age}</td>
                    </tr>
                    <tr className="pdf-patient-detail">
                      <td className="pdf-detail-label">Tipo de Consulta:</td>
                      <td className="pdf-detail-value">{patientData.type}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pdf-divider"></div>

              {/* General Recommendations */}
              <div className="pdf-recommendations">
                <h3 className="pdf-section-title">Recomendaciones Generales</h3>
                <ul className="pdf-recommendations-list">
                  <li>Tome los medicamentos según las indicaciones</li>
                  <li>Mantenga una dieta balanceada y ejercicio regular</li>
                  <li>Acuda a su próxima cita programada</li>
                  <li>En caso de emergencia, acuda al servicio de urgencias más cercano</li>
                  <li>Si tiene dudas, no dude en contactarnos</li>
                </ul>
              </div>

              <div className="pdf-divider"></div>

              {/* Doctor Signature */}
              <div className="pdf-signature">
                <p className="pdf-signature-label">Firma del médico</p>
                <div className="pdf-signature-details">
                  <p className="pdf-doctor-name-signature">Dr. Melanie Espinoza</p>
                  <p className="pdf-doctor-specialty-signature">Medicina General</p>
                  <p className="pdf-doctor-license">Cédula Profesional: 12345678</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pdf-action-buttons">
              <button className="pdf-action-btn pdf-cancel-btn" onClick={() => setShowPdfSummary(false)}>
                Cerrar
              </button>
              <button className="pdf-action-btn pdf-print-btn" onClick={handlePrintPdf}>
                Imprimir Resumen
              </button>
              <button className="pdf-action-btn pdf-email-btn" onClick={handleEmailPdf}>
                Enviar por email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}