import React from 'react';
import './Home.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">¡Bienvenido!</h1>
        <p className="home-subtitle">Has iniciado sesión exitosamente en SINAES</p>
        <div className="home-welcome">
          <p>Estamos contentos de tenerte aquí. Ahora puedes acceder a todas las funcionalidades del sistema.</p>
        </div>
      </div>
    </div>
  );
}