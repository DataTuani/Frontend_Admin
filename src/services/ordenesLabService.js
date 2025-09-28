import api from "./api";

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
  }
};