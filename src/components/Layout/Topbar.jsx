import React, { useState } from 'react';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { strings } from '../../utils/strings';

const Topbar = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search batches, farmers, or herbs..."
            className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-50">
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>{strings.nav.settings}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-dark-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{strings.nav.logout}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
