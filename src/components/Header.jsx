import React from 'react';
import './Header.css';
import { authService } from '../services/auth';

export default function Header() {
  const nombre_completo_usuaro = authService.getUser()
    ? `${authService.getUser().primer_nombre} ${authService.getUser().primer_apellido}`
    : 'Invitado';
  
  document.title = `Bienvenido, Dr(a). ${nombre_completo_usuaro}`;

  const handleGoToMinsa = () => {
    // Limpiar localStorage y redirigir a MINSA
    localStorage.clear();
    window.location.href = '/minsa/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h1 className="header-title">Agenda de Citas</h1>
        </div>

        <div className="header-right">
          <button 
            className="header-button minsa-button"
            onClick={handleGoToMinsa}
            title="Ir al Sistema MINSA"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            MINSA
          </button>
          
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-text">C</span>
            </div>
            <span className="user-name">Dr(a). {nombre_completo_usuaro}</span>
          </div>
          <button className="header-button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}