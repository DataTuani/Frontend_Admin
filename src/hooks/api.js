// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://sinaes.up.railway.app';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para requests 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-token'] = token; // Cambiar a x-token según la documentación
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para response - MODIFICADO
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Solo redirigir si es un error de autenticación real
            // No redirigir automáticamente, dejar que los componentes manejen el error
            console.error('Error de autenticación:', error);
            
            // Limpiar el token inválido
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('userId');
            
            // Disparar evento para notificar a la app
            window.dispatchEvent(new CustomEvent('authError'));
        }
        return Promise.reject(error);
    }
);

export default api;