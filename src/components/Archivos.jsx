import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { ordenesLabService } from '../services/ordenesLabService';
import './Archivos.css';
import Alert from './Alerta';

export default function ArchivosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados para el modal de subida de archivos
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentOrdenId, setCurrentOrdenId] = useState(null);


  // Estados para alertas
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Función para cargar órdenes - MOVIDA FUERA DEL useEffect
  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ordenesLabService.getAllOrdenes();
      
      if (response.success) {
        setOrdenes(response.ordenes);
      } else {
        throw new Error('No se pudieron cargar las órdenes');
      }
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrdenes();
  }, []);


  // Función para mostrar alertas
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleOpenUploadModal = (ordenId) => {
    console.log('Abriendo modal para orden:', ordenId);
    setCurrentOrdenId(ordenId);
    setShowUploadModal(true);
    setShowConfirmation(false);
    setSelectedFile(null);
    setFileName('');
  };

  // Función para manejar la selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar que sea un PDF
      if (file.type !== 'application/pdf') {
        showAlert('error', 'Solo se permiten archivos PDF');
        return;
      }

      // Verificar tamaño del archivo (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        showAlert('error', 'El archivo no debe superar los 10MB');
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
      setShowConfirmation(true);
    }
  };

  // Función para manejar el drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const inputEvent = {
        target: {
          files: [file]
        }
      };
      handleFileSelect(inputEvent);
    }
  };

  // Función para prevenir el comportamiento por defecto del drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Función para subir el archivo
  const handleUpload = async () => {
  console.log('handleUpload llamado - currentOrdenId:', currentOrdenId, 'selectedFile:', selectedFile);
  
  if (!selectedFile) {
    console.error('No hay archivo seleccionado');
    showAlert('error', 'No hay archivo seleccionado');
    return;
  }

  if (!currentOrdenId) {
    console.error('No hay orden ID seleccionada');
    showAlert('error', 'No se ha seleccionado una orden');
    return;
  }

  setUploading(true);
  try {
    console.log('Subiendo archivo:', {
      nombre: selectedFile.name,
      tamaño: selectedFile.size,
      tipo: selectedFile.type,
      ordenId: currentOrdenId
    });
    
    // Llamar al servicio para subir el archivo
    const response = await ordenesLabService.uploadOrdenPdf(currentOrdenId, selectedFile);
    
    console.log('Respuesta completa del servidor:', response);
    
    if (response.success) {
      showAlert('success', 'Archivo subido exitosamente');
      
      // Recargar las órdenes para mostrar el archivo actualizado
      await fetchOrdenes();
      
      // Cerrar modales
      handleCloseModal();
    } else {
      throw new Error(response.message || 'Error al subir el archivo');
    }
    
  } catch (error) {
    console.error('Error completo subiendo archivo:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    showAlert('error', error.message || 'Error al subir el archivo. Verifica la consola para más detalles.');
  } finally {
    setUploading(false);
  }
};

  // Función para cancelar la subida
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setFileName('');
    setShowConfirmation(false);
  };

  // Función para cerrar el modal principal
  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setFileName('');
    setShowConfirmation(false);
    setCurrentOrdenId(null);
  };
  // Función para abrir el selector de archivos
  const handleBrowseClick = () => {
    event.stopPropagation();
    document.getElementById('file-input').click();
  };


  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para obtener el nombre completo del paciente
  const getNombreCompleto = (usuario) => {
    return `${usuario.primer_nombre || ''} ${usuario.segundo_nombre || ''} ${usuario.primer_apellido || ''} ${usuario.segundo_apellido || ''}`.trim();
  };

  // Función para obtener el color del badge según el tipo de examen
  const getBadgeColor = (tipoExamen) => {
    const tipo = tipoExamen.toLowerCase();
    if (tipo.includes('sangre') || tipo.includes('hemograma') || tipo.includes('glucosa') || tipo.includes('lipídico')) {
      return 'badge-green'; // Laboratorio
    } else if (tipo.includes('orina')) {
      return 'badge-pink'; // Imágenes
    } else {
      return 'badge-red'; // Otros estudios
    }
  };

  // Función para obtener el tipo de archivo para mostrar
  const getFileType = (tipoExamen) => {
    const tipo = tipoExamen.toLowerCase();
    if (tipo.includes('sangre') || tipo.includes('hemograma') || tipo.includes('glucosa') || tipo.includes('lipídico')) {
      return 'Laboratorio';
    } else if (tipo.includes('orina')) {
      return 'Imagenes';
    } else {
      return 'Estudios';
    }
  };

  // Transformar órdenes a la estructura de archivos
  const files = ordenes.map(orden => {
    const paciente = orden.expediente.paciente.usuario;
    const nombreCompleto = getNombreCompleto(paciente);
    const tipoExamen = orden.tipo_examen;
    const tipoArchivo = getFileType(tipoExamen);
    const badgeColor = getBadgeColor(tipoExamen);
    
    // Determinar si tiene archivo subido
    const tieneArchivo = !!orden.resultado_url;

    return {
      id: orden.id,
      name: `${tipoExamen} - ${nombreCompleto}`,
      date: formatDate(orden.created_at),
      size: tieneArchivo ? "21 MB" : "Sin archivo",
      type: tipoArchivo,
      typeColor: badgeColor,
      resultadoUrl: orden.resultado_url,
      estado: orden.estado.nombre,
      instrucciones: orden.instrucciones,
      paciente: nombreCompleto,
      tipoExamen: tipoExamen,
      ordenId: orden.id,
      tieneArchivo: tieneArchivo
    };
  });



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

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || file.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

   // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

   // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll al top cuando cambia de página
    const filesContainer = document.querySelector('.files-grid-container');
    if (filesContainer) {
      filesContainer.scrollTop = 0;
    }
  };

  // Función para cambiar items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Volver a la primera página
  };

  // Función para manejar la descarga/visualización
  const handleViewFile = (resultadoUrl) => {
    if (resultadoUrl) {
      window.open(resultadoUrl, '_blank');
    } else {
      alert('No hay resultado disponible para esta orden');
    }
  };

  // Función para manejar la descarga
  const handleDownloadFile = (resultadoUrl, fileName) => {
    if (resultadoUrl) {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = resultadoUrl;
      link.download = fileName || 'resultado.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No hay resultado disponible para descargar');
    }
  };

   // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Primeras páginas
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Últimas páginas
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Páginas intermedias
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };



  if (loading) {
    return (
      <div className="archivos-container">
        <div className="archivos-main">
          <div className="loading-container">
            <div className="loading">Cargando órdenes de laboratorio...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`archivos-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
      <div className="archivos-main">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h1 className="header-title">Archivos y Resultados</h1>
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
        <div className="archivos-content">
          {error && (
            <div className="error-banner">
              <span>⚠️ Error al cargar órdenes: {error}</span>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Buscar Archivos..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="imagenes">Imágenes</option>
              <option value="estudios">Estudios</option>
            </select>
          </div>

          {/* Files Grid - MODIFICADO con lógica condicional de botones */}
          {/* Files Grid */}
          <div className="files-grid-container">
            <div className="files-grid">
              {currentFiles.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-card-content">
                    {/* File Icon and Badge */}
                    <div className="file-header">
                      <div className="file-icon">
                        <svg className="file-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span className={`file-badge ${file.typeColor}`}>{file.type}</span>
                    </div>

                    {/* File Info */}
                    <div className="file-info">
                      <h3 className="file-name">{file.name}</h3>
                      <div className="file-details">
                        <span>{file.date}</span>
                        <span>{file.size}</span>
                      </div>
                      <div className="file-status">
                        <small>Estado: <strong>{file.estado}</strong></small>
                      </div>
                      {file.instrucciones && (
                        <div className="file-instructions">
                          <small><strong>Instrucciones:</strong> {file.instrucciones}</small>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="file-actions">
                      {/* Botón VER - solo se muestra si hay archivo */}
                      {file.tieneArchivo && (
                        <button 
                          className="action-button view-button"
                          onClick={() => handleViewFile(file.resultadoUrl)}
                        >
                          <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Ver
                        </button>
                      )}

                      {/* Botón DESCARGAR - solo se muestra si hay archivo */}
                      {file.tieneArchivo && (
                        <button 
                          className="action-button download-button"
                          onClick={() => handleDownloadFile(file.resultadoUrl, `${file.tipoExamen}-${file.paciente}`)}
                        >
                          <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Descargar
                        </button>
                      )}

                      {/* Botón SUBIR/ACTUALIZAR - siempre visible pero con texto diferente */}
                      <button 
                        className={`action-button ${file.tieneArchivo ? 'update-button' : 'upload-button'}`}
                        onClick={() => handleOpenUploadModal(file.ordenId)}
                      >
                        <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        {file.tieneArchivo ? 'Actualizar PDF' : 'Subir PDF'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

           {filteredFiles.length === 0 && !loading && (
            <div className="no-files">
              <p>No se encontraron archivos que coincidan con la búsqueda</p>
            </div>
          )}

          {/* Paginación */}
          {filteredFiles.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredFiles.length)} de {filteredFiles.length} archivos
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
                  
                  {getPageNumbers().map((pageNumber, index) => (
                    pageNumber === '...' ? (
                      <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                    ) : (
                      <button
                        key={pageNumber}
                        className={`page-button ${currentPage === pageNumber ? 'page-button-active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    )
                  ))}
                  
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

      {/* Modal para subir archivos */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {files.find(f => f.ordenId === currentOrdenId)?.tieneArchivo 
                  ? 'Actualizar Archivo PDF' 
                  : 'Subir Archivo PDF'
                }
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {!showConfirmation ? (
                <div 
                  className="upload-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="upload-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3>Arrastra y suelta para subir el archivo PDF o</h3>
                  <button 
                    type="button" 
                    className="browse-button"
                    onClick={handleBrowseClick}
                  >
                    Buscar en el equipo
                  </button>
                  <p className="upload-info">
                    Solo se permiten archivos PDF
                    <br />
                    <span>Tamaño máximo: 10MB</span>
                  </p>
                  
                  {/* Mensaje contextual si ya existe un archivo */}
                  {files.find(f => f.ordenId === currentOrdenId)?.tieneArchivo && (
                    <div className="existing-file-warning">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Ya existe un archivo subido. Al subir uno nuevo, se reemplazará el anterior.</span>
                    </div>
                  )}
                  
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="confirmation-area">
                  <div className="file-preview">
                    <div className="file-icon-preview">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="file-info-preview">
                      <h4>{fileName}</h4>
                      <p>PDF Document - {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  <div className="confirmation-actions">
                    <p>
                      {files.find(f => f.ordenId === currentOrdenId)?.tieneArchivo 
                        ? '¿Estás seguro de que quieres actualizar el archivo de esta orden?'
                        : '¿Estás seguro de que quieres subir este archivo a la orden?'
                      }
                    </p>
                    <div className="action-buttons">
                      <button 
                        type="button"
                        className="cancel-button"
                        onClick={handleCancelUpload}
                        disabled={uploading}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button"
                        className="confirm-button"
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                      >
                        {uploading 
                          ? (files.find(f => f.ordenId === currentOrdenId)?.tieneArchivo ? 'Actualizando...' : 'Subiendo...')
                          : 'Aceptar'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alertas */}
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}

    </div>
  );
}