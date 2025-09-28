// src/services/auth.js
import api from "./api";

export const authService = {
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
    
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    }
};