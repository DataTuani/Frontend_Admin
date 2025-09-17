import React from 'react';
import './RightSidebar.css';

export default function RightSidebar() {
  return (
    <div className="right-sidebar">
      {/* Daily Summary */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <svg className="card-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Resumen del día
          </h2>
        </div>
        <div className="card-content">
          <div className="summary-list">
            <div className="summary-item">
              <span className="summary-label">Total Citas</span>
              <span className="summary-value">4</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Presenciales</span>
              <span className="summary-value">2</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Virtuales</span>
              <span className="summary-value">2</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pendientes</span>
              <span className="summary-value">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <svg className="card-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Próximas Citas
          </h2>
        </div>
        <div className="card-content">
          <div className="summary-list">
            <div className="summary-item">
              <span className="summary-label">Total Citas</span>
              <span className="summary-value">6 Citas</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Presenciales</span>
              <span className="summary-value">2 Citas</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Virtuales</span>
              <span className="summary-value">3 Citas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}