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

    // Obtener citas por doctor con filtros adicionales (opcional)
    getCitasByDoctorWithFilters: async (personalId, filters = {}) => {
        try {
        const params = new URLSearchParams();
        params.append('personal_id', personalId);
        
        // Agregar filtros opcionales
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

    // Obtener una cita específica por ID
    getCitaById: async (citaId) => {
        try {
        const response = await api.get(`/api/citas/${citaId}`);
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener la cita');
        }
    },

    // Actualizar estado de una cita
    updateCitaEstado: async (citaId, nuevoEstado) => {
        try {
        const response = await api.put(`/api/citas/${citaId}/estado`, {
            estado: nuevoEstado
        });
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar la cita');
        }
    },

    // Crear una nueva cita
    createCita: async (citaData) => {
        try {
        const response = await api.post('/api/citas', citaData);
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al crear la cita');
        }
    }
    };