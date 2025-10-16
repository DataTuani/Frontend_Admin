import api from "../hooks/api";

export const ordenesLabService = {
  getAllOrdenes: async () => {
    try {
      const response = await api.get('/api/ordenesLab');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener las órdenes de laboratorio');
    }
  },

  getOrdenesByUserId: async (userId) => {
    try {
      const response = await api.get(`/api/ordenesLab/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener las órdenes del usuario');
    }
  },

  getOrdenById: async (ordenId) => {
    try {
      const response = await api.get(`/api/ordenesLab/orden/${ordenId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener la orden');
    }
  },

  // CORREGIDO: Cambiar POST por PUT según la documentación
  uploadOrdenPdf: async (ordenId, file) => {
  try {
    const formData = new FormData();
    // CAMBIA 'archivo' por 'OrdenLaboratorio'
    formData.append('OrdenLaboratorio', file);

    console.log('Enviando archivo:', {
      ordenId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const response = await api.put(`/api/ordenesLab/${ordenId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Respuesta del servidor:', response);
    return response.data;
  } catch (error) {
    console.error('Error detallado en servicio:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw new Error(error.response?.data?.message || 'Error al subir el archivo');
  }
}
};