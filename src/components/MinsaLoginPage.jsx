import React, { useState } from 'react';
import { authService } from '../services/auth';
import './MinsaLoginPage.css';

// Componentes simples (fuera del componente para mejor rendimiento)
const Card = ({ children, className = '' }) => (
  <div className={`minsa-login-card ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`minsa-login-header ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h2 className={`minsa-login-title ${className}`}>{children}</h2>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`minsa-login-content ${className}`}>{children}</div>
);

const Button = ({ children, className = '', ...props }) => (
  <button className={`minsa-login-button ${className}`} {...props}>
    {children}
  </button>
);

const Input = ({ className = '', ...props }) => (
  <input className={`minsa-form-input ${className}`} {...props} />
);

const Label = ({ children, className = '', ...props }) => (
  <label className={`minsa-form-label ${className}`} {...props}>
    {children}
  </label>
);

export default function MinsaLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulamos una autenticación exitosa después de un breve delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        primer_nombre: 'MINSA',
        primer_apellido: 'Usuario',
        username: username
      };
      
      authService.loginMinsa('fake-token-minsa-' + Date.now(), userData);
      window.location.href = '/minsa/dashboard';
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToCitas = () => {
    window.location.href = '/login';
  };

  return (
    <div className="minsa-login-container">
      <Card>
        <CardHeader>
          <div className="minsa-login-logo-container">
            <img
              src="/minsa-logo.jpg"
              alt="Ministerio de Salud"
              width={300}
              height={120}
              className="minsa-login-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="minsa-logo-placeholder" style={{display: 'none'}}>
              <div className="minsa-logo-text">MINSA</div>
              <div className="minsa-logo-subtitle">Ministerio de Salud</div>
            </div>
          </div>
          <CardTitle>Iniciar Sesión</CardTitle>
          <p className="minsa-login-subtitle">Estadísticas de la Salud Nicaragüense</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="minsa-login-form">
            <div className="minsa-form-fields">
              <div className="minsa-form-group">
                <Label htmlFor="username">
                  Usuario
                </Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Ingrese su usuario" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="minsa-form-group">
                <Label htmlFor="password">
                  Contraseña
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Ingrese su contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Ingresar al Sistema MINSA'}
            </Button>
          </form>

          <div className="minsa-login-actions">
            <button 
              onClick={handleGoToCitas}
              className="minsa-go-to-citas"
              disabled={isLoading}
            >
              Ir al Sistema de Citas
            </button>
            
            <div className="minsa-demo-credentials">
              <p>Credenciales de demostración:</p>
              <p>Usuario: <strong>minsa</strong></p>
              <p>Contraseña: <strong>cualquier texto</strong></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}