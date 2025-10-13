import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import './TeleConsulta.css';
import Sidebar from './Sidebar';
import { expedienteService } from '../services/expedienteService';
import { citasService } from '../services/citas';
import { authService } from '../services/auth';
import Alert from './Alerta';

export default function TeleConsulta() {
    const { patient } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { cita, pacienteNombre, userId, pacienteId } = location.state || {};

    const nombre_doctor = authService.getUser()
          ? `${authService.getUser().primer_nombre} ${authService.getUser().primer_apellido}`
          : 'Invitado';
        document.title = `Bienvenido, Dr(a). ${nombre_doctor}`;
    
    // State para el expediente
    const [expediente, setExpediente] = useState(null);
    const [loadingExpediente, setLoadingExpediente] = useState(true);
    const [errorExpediente, setErrorExpediente] = useState('');

    // States para los datos de la consulta
    const [sintomas, setSintomas] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [tratamiento, setTratamiento] = useState('');

    // State for medications
    const [medications, setMedications] = useState([]);
    const [showMedicationForm, setShowMedicationForm] = useState(false);
    const [showPdfSummary, setShowPdfSummary] = useState(false);
    const [consultaGuardada, setConsultaGuardada] = useState(null);
    const [medicationForm, setMedicationForm] = useState({
        medicamento: "",
        dosis: "",
        frecuencia: "",
        duracion: "",
        instrucciones: "",
    });

    // States de carga separados
    const [loadingCita, setLoadingCita] = useState(false);
    const [loadingConsulta, setLoadingConsulta] = useState(false);

    // Nuevo estado para las alertas
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // Función para mostrar alertas
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    // Función para cerrar alertas
    const closeAlert = () => {
        setAlert({ show: false, type: '', message: '' });
    };

    // State for chat
    const [chatMessages, setChatMessages] = useState([
        { sender: "patient", message: "Hola doctor, ¿me puede escuchar bien?" },
        { sender: "doctor", message: "Si, perfectamente ¿Cómo se siente hoy?" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    // Cargar expediente al montar el componente
    useEffect(() => {
        const fetchExpediente = async () => {
            try {
                setLoadingExpediente(true);
                setErrorExpediente('');
                
                const userIdToFetch = patient || userId;
                
                if (!userIdToFetch) {
                    throw new Error('No se pudo obtener el ID del paciente');
                }
                
                console.log('Obteniendo expediente para userId:', userIdToFetch);
                const response = await expedienteService.getExpedienteByUserId(userIdToFetch);
                console.log('Expediente obtenido:', response);
                
                if (response.success && response.Expediente) {
                    setExpediente(response.Expediente);
                } else {
                    throw new Error('No se encontró el expediente');
                }
                
            } catch (error) {
                console.error('Error al cargar expediente:', error);
                setErrorExpediente(error.message);
                
                if (error.message.includes('Sesión expirada')) {
                    authService.logout();
                }
            } finally {
                setLoadingExpediente(false);
            }
        };

        if (patient || userId) {
            fetchExpediente();
        } else {
            setLoadingExpediente(false);
            setErrorExpediente('No se proporcionó ID de paciente');
        }
    }, [patient, userId]);

    // Datos del paciente
    const getPatientData = () => {
        if (expediente && expediente.paciente) {
            const usuario = expediente.paciente.usuario;
            const alergias = expediente.paciente.alergias?.map(a => a.descripcion) || ['No registradas'];
            const enfermedades = expediente.paciente.enfermedades?.map(e => e.descripcion) || ['No registradas'];
            
            const ultimaCita = expediente.paciente.citas?.find(c => c.consulta?.receta) || null;
            const medicamentosActuales = ultimaCita?.consulta?.receta?.map(r => `${r.nombre} ${r.dosis}`) || ['No registrados'];

            return {
                name: `${usuario.primer_nombre || ''} ${usuario.primer_apellido || ''}`.trim() || pacienteNombre || 'Paciente',
                age: usuario.fecha_nacimiento ? calcularEdad(usuario.fecha_nacimiento) : 'Edad no disponible',
                id: expediente.folio || 'N/A',
                type: 'Virtual',
                lastVisit: expediente.paciente.citas?.[0]?.fecha_hora ? 
                    new Date(expediente.paciente.citas[0].fecha_hora).toLocaleDateString('es-ES') : 'N/A',
                allergies: alergias,
                currentMedications: medicamentosActuales,
                currentDiagnosis: enfermedades,
                grupoSanguineo: expediente.paciente.grupo_sanguineo || 'No registrado',
                fechaNacimiento: usuario.fecha_nacimiento ? 
                    new Date(usuario.fecha_nacimiento).toLocaleDateString('es-ES') : 'No registrada',
                pacienteId: expediente.paciente.id
            };
        }
        
        if (cita) {
            return {
                name: pacienteNombre || 'Paciente',
                age: 'Edad no disponible',
                id: cita.expediente?.folio || 'N/A',
                type: 'Virtual',
                lastVisit: cita.fecha_hora ? new Date(cita.fecha_hora).toLocaleDateString('es-ES') : 'N/A',
                allergies: ['No registradas'],
                currentMedications: ['No registrados'],
                currentDiagnosis: ['No registrado'],
                grupoSanguineo: 'No registrado',
                fechaNacimiento: 'No registrada',
                pacienteId: cita.paciente?.id
            };
        }
        
        return {
            name: 'Paciente',
            age: 'Edad no disponible',
            id: 'N/A',
            type: 'Virtual',
            lastVisit: 'N/A',
            allergies: ['No registradas'],
            currentMedications: ['No registrados'],
            currentDiagnosis: ['No registrado'],
            grupoSanguineo: 'No registrado',
            fechaNacimiento: 'No registrada',
            pacienteId: null
        };
    };

    const calcularEdad = (fechaNacimiento) => {
        const nacimiento = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return `${edad} años`;
    };

    const patientData = getPatientData();
    patientData.initials = patientData.name.split(" ").map((n) => n[0]).join("").toUpperCase() || 'P';

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const medicationsPerPage = 5;
    
    // State for next appointment
    const [nextAppointment, setNextAppointment] = useState({
        fecha: "",
        hora: "",
        tipo: "4", // 4 para Seguimiento virtual (por defecto en teleconsulta)
        motivo_consulta: ""
    });
    
    // State for lab orders
    const [labOrders, setLabOrders] = useState([]);
    const [showLabOrderForm, setShowLabOrderForm] = useState(false);
    const [labOrderForm, setLabOrderForm] = useState({
        estudio: "",
        indicaciones: "",
    });

    // Chat functions
    const sendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([...chatMessages, { sender: "doctor", message: newMessage }]);
            setNewMessage("");
        }
    };

    // Función para programar nueva cita
    const handleScheduleAppointment = async () => {
        console.log("INTENDANDO PROGRAMAR CITA: ", nextAppointment);
        try {
            if (!nextAppointment.fecha) {
                console.log("Falta fecha");
                showAlert('error', "Por favor, selecciona una fecha para la cita");
                return;
            }

            if (!nextAppointment.motivo_consulta.trim()) {
                console.log("Falta motivo");
                showAlert('error', "Por favor, ingresa el motivo de la consulta");
                return;
            }

            const hospitalId = authService.getHospitalId();
            if (!hospitalId) {
                console.error('No se pudo obtener el ID del hospital');
                throw new Error('No se pudo obtener el ID del hospital');
            }

            if (!patientData.pacienteId) {
                console.error('No se pudo obtener el ID del paciente');
                throw new Error('No se pudo obtener el ID del paciente');
            }

            // Combinar fecha y hora
            const fechaHora = new Date(`${nextAppointment.fecha}T${nextAppointment.hora || '12:00'}`);
            
            // Validar que la fecha no sea en el pasado
            if (fechaHora < new Date()) {
                console.log("Fecha en el pasado"); 
                showAlert('error', "No se pueden agendar citas en fechas pasadas");
                return;
            }

            const fechaHoraISO = fechaHora.toISOString();

            const citaData = {
                paciente_id: patientData.pacienteId,
                hospital_id: parseInt(hospitalId),
                fecha_hora: fechaHoraISO,
                motivo_consulta: nextAppointment.motivo_consulta,
                tipoCita: parseInt(nextAppointment.tipo)
            };

            setLoadingCita(true);
            
            console.log("Datos enviados para la cita:", citaData);
            const response = await citasService.createCita(citaData);
            console.log('Cita programada:', response);
            
            showAlert('success', '✅ Cita programada exitosamente');
            
            // Limpiar formulario
            setNextAppointment({
                fecha: "",
                hora: "",
                tipo: "4", // Mantener virtual por defecto
                motivo_consulta: ""
            });

        } catch (error) {
            console.error('Error al programar cita:', error);
            showAlert('error', `❌ ${error.message}`);
        } finally {
            setLoadingCita(false);
        }
    };

    // Función para guardar la consulta
    const handleSaveConsultation = async () => {
        try {
            if (!cita || !cita.id) {
                throw new Error('No se encontró la cita a atender');
            }

            if (!sintomas.trim() || !diagnostico.trim() || !tratamiento.trim()) {
                showAlert('error', "Por favor, complete todos los campos de la consulta (síntomas, diagnóstico y tratamiento)");
                return;
            }

            const consultaData = {
                sintomas: sintomas,
                diagnostico: diagnostico,
                tratamiento: tratamiento,
                medicamentos: medications.map(med => ({
                    nombre: med.medicamento,
                    dosis: med.dosis,
                    frecuencia: med.frecuencia,
                    duracion: med.duracion,
                    instrucciones: med.instrucciones
                })),
                ordenes: labOrders.map(orden => ({
                    tipo_examen: orden.estudio,
                    instrucciones: orden.indicaciones
                }))
            };

            setLoadingConsulta(true);
            
            // 1. Primero atender la cita actual
            console.log("Datos de la consulta a guardar:", consultaData);
            console.log('Atendiendo cita actual...');
            const response = await citasService.atenderCita(cita.id, consultaData);
            setConsultaGuardada(response);
            console.log('Cita atendida exitosamente');

            // 2. Si hay una próxima cita programada, crearla
            let citaProgramada = false;
            if (nextAppointment.fecha && nextAppointment.motivo_consulta.trim()) {
                try {
                    console.log('Programando cita de seguimiento...');
                    const hospitalId = authService.getHospitalId();
                    if (!hospitalId) {
                        throw new Error('No se pudo obtener el ID del hospital');
                    }

                    if (!patientData.pacienteId) {
                        throw new Error('No se pudo obtener el ID del paciente');
                    }

                    // Combinar fecha y hora
                    const fechaHora = new Date(`${nextAppointment.fecha}T${nextAppointment.hora || '12:00'}`);
                    
                    // Validar que la fecha no sea en el pasado
                    if (fechaHora < new Date()) {
                        showAlert('warning', "✅ Consulta guardada, pero no se pudo programar la cita: No se pueden agendar citas en fechas pasadas");
                    } else {
                        const fechaHoraISO = fechaHora.toISOString();

                        const citaData = {
                            paciente_id: patientData.pacienteId,
                            hospital_id: parseInt(hospitalId),
                            fecha_hora: fechaHoraISO,
                            motivo_consulta: nextAppointment.motivo_consulta,
                            tipoCita: parseInt(nextAppointment.tipo)
                        };

                        // Programar la nueva cita
                        await citasService.createCita(citaData);
                        citaProgramada = true;
                        console.log('Cita de seguimiento programada exitosamente');
                    }
                    
                } catch (error) {
                    console.error('Error al programar cita de seguimiento:', error);
                    // Mostrar mensaje de error pero NO impedir que se muestre el resumen
                    showAlert('warning', `✅ Consulta guardada, pero error al programar cita de seguimiento: ${error.message}`);
                }
            }

            // Mostrar mensaje final
            if (citaProgramada) {
                showAlert('success', '✅ Consulta guardada y cita de seguimiento programada exitosamente');
            } else {
                showAlert('success', '✅ Consulta guardada exitosamente');
            }

            // 3. Mostrar el resumen PDF (SIEMPRE se debe mostrar, incluso si hay error en la cita)
            console.log('Mostrando resumen PDF...');
            setShowPdfSummary(true);

        } catch (error) {
            console.error('Error al guardar la consulta:', error);
            showAlert('error', '❌ Error al guardar la consulta: ' + error.message);
        } finally {
            setLoadingConsulta(false);
        }
    };

    const handlePrintPdf = () => {
        setShowPdfSummary(true);
        setTimeout(() => {
            const originalTitle = document.title;
            document.title = `Resumen_Teleconsulta_${patientData.name.replace(/\s+/g, '_')}`;
            
            const actionButtons = document.querySelector('.pdf-action-buttons');
            const closeButton = document.querySelector('.pdf-close-btn');
            const modalHeader = document.querySelector('.pdf-header');
            
            if (actionButtons) actionButtons.style.display = 'none';
            if (closeButton) closeButton.style.display = 'none';
            if (modalHeader) modalHeader.style.display = 'none';
            
            window.print();
            
            setTimeout(() => {
                if (actionButtons) actionButtons.style.display = 'flex';
                if (closeButton) closeButton.style.display = 'block';
                if (modalHeader) modalHeader.style.display = 'flex';
                document.title = originalTitle;
            }, 500);
        }, 100);
    };

    const handleEmailPdf = () => {
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

    // Datos para el PDF (usar datos de la consulta guardada si están disponibles)
    const pdfData = consultaGuardada || {
        sintomas: sintomas,
        diagnostico: diagnostico,
        tratamiento: tratamiento,
        medicamentos: medications,
        ordenes: labOrders
    };

    // Medication functions
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

    // Mostrar loading mientras se carga el expediente
    if (loadingExpediente) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard-main">
                    <header className="header">
                        <div className="header-content">
                            <div className="header-left">
                                <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h1 className="header-title">Cargando expediente...</h1>
                            </div>
                        </div>
                    </header>
                    <div className="loading-container">
                        <div className="loading">Cargando información del paciente...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-main">
                {/* Mensajes de alerta */}
                {alert.show && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={closeAlert}
                        duration={5000}
                    />
                )}
                
                <header className="header">
                    <div className="header-content">
                        <div className="header-left">
                            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <h1 className="header-title">Teleconsulta - {patientData.name}</h1>
                        </div>

                        <div className="header-right">
                            <div className="user-info">
                                <div className="user-avatar">
                                    <span className="avatar-text">C</span>
                                </div>
                                <span className="user-name">Dr(a). {nombre_doctor}</span>
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
                                    {errorExpediente && <span className="data-warning"> (Error al cargar datos completos)</span>}
                                </p>
                            </div>
                        </div>

                        <Link to="/teleconsultas" className="close-consultation-btn">
                            <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cerrar Teleconsulta
                        </Link>
                    </div>
                </div>

                {/* Teleconsulta Content */}
                <div className="teleconsulta-content">
                    {/* Left Panel - Video and Consultation Form */}
                    <div className="teleconsulta-main">
                        {/* Video Section */}
                        <div className="video-section">
                            <div className="video-container">
                                <div className="video-placeholder">
                                    <div className="patient-avatar-large">
                                        <span className="avatar-text">
                                            {patientData.initials}
                                        </span>
                                    </div>
                                    <div className="patient-info-overlay">
                                        {patientData.name}
                                        <div className="patient-role">Paciente</div>
                                    </div>
                                </div>

                                {/* Doctor's video feed (small) */}
                                <div className="doctor-video-feed">
                                    <div className="doctor-avatar-small">
                                        <span className="avatar-text">CR</span>
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
                        </div>

                        {/* Consultation Form - Exactamente igual que en Consulta.jsx */}
                        <div className="consultation-record-panel">
                            <div className="record-card">
                                <div className="card-header">
                                    <h3 className="card-title">Registro de teleconsulta</h3>
                                </div>
                                <div className="card-content">
                                    {/* Patient Evolution */}
                                    <div className="form-section">
                                        <h4 className="form-section-title">Evolución del paciente (Síntomas)</h4>
                                        <textarea
                                            placeholder="Describe la evolución y síntomas actuales del paciente..."
                                            className="consultation-textarea"
                                            rows={3}
                                            value={sintomas}
                                            onChange={(e) => setSintomas(e.target.value)}
                                        />
                                    </div>

                                    {/* Diagnosis */}
                                    <div className="form-section">
                                        <h4 className="form-section-title">Diagnóstico</h4>
                                        <input 
                                            type="text" 
                                            placeholder="Diagnóstico principal" 
                                            className="consultation-input"
                                            value={diagnostico}
                                            onChange={(e) => setDiagnostico(e.target.value)}
                                        />
                                    </div>

                                    {/* Management Plan */}
                                    <div className="form-section">
                                        <h4 className="form-section-title">Plan de manejo (Tratamiento)</h4>
                                        <textarea
                                            placeholder="Describe el plan de tratamientos y recomendaciones."
                                            className="consultation-textarea"
                                            rows={3}
                                            value={tratamiento}
                                            onChange={(e) => setTratamiento(e.target.value)}
                                        />
                                    </div>

                                    {/* Doctor Signature */}
                                    <div className="doctor-signature">
                                        <p className="doctor-name">Dr (a). {nombre_doctor}</p>
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
                                            disabled={loadingCita}
                                        >
                                            {loadingCita ? 'Programando...' : 'Programar Cita'}
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
                                                <option value="4">Seguimiento virtual</option>
                                                <option value="3">Seguimiento presencial</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="motivo-consulta" className="form-label">Motivo de la consulta</label>
                                            <textarea
                                                id="motivo-consulta"
                                                className="form-textarea"
                                                value={nextAppointment.motivo_consulta}
                                                onChange={(e) => setNextAppointment({...nextAppointment, motivo_consulta: e.target.value})}
                                                placeholder="Motivo de la consulta"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons Section */}
                            <div className="action-buttons">
                                <Link to="/teleconsultas" className="cancel-action-btn">
                                    Cancelar
                                </Link>
                                <button 
                                    className="save-consultation-btn" 
                                    onClick={handleSaveConsultation}
                                    disabled={loadingConsulta}
                                >
                                    {loadingConsulta  ? '⏳ Guardando...' : '💾 Guardar Consulta'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Patient Record and Chat */}
                    <div className="teleconsulta-sidebar">
                        {/* Patient Quick Record */}
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
                                            <div className="info-item">
                                                <span className="info-label">Grupo Sanguíneo:</span>
                                                <span className="info-value">{patientData.grupoSanguineo}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Fecha Nacimiento:</span>
                                                <span className="info-value">{patientData.fechaNacimiento}</span>
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

                        {/* Chat Sidebar */}
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

                {errorExpediente && (
                    <div className="error-banner">
                        <span>⚠️ No se pudo cargar el expediente completo: {errorExpediente}</span>
                    </div>
                )}
            </div>

            {/* PDF Summary Modal - Exactamente igual que en Consulta.jsx */}
            {showPdfSummary && (
                <div className="pdf-modal-overlay">
                    <div className="pdf-modal-content">
                        <div className="pdf-header">
                            <h1 className="pdf-title">Resumen de teleconsulta - {patientData.name}</h1>
                            <button 
                                className="pdf-close-btn"
                                onClick={() => setShowPdfSummary(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="pdf-content">
                            <div className="pdf-doctor-info">
                                <h2 className="pdf-doctor-name">Dr (a). {nombre_doctor}</h2>
                                <p className="pdf-doctor-specialty">Medicina General</p>
                                <p className="pdf-doctor-contact">Cédula: 001-241003-10338 Tel: 7616-8096</p>
                                
                                <div className="pdf-consultation-info">
                                    <h3 className="pdf-consultation-title">Resumen de Teleconsulta Médica</h3>
                                    <p className="pdf-consultation-date">Fecha: {formattedDate}</p>
                                </div>
                            </div>

                            <div className="pdf-divider"></div>

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

                            {/* Síntomas y Diagnóstico */}
                            <div className="pdf-consultation-details">
                                <h3 className="pdf-section-title">Resumen de la Teleconsulta</h3>
                                <div className="pdf-detail-section">
                                    <h4 className="pdf-detail-subtitle">Síntomas Reportados</h4>
                                    <p className="pdf-detail-text">{pdfData.sintomas || 'No especificado'}</p>
                                </div>
                                <div className="pdf-detail-section">
                                    <h4 className="pdf-detail-subtitle">Diagnóstico</h4>
                                    <p className="pdf-detail-text">{pdfData.diagnostico || 'No especificado'}</p>
                                </div>
                                <div className="pdf-detail-section">
                                    <h4 className="pdf-detail-subtitle">Tratamiento Indicado</h4>
                                    <p className="pdf-detail-text">{pdfData.tratamiento || 'No especificado'}</p>
                                </div>
                            </div>

                            {pdfData.medicamentos && pdfData.medicamentos.length > 0 && (
                                <>
                                    <div className="pdf-divider"></div>
                                    <div className="pdf-medications">
                                        <h3 className="pdf-section-title">Medicamentos Recetados</h3>
                                        <ul className="pdf-medications-list">
                                            {pdfData.medicamentos.map((med, index) => (
                                                <li key={index} className="pdf-medication-item">
                                                    <strong>{med.nombre}</strong> - {med.dosis}, {med.frecuencia} durante {med.duracion}
                                                    {med.instrucciones && ` (${med.instrucciones})`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}

                            {pdfData.ordenes && pdfData.ordenes.length > 0 && (
                                <>
                                    <div className="pdf-divider"></div>
                                    <div className="pdf-lab-orders">
                                        <h3 className="pdf-section-title">Órdenes de Laboratorio</h3>
                                        <ul className="pdf-orders-list">
                                            {pdfData.ordenes.map((orden, index) => (
                                                <li key={index} className="pdf-order-item">
                                                    <strong>{orden.tipo_examen}</strong> - {orden.instrucciones}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}

                            <div className="pdf-divider"></div>

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

                            <div className="pdf-signature">
                                <p className="pdf-signature-label">Firma del médico</p>
                                <div className="pdf-signature-details">
                                    <p className="pdf-doctor-name-signature">Dr (a). {nombre_doctor}y</p>
                                    <p className="pdf-doctor-specialty-signature">Medicina General</p>
                                    <p className="pdf-doctor-license">Cédula Profesional: 12345678</p>
                                </div>
                            </div>
                        </div>

                        <div className="pdf-action-buttons">
                            <button className="pdf-action-btn pdf-cancel-btn" onClick={() => {
                                setShowPdfSummary(false);
                                navigate('/teleconsultas');
                            }}>
                                Cerrar y Volver a Teleconsultas
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