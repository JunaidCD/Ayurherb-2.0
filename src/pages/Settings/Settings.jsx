import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import Card from '../../components/UI/Card';

const Settings = ({ user, showToast }) => {
  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account and application preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'User Name'}
                className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email || 'user@ayurherb.com'}
                className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <input
                type="text"
                value={user?.role || 'User'}
                disabled
                className="w-full py-2 px-3 bg-slate-600 border border-slate-500 rounded-lg text-gray-300"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push Notifications</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">SMS Alerts</span>
              <input type="checkbox" className="w-4 h-4 text-primary-500" />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Change Password
            </button>
            <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Enable Two-Factor Authentication
            </button>
            <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Revoke All Sessions
            </button>
          </div>
        </Card>

        {/* System Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">System</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Dark Mode</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto-sync Data</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-primary-500 focus:outline-none">
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg transition-all duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
