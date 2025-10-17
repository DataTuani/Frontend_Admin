// src/services/auth.js
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
  }
  
  // ELIMINA TODO LO DEMÁS que son funciones del sistema de citas
  // para evitar confusiones
};