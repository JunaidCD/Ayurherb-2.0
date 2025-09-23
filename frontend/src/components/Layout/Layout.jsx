import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
