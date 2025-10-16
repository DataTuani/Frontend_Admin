import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citasService } from '../../services/citas';
import { authService } from '../../hooks/auth';
import './MainContent.css';

export default function MainContent() {
  const navigate = useNavigate();
  const [allCitas, setAllCitas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Nuevo estado para tipo de consulta
  const [appointmentType, setAppointmentType] = useState('todas'); // 'todas', 'presencial', 'virtual'

  useEffect(() => {
    console.log('Token: ', authService.getToken());
    console.log('User ID: ', authService.getUserId());
    console.log('Authenticated: ', authService.isAuthenticated());
    console.log('User Data: ', authService.getUser());
    console.log('Hospital ID: ', localStorage.getItem('hospitalId'));

    const fetchCitas = async () => {
      try {
        setLoading(true);
        setError('');

        const doctorId = authService.getUserId();
        
        if (!doctorId) {
          if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
          }
          throw new Error('No se pudo obtener el ID del doctor');
        }
        
        const response = await citasService.getCitasByDoctor(doctorId);
        console.log('Citas obtenidas:', response);
        
        if (response.success) {
          // Guardar todas las citas y mostrar todas inicialmente
          const sortedCitas = response.citas.sort((a, b) => 
            new Date(b.fecha_hora) - new Date(a.fecha_hora)
          );
          
          setAllCitas(sortedCitas);
          setFilteredCitas(sortedCitas);
        } else {
          setError('Error al cargar las citas');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        if (err.message.includes('Sesión expirada')) {
          authService.logout();
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();

    const handleAuthError = () => {
      setError('Sesión expirada. Redirigiendo...');
      setTimeout(() => authService.logout(), 2000);
    };

    window.addEventListener('authError', handleAuthError);
    return () => window.removeEventListener('authError', handleAuthError);
  }, [navigate]);

  // Aplicar filtros de búsqueda, fecha y tipo
  useEffect(() => {
    let result = allCitas;

    // Filtrar por tipo de consulta
    if (appointmentType !== 'todas') {
      result = result.filter(cita => {
        const tipo = cita.tipo.tipo.toLowerCase();
        if (appointmentType === 'virtual') {
          return tipo.includes('virtual');
        } else if (appointmentType === 'presencial') {
          return tipo.includes('presencial');
        }
        return true;
      });
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(cita =>
        cita.paciente.usuario.primer_nombre.toLowerCase().includes(searchLower) ||
        cita.paciente.usuario.primer_apellido.toLowerCase().includes(searchLower) ||
        cita.paciente.usuario.cedula.toLowerCase().includes(searchLower) ||
        cita.expediente.folio.toLowerCase().includes(searchLower) ||
        cita.motivo_consulta.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por rango de fechas
    if (dateRange.startDate) {
      const start = new Date(dateRange.startDate);
      result = result.filter(cita => new Date(cita.fecha_hora) >= start);
    }

    if (dateRange.endDate) {
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999); // Incluir todo el día
      result = result.filter(cita => new Date(cita.fecha_hora) <= end);
    }

    setFilteredCitas(result);
    setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
  }, [allCitas, searchTerm, dateRange, appointmentType]);

  // Calcular páginas cuando cambian los elementos filtrados o items por página
  useEffect(() => {
    const total = Math.ceil(filteredCitas.length / itemsPerPage);
    setTotalPages(total || 1);
    
    // Si la página actual es mayor que el total de páginas, ir a la última página
    if (currentPage > total && total > 0) {
      setCurrentPage(total);
    }
  }, [filteredCitas, itemsPerPage, currentPage]);

  // Obtener citas para la página actual
  const getCurrentPageCitas = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCitas.slice(startIndex, endIndex);
  };

  const handleAttend = (cita) => {
    if (cita.estado.nombre === 'Pendiente' || cita.estado.nombre === 'Confirmado') {
      const isVirtual = cita.tipo.tipo.toLowerCase().includes('virtual');
      
      if (isVirtual) {
        // Redirigir a teleconsulta
        navigate(`/teleconsulta/${cita.paciente.usuario.id}`, {
          state: { 
            cita,
            pacienteId: cita.paciente.id,
            userId: cita.paciente.usuario.id,
            pacienteNombre: `${cita.paciente.usuario.primer_nombre} ${cita.paciente.usuario.primer_apellido}`,
            roomId: cita.roomId || `room_${cita.id}_${Date.now()}`
          }
        });
      } else {
        // Redirigir a consulta presencial
        navigate(`/consulta/${cita.paciente.usuario.id}`, {
          state: { 
            cita,
            pacienteId: cita.paciente.id,
            userId: cita.paciente.usuario.id,
            pacienteNombre: `${cita.paciente.usuario.primer_nombre} ${cita.paciente.usuario.primer_apellido}`
          }
        });
      }
    }
  };

  const handleDateFilter = () => {
    setFilteredCitas(allCitas); // Resetear filtros
    setDateRange({ startDate: '', endDate: '' });
    setAppointmentType('todas');
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Volver a la primera página cuando cambia el tamaño de página
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'status-pending';
      case 'confirmado':
        return 'status-confirmed';
      case 'atendido':
        return 'status-completed';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getAppointmentType = (cita) => {
    return cita.tipo.tipo.includes('Virtual') ? 'Virtual' : 'Presencial';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-content">
            <div className="loading">Cargando citas...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Quick Search */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Búsqueda y Filtros</h2>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar Filtros' : 'Filtros'}
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label htmlFor="appointmentType">Tipo:</label>
                <select
                  id="appointmentType"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="form-select"
                >
                  <option value="todas">Todas las citas</option>
                  <option value="virtual">Solo virtuales</option>
                  <option value="presencial">Solo presenciales</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="startDate">Desde:</label>
                <input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="date-input"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="endDate">Hasta:</label>
                <input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="date-input"
                />
              </div>

              <div className="filter-actions">
                <button 
                  className="clear-filters-button"
                  onClick={handleDateFilter}
                >
                  Limpiar Filtros
                </button>
                <span className="filter-count">
                  {filteredCitas.length} citas encontradas
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agenda */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-content">
            <h2 className="card-title">
              {appointmentType === 'todas' ? 'Todas las Citas' : 
               appointmentType === 'virtual' ? 'Citas Virtuales' : 'Citas Presenciales'} 
              ({filteredCitas.length})
            </h2>
            <div className="pagination-controls-top">
              <div className="items-per-page-selector">
                <label htmlFor="itemsPerPage">Mostrar:</label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="items-per-page-select"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="100">100</option>
                </select>
              </div>
              <button className="new-appointment-button">
                + Nueva Cita
              </button>
            </div>
          </div>
        </div>
        <div className="card-content">
          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}
          
          {filteredCitas.length === 0 ? (
            <div className="no-appointments">
              {searchTerm || dateRange.startDate || dateRange.endDate || appointmentType !== 'todas'
                ? 'No se encontraron citas que coincidan con los filtros' 
                : 'No hay citas programadas'
              }
            </div>
          ) : (
            <>
              <div className="appointments-list">
                {getCurrentPageCitas().map((cita) => (
                  <div key={cita.id} className="appointment-item">
                    <div className="appointment-info">
                      <div className="appointment-time">
                        <div className="appointment-date">{formatDate(cita.fecha_hora)}</div>
                        <div className="appointment-hour">{formatTime(cita.fecha_hora)}</div>
                      </div>
                      <div className="appointment-details">
                        <div className="patient-name">
                          {cita.paciente.usuario.primer_nombre} {cita.paciente.usuario.primer_apellido}
                        </div>
                        <div className="appointment-type">
                          <svg className="type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {getAppointmentType(cita) === 'Virtual' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            )}
                          </svg>
                          {getAppointmentType(cita)}
                          {cita.numero_turno && ` - Turno #${cita.numero_turno}`}
                        </div>
                        <div className="appointment-motive">
                          {cita.motivo_consulta}
                        </div>
                        <div className="appointment-full-date">
                          {formatDateTime(cita.fecha_hora)}
                        </div>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <span className={`status-badge ${getStatusColor(cita.estado.nombre)}`}>
                        {cita.estado.nombre}
                      </span>
                      {(cita.estado.nombre === 'Pendiente' || cita.estado.nombre === 'Confirmado') && (
                        <button 
                          className="attend-button"
                          onClick={() => handleAttend(cita)}
                        >
                          Atender
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Mostrando {Math.min(itemsPerPage, filteredCitas.length - (currentPage - 1) * itemsPerPage)} de {filteredCitas.length} citas
                  </div>
                  <div className="pagination-controls">
                    <button
                      className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>
                    <button
                      className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &lsaquo;
                    </button>
                    
                    {getPageNumbers().map(page => (
                      <button
                        key={page}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      &rsaquo;
                    </button>
                    <button
                      className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      &raquo;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}