import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../hooks/auth';
import { expedienteService } from '../../services/expedienteService';
import './Expediente.css';

export default function ExpedientePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeView, setActiveView] = useState("info");
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const nombre_completo_usuaro = authService.getUser()
        ? `${authService.getUser().primer_nombre} ${authService.getUser().primer_apellido}`
        : 'Invitado';
      document.title = `Bienvenido, Dr(a). ${nombre_completo_usuaro}`;

  // Estados para paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Cargar expedientes al montar el componente
   // Cargar expedientes al montar el componente
  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await expedienteService.getAllExpedientes();
        
        if (response.success && response.Expedientes) {
          setExpedientes(response.Expedientes);
          // Seleccionar el primer paciente por defecto
          if (response.Expedientes.length > 0) {
            setSelectedPatient(response.Expedientes[0]);
          }
        } else {
          throw new Error('No se pudieron cargar los expedientes');
        }
      } catch (error) {
        console.error('Error cargando expedientes:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpedientes();
  }, []);

   // Calcular pacientes para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = expedientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(expedientes.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para cambiar items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Volver a la primera página
  };

  // Función para calcular la edad a partir de la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'Edad no disponible';
    
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return `${edad} años`;
  };

  // Generar iniciales del nombre
  const generarIniciales = (usuario) => {
    if (!usuario) return 'P';
    const primerNombre = usuario.primer_nombre || '';
    const primerApellido = usuario.primer_apellido || '';
    return (primerNombre[0] + primerApellido[0]).toUpperCase() || 'P';
  };

  // Colores para los avatares
  const colores = ['patient-pink', 'patient-blue', 'patient-purple'];

  // Obtener datos del paciente seleccionado
  const getPatientData = (expediente) => {
    if (!expediente || !expediente.paciente) return null;

    const usuario = expediente.paciente.usuario;
    const alergias = expediente.paciente.alergias?.map(a => a.descripcion) || ['No registradas'];
    const enfermedades = expediente.paciente.enfermedades?.map(e => e.descripcion) || ['No registradas'];
    
    // Obtener medicamentos de la última consulta con receta
    const ultimaCita = expediente.paciente.citas?.find(c => c.consulta?.receta) || null;
    const medicamentos = ultimaCita?.consulta?.receta?.map(r => `${r.nombre} ${r.dosis}`) || ['No registrados'];

    // Prescripciones (recetas) de las consultas
    const prescriptions = expediente.paciente.citas
      ?.filter(c => c.consulta?.receta)
      .map(c => {
        const receta = c.consulta.receta[0]; // Tomamos la primera receta de la consulta
        return {
          medication: receta.nombre,
          frequency: receta.frecuencia,
          date: new Date(c.fecha_hora).toLocaleDateString('es-ES'),
          status: 'ACTIVA'
        };
      }) || [];

    // Historial de citas
    const history = expediente.paciente.citas?.map(cita => {
      let tipo = cita.tipo.tipo;
      let color = 'badge-blue';
      if (tipo.includes('Virtual')) color = 'badge-green';
      if (cita.estado.nombre === 'Cancelado') color = 'badge-red';

      return {
        date: new Date(cita.fecha_hora).toLocaleDateString('es-ES'),
        type: cita.tipo.tipo,
        description: cita.motivo_consulta,
        doctor: `Dr. ${cita.medico.usuario.primer_nombre} ${cita.medico.usuario.primer_apellido}`,
        color: color
      };
    }) || [];

    return {
      personalData: {
        nombre: `${usuario.primer_nombre || ''} ${usuario.segundo_nombre || ''} ${usuario.primer_apellido || ''} ${usuario.segundo_apellido || ''}`.trim(),
        edad: calcularEdad(usuario.fecha_nacimiento),
        genero: usuario.genero === 'M' ? 'Masculino' : 'Femenino',
        telefono: usuario.telefono || 'No registrado',
        email: usuario.correo || 'No registrado',
        cedula: usuario.cedula || 'No registrada',
        direccion: usuario.direccion || 'No registrada',
        fechaNacimiento: usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento).toLocaleDateString('es-ES') : 'No registrada'
      },
      medicalInfo: {
        tipoSangre: expediente.paciente.grupo_sanguineo || 'No registrado',
        alergias: alergias,
        condiciones: enfermedades,
      },
      medications: medicamentos,
      prescriptions: prescriptions,
      history: history,
      expedienteInfo: {
        folio: expediente.folio,
        fechaApertura: new Date(expediente.fecha_apertura).toLocaleDateString('es-ES'),
        hospital: expediente.hospital?.nombre || 'No especificado'
      }
    };
  };

  const currentPatientData = selectedPatient ? getPatientData(selectedPatient) : null;

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

  if (loading) {
    return (
      <div className="expediente-container">
        <div className="expediente-main">
          <div className="loading-container">
            <div className="loading">Cargando expedientes...</div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
                  <span className="avatar-text">C</span>
                </div>
                <span className="user-name">Dr(a). {nombre_completo_usuaro}</span>
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
          {error && (
            <div className="error-banner">
              <span>⚠️ Error al cargar expedientes: {error}</span>
            </div>
          )}

          <div className="content-layout">
            {/* Patient List Sidebar */}
            <div className="patients-sidebar">
              <div className="patients-card">
                <div className="card-header">
                  <h2 className="card-title">Pacientes ({expedientes.length})</h2>
                </div>
                <div className="card-content">
                  <div className="patients-list">
                    {currentPatients.map((expediente, index) => {
                      const usuario = expediente.paciente?.usuario;
                      if (!usuario) return null;
                      
                      const nombreCompleto = `${usuario.primer_nombre || ''} ${usuario.segundo_nombre || ''} ${usuario.primer_apellido || ''} ${usuario.segundo_apellido || ''}`.trim();
                      const edad = calcularEdad(usuario.fecha_nacimiento);
                      const iniciales = generarIniciales(usuario);
                      const colorIndex = index % colores.length;
                      
                      return (
                        <div
                          key={expediente.id}
                          onClick={() => setSelectedPatient(expediente)}
                          className={`patient-item ${selectedPatient?.id === expediente.id ? 'patient-selected' : ''}`}
                        >
                          <div className={`patient-avatar ${colores[colorIndex]}`}>
                            <span className="patient-initials">{iniciales}</span>
                          </div>
                          <div className="patient-info">
                            <div className="patient-name">{nombreCompleto || 'Paciente sin nombre'}</div>
                            <div className="patient-age">{edad}</div>
                            <div className="patient-folio">Folio: {expediente.folio}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Paginación */}
                  {expedientes.length > 0 && (
                    <div className="pagination-container">
                      <div className="pagination-info">
                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, expedientes.length)} de {expedientes.length} pacientes
                      </div>
                      
                      <div className="pagination-controls">
                        <select 
                          className="page-size-select"
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={100}>100</option>
                        </select>
                        
                        <div className="pagination-buttons">
                          <button
                            className="page-button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNumber}
                                className={`page-button ${currentPage === pageNumber ? 'page-button-active' : ''}`}
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            className="page-button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content-area">
              {currentPatientData ? (
                <>
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
                          <div className="tab-content">
                            <div className="personal-data">
                              <div className="data-grid">
                                <div className="data-field">
                                  <label className="field-label">Nombre completo:</label>
                                  <p className="field-value">{currentPatientData.personalData.nombre}</p>
                                </div>
                                <div className="data-field">
                                  <label className="field-label">Edad:</label>
                                  <p className="field-value">{currentPatientData.personalData.edad}</p>
                                </div>
                                <div className="data-field">
                                  <label className="field-label">Género:</label>
                                  <p className="field-value">{currentPatientData.personalData.genero}</p>
                                </div>
                                <div className="data-field">
                                  <label className="field-label">Teléfono:</label>
                                  <p className="field-value">{currentPatientData.personalData.telefono}</p>
                                </div>
                                <div className="data-field">
                                  <label className="field-label">Cédula:</label>
                                  <p className="field-value">{currentPatientData.personalData.cedula}</p>
                                </div>
                                <div className="data-field">
                                  <label className="field-label">Fecha de Nacimiento:</label>
                                  <p className="field-value">{currentPatientData.personalData.fechaNacimiento}</p>
                                </div>
                                <div className="data-field full-width">
                                  <label className="field-label">Dirección:</label>
                                  <p className="field-value">{currentPatientData.personalData.direccion}</p>
                                </div>
                                <div className="data-field full-width">
                                  <label className="field-label">Email:</label>
                                  <p className="field-value">{currentPatientData.personalData.email}</p>
                                </div>
                                <div className="data-field">
                                  <label className="field-label">Folio Expediente:</label>
                                  <p className="field-value">{currentPatientData.expedienteInfo.folio}</p>
                                </div>
                                <div className="data-field">
                                  <label className="field-label">Hospital:</label>
                                  <p className="field-value">{currentPatientData.expedienteInfo.hospital}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="medical-content">
                          {/* Medical Information */}
                          <div className="medications-section">
                            <h3 className="section-title">Información Médica General</h3>
                            <div className="data-grid">
                              <div className="data-field">
                                <label className="field-label">Grupo Sanguíneo:</label>
                                <p className="field-value">{currentPatientData.medicalInfo.tipoSangre}</p>
                              </div>
                              <div className="data-field full-width">
                                <label className="field-label">Alergias:</label>
                                <div className="allergies-list">
                                  {currentPatientData.medicalInfo.alergias.map((alergia, index) => (
                                    <span key={index} className="allergy-tag">{alergia}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="data-field full-width">
                                <label className="field-label">Condiciones/Enfermedades:</label>
                                <div className="conditions-list">
                                  {currentPatientData.medicalInfo.condiciones.map((condicion, index) => (
                                    <span key={index} className="condition-tag">{condicion}</span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <h3 className="section-title">Medicamentos Actuales</h3>
                            <div className="medications-grid">
                              {currentPatientData.medications.map((medication, index) => (
                                <div key={index} className="medication-item">
                                  <p className="medication-name">{medication}</p>
                                </div>
                              ))}
                            </div>

                            <h3 className="section-title">Recetas Electrónicas</h3>
                            {currentPatientData.prescriptions.length > 0 ? (
                              <div className="prescriptions-list">
                                {currentPatientData.prescriptions.map((prescription, index) => (
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
                              <p className="no-prescriptions">No hay recetas electrónicas registradas</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="history-card">
                    <div className="card-header">
                      <h2 className="card-title">Historial de Consultas</h2>
                    </div>
                    <div className="card-content">
                      {currentPatientData.history.length > 0 ? (
                        <div className="history-list">
                          {currentPatientData.history.map((entry, index) => (
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
                      ) : (
                        <p className="no-history">No hay historial de consultas registrado</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-patient-selected">
                  <p>Selecciona un paciente para ver su expediente</p>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}