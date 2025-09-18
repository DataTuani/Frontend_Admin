import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import RightSidebar from './RightSidebar';
import './Dashboard.css';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar />
      <div className="dashboard-main">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="dashboard-content">
          <MainContent />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}