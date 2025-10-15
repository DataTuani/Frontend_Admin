// src/services/auth.js
import api from "./api";

export const authService = {
    loginMinsa: (token, userData) => {
    localStorage.setItem('minsa_token', token);
    localStorage.setItem('minsa_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('authChange'));
  },

  logoutMinsa: () => {
    localStorage.removeItem('minsa_token');
    localStorage.removeItem('minsa_user');
    window.dispatchEvent(new Event('authChange'));
  },

  isAuthenticatedMinsa: () => {
    return !!localStorage.getItem('minsa_token');
  },

  getMinsaUser: () => {
    const user = localStorage.getItem('minsa_user');
    return user ? JSON.parse(user) : null;
  },

  getMinsaToken: () => {
    return localStorage.getItem('minsa_token');
  },
    login: async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', {
                correo: credentials.username,
                contraseña: credentials.password
            });

            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.usuario));
                localStorage.setItem('userId', response.data.usuario.id);
                
                // Guardar hospital_id si está disponible
                if (response.data.usuario.Personal && response.data.usuario.Personal.hospital) {
                    localStorage.setItem('hospitalId', response.data.usuario.Personal.hospital.id);
                }
                
                // Configurar el token en los headers
                api.defaults.headers.common['x-token'] = response.data.token;
                
                window.dispatchEvent(new CustomEvent('authChange', { 
                    detail: { authenticated: true } 
                }));
            }
            
            return response.data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               'Error en el login';
            throw new Error(errorMessage);
        }
    },
    
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userId');
        localStorage.removeItem('hospitalId');
        delete api.defaults.headers.common['x-token'];
        
        window.dispatchEvent(new CustomEvent('authChange', { 
            detail: { authenticated: false } 
        }));
        
        window.location.href = '/login';
    },
    
    getToken: () => {
        return localStorage.getItem('authToken');
    },
    
    getUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    getUserId: () => {
        return localStorage.getItem('userId');
    },
    
    getHospitalId: () => {
        return localStorage.getItem('hospitalId');
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    }
};