import React, { useState } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import MainContent from '../../components/layout/MainContent';
import RightSidebar from '../../components/layout/RightSidebar';
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