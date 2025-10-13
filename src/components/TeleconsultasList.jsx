import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { citasService } from '../services/citas';
import { authService } from '../services/auth';
import './TeleconsultasList.css';

export default function TeleconsultasList() {
  const navigate = useNavigate();
  const [teleconsultas, setTeleconsultas] = useState([]);
  const [filteredTeleconsultas, setFilteredTeleconsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const nombre_completo_usuaro = authService.getUser()
      ? `${authService.getUser().primer_nombre} ${authService.getUser().primer_apellido}`
      : 'Invitado';
    document.title = `Bienvenido, Dr(a). ${nombre_completo_usuaro}`;

  // Estados para estadísticas
  const [stats, setStats] = useState({
    totalCitas: 0,
    presenciales: 0,
    virtuales: 0,
    pendientes: 0
  });

  useEffect(() => {
    const fetchTeleconsultas = async () => {
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
        console.log('Todas las citas obtenidas:', response);
        
        if (response.success) {
          // Filtrar SOLO las citas virtuales
          const citasVirtuales = response.citas.filter(cita => 
            cita.tipo.tipo.toLowerCase().includes('virtual')
          );
          
          console.log('Citas virtuales filtradas:', citasVirtuales);
          
          setTeleconsultas(citasVirtuales);
          setFilteredTeleconsultas(citasVirtuales);
          
          // Calcular estadísticas
          const totalCitas = citasVirtuales.length;
          const pendientes = citasVirtuales.filter(cita => 
            cita.estado.nombre === 'Pendiente' || cita.estado.nombre === 'Confirmado'
          ).length;
          
          setStats({
            totalCitas,
            presenciales: 0, // En teleconsultas no hay presenciales
            virtuales: totalCitas,
            pendientes
          });
        } else {
          setError('Error al cargar las teleconsultas');
        }
      } catch (err) {
        console.error('Error fetching teleconsultas:', err);
        if (err.message.includes('Sesión expirada')) {
          authService.logout();
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeleconsultas();
  }, [navigate]);

  // Filtrar teleconsultas por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = teleconsultas.filter(consulta =>
        `${consulta.paciente.usuario.primer_nombre} ${consulta.paciente.usuario.primer_apellido}`
          .toLowerCase().includes(searchLower) ||
        consulta.paciente.usuario.cedula.toLowerCase().includes(searchLower) ||
        consulta.expediente.folio.toLowerCase().includes(searchLower) ||
        consulta.motivo_consulta.toLowerCase().includes(searchLower)
      );
      setFilteredTeleconsultas(filtered);
    } else {
      setFilteredTeleconsultas(teleconsultas);
    }
  }, [searchTerm, teleconsultas]);

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

  const getEstadoDisplay = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmado':
        return 'Confirmado';
      case 'atendido':
        return 'Atendido';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const handleAttend = (consulta) => {
    if (consulta.estado.nombre === 'Pendiente' || consulta.estado.nombre === 'Confirmado') {
      navigate(`/teleconsulta/${consulta.paciente.usuario.id}`, {
        state: { 
          cita: consulta,
          pacienteId: consulta.paciente.id,
          userId: consulta.paciente.usuario.id,
          pacienteNombre: `${consulta.paciente.usuario.primer_nombre} ${consulta.paciente.usuario.primer_apellido}`,
          roomId: consulta.roomId || `room_${consulta.id}_${Date.now()}`
        }
      });
    }
  };

  const handleNewTeleconsulta = () => {
    navigate('/nueva-cita', { state: { tipoPredefinido: 'virtual' } });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilteredTeleconsultas(teleconsultas);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <div className="loading">Cargando teleconsultas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-main">
        {/* Header */}
        <header className="teleconsultas-header">
          <div className="header-content">
            <h1 className="header-title">Teleconsultas</h1>
            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">
                  <span className="avatar-text">C</span>
                </div>
                <span className="user-name">Dr(a). {nombre_completo_usuaro}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="teleconsultas-content">
          <div className="teleconsultas-main">
            {/* Búsqueda y Filtros */}
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
                    <div className="filter-actions">
                      <button 
                        className="clear-filters-button"
                        onClick={clearFilters}
                      >
                        Limpiar Filtros
                      </button>
                      <span className="filter-count">
                        {filteredTeleconsultas.length} teleconsultas encontradas
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Teleconsultas */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-content">
                  <h2 className="card-title">
                    Teleconsultas ({filteredTeleconsultas.length})
                  </h2>
                  <div className="pagination-controls-top">
                    <button 
                      className="new-appointment-button"
                      onClick={handleNewTeleconsulta}
                    >
                      + Nueva Teleconsulta
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
                
                {filteredTeleconsultas.length === 0 ? (
                  <div className="no-appointments">
                    {searchTerm
                      ? 'No se encontraron teleconsultas que coincidan con la búsqueda' 
                      : 'No hay teleconsultas programadas'
                    }
                  </div>
                ) : (
                  <div className="appointments-list">
                    {filteredTeleconsultas.map((consulta) => (
                      <div key={consulta.id} className="appointment-item">
                        <div className="appointment-info">
                          <div className="appointment-time">
                            <div className="appointment-date">{formatDate(consulta.fecha_hora)}</div>
                            <div className="appointment-hour">{formatTime(consulta.fecha_hora)}</div>
                          </div>
                          <div className="appointment-details">
                            <div className="patient-name">
                              {consulta.paciente.usuario.primer_nombre} {consulta.paciente.usuario.primer_apellido}
                            </div>
                            <div className="appointment-type virtual">
                              <svg className="type-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Virtual
                              {consulta.numero_turno && ` - Turno #${consulta.numero_turno}`}
                            </div>
                            <div className="appointment-motive">
                              {consulta.motivo_consulta}
                            </div>
                            <div className="appointment-full-date">
                              {formatDateTime(consulta.fecha_hora)}
                            </div>
                          </div>
                        </div>
                        <div className="appointment-actions">
                          <span className={`status-badge ${getStatusColor(consulta.estado.nombre)}`}>
                            {getEstadoDisplay(consulta.estado.nombre)}
                          </span>
                          {(consulta.estado.nombre === 'Pendiente' || consulta.estado.nombre === 'Confirmado') && (
                            <button 
                              className="attend-button"
                              onClick={() => handleAttend(consulta)}
                            >
                              Unirse
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar de Estadísticas */}
          <div className="teleconsultas-sidebar">
            <div className="stats-card">
              <h3 className="stats-title">Resumen del día</h3>
              
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-label">Total Teleconsultas</div>
                  <div className="stat-value">{stats.totalCitas}</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-label">Pendientes</div>
                  <div className="stat-value">{stats.pendientes}</div>
                </div>
              </div>
            </div>
            
            <div className="doctor-card">
              <h3 className="doctor-name">Próximas Teleconsultas</h3>
              <div className="upcoming-stats">
                <div className="upcoming-stat">
                  <div className="upcoming-value">{stats.totalCitas}</div>
                  <div className="upcoming-label">Total</div>
                </div>
                <div className="upcoming-stat">
                  <div className="upcoming-value">{stats.pendientes}</div>
                  <div className="upcoming-label">Pendientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}