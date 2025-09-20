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
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                // Disparar evento personalizado para notificar el login
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
        delete api.defaults.headers.common['Authorization'];
        
        // Disparar evento personalizado para notificar el logout
        window.dispatchEvent(new CustomEvent('authChange', { 
            detail: { authenticated: false } 
        }));
        
        // Forzar recarga para asegurar que todos los componentes se actualicen
        window.location.href = '/login';
    },
    
    getToken: () => {
        return localStorage.getItem('authToken');
    },
    
    getUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    }
};