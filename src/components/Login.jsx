import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';
import './Login.css';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Llamar al servicio de autenticación
      const response = await authService.login({
        username: formData.correo, // Usamos el correo como username
        password: formData.contraseña
      });

      console.log('Login exitoso:', response);
      
      // Si el login es exitoso, llamar a la función onLogin
      if (onLogin) {
        onLogin(response); // Puedes pasar los datos del usuario si los necesitas
      }

    } catch (err) {
      setError(err.message || 'Error en el login. Verifica tus credenciales.');
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo and Welcome Message */}
        <div className="login-header">
          <div className="logo-container">
            <img src="/sinaes-logo.png" alt="SINAES Logo" className="logo" />
          </div>
          <h1 className="welcome-text">¡Bienvenido a SINAES!</h1>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="correo" className="form-label">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Correo
            </label>
            <input
              id="correo"
              type="email"
              placeholder="Ingrese correo"
              className="form-input"
              value={formData.correo}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="contraseña" className="form-label">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Contraseña
            </label>
            <input
              id="contraseña"
              type="password"
              placeholder="Ingrese contraseña"
              className="form-input"
              value={formData.contraseña}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link to="#" className="forgot-link">
              ¿Has olvidado tu contraseña? Presiona acá
            </Link>
          </div>
        </form>
      </div>

      {/* Footer Links */}
      <div className="login-footer">
        <div className="footer-links">
          <Link to="#" className="footer-link">Preguntas frecuentes</Link>
          <Link to="#" className="footer-link">Términos de uso</Link>
          <Link to="#" className="footer-link">Código de ética</Link>
          <Link to="#" className="footer-link">Privacidad</Link>
        </div>
      </div>
    </div>
  );
}