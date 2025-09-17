import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function LoginPage({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    onLogin(); // Simula el login exitoso
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
            <label htmlFor="email" className="form-label">
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
              id="email"
              type="email"
              placeholder="Ingrese correo"
              className="form-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
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
              id="password"
              type="password"
              placeholder="Ingrese contraseña"
              className="form-input"
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">
            Ingresar
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