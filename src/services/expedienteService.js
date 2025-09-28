import api from './api';

export const expedienteService = {
  getAllExpedientes: async () => {
      try {
        const response = await api.get('/api/expediente/todos');
        return response.data;
      } catch (error) {
        console.error('Error en getAllExpedientes:', error);
        
        if (error.response?.status === 401) {
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error ||
                            'Error al obtener expedientes';
        throw new Error(errorMessage);
      }
    },
  // Obtener expediente por ID de usuario
  getExpedienteByUserId: async (userId) => {
    try {
      const response = await api.get(`/api/expediente/${userId}`);
      console.log('Paciente ID:', userId); // Verifica que el ID se esté pasando correctamente
      return response.data;
    } catch (error) {
      console.error('Error en getExpedienteByUserId:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Error al obtener el expediente';
      throw new Error(errorMessage);
    }
  },
  // Obtener expediente por ID de paciente (si es diferente)
  getExpedienteByPacienteId: async (pacienteId) => {
    try {
      const response = await api.get(`/api/expediente/paciente/${pacienteId}`);
      return response.data;
    } catch (error) {
      console.error('Error en getExpedienteByPacienteId:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      
      const errorMessage = error.response?.data?.message || 
                          'Error al obtener el expediente del paciente';
      throw new Error(errorMessage);
    }
  }
};