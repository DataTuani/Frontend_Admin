import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import RightSidebar from './RightSidebar';
import './Dashboard.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <MainContent />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}