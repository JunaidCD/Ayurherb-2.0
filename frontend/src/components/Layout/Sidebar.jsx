import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package,
  Settings, 
  Database,
  Beaker,
  Leaf,
  Users,
  Shield,
  Plus,
  Eye,
  FileCheck,
  Search,
  Info
} from 'lucide-react';
import { strings } from '../../utils/strings';

const Sidebar = ({ user }) => {
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { 
        path: '/dashboard', 
        icon: LayoutDashboard, 
        label: strings.nav.dashboard,
        roles: ['Admin', 'Processor', 'Lab Tester', 'Customer']
      }
    ];

    const roleSpecificItems = {
      'Admin': [
        { path: '/collections', icon: Database, label: strings.nav.collections },
        { path: '/verification-report', icon: FileCheck, label: 'Verification & Report' },
        { path: '/settings', icon: Settings, label: strings.nav.settings }
      ],
      'Processor': [
        { path: '/batches', icon: Package, label: 'Batches' },
        { path: '/add-processing', icon: Plus, label: 'Add Processing' }
      ],
      'Lab Tester': [
        { path: '/see-item', icon: Eye, label: 'See Item' },
        { path: '/lab-test', icon: Beaker, label: 'Lab Test' }
      ],
      'Customer': [
        { path: '/view-product', icon: Search, label: 'View Product' },
        { path: '/information', icon: Info, label: 'Information' }
      ]
    };

    // Filter base items by user role
    const filteredBaseItems = baseItems.filter(item => 
      !item.roles || item.roles.includes(user?.role)
    );
    
    return [...filteredBaseItems, ...(roleSpecificItems[user?.role] || [])];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{strings.appName}</h1>
            <p className="text-xs text-gray-400">{strings.appTagline}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Ayurherb 2.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
