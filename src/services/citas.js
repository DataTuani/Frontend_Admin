import api from './api';

export const citasService = {
  getCitasByDoctor: async (personalId) => {
    try {
      const response = await api.get(`/api/citas/doctor?personal_id=${personalId}`);
      return response.data;
    } catch (error) {
      console.error('Error en getCitasByDoctor:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Error al obtener citas';
      throw new Error(errorMessage);
    }
  },

  // Atender una cita
  atenderCita: async (citaId, consultaData) => {
    try {
      const response = await api.post(`/api/citas/atender/${citaId}`, consultaData);
      return response.data;
    } catch (error) {
      console.error('Error en atenderCita:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Error al guardar la consulta';
      throw new Error(errorMessage);
    }
  },

  // Crear una nueva cita - CORREGIDO según la documentación
  createCita: async (citaData) => {
    try {
      // Mapear los campos según la documentación que me mostraste
      const requestBody = {
        paciente_id: citaData.paciente_id,
        hospital_id: citaData.hospital_id,
        fecha_hora: citaData.fecha_hora, // Asegúrate del formato esperado
        motivo_consulta: citaData.motivo_consulta,
        tipoCita: citaData.tipoCita
      };

      console.log('Enviando datos de cita:', requestBody); 
      
      const response = await api.post('/api/citas', requestBody);

      console.log('Respuesta de la API:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error en createCita:', error);
      console.error('Detalles del error:', error.response?.data); 
      // Manejar errores específicos
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Error en los datos enviados';
        throw new Error(errorMessage);
      }
      
      if (error.response?.status === 401) {
        throw new Error('Token no válido o inexistente');
      }
      
      const errorMessage = error.response?.data?.message || 'Error al crear la cita';
      throw new Error(errorMessage);
    }
  },

  // ... el resto de las funciones se mantienen igual
  getCitasByDoctorWithFilters: async (personalId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('personal_id', personalId);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/api/citas/doctor?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener citas');
    }
  },

  getCitaById: async (citaId) => {
    try {
      const response = await api.get(`/api/citas/${citaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener la cita');
    }
  },

  updateCitaEstado: async (citaId, nuevoEstado) => {
    try {
      const response = await api.put(`/api/citas/${citaId}/estado`, {
        estado: nuevoEstado
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la cita');
    }
  }
};