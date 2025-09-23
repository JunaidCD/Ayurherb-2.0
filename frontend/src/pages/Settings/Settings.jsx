import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Database, Lock, Globe,
  Smartphone, Mail, Key, Eye, EyeOff, Palette, Monitor, Moon, Sun,
  Languages, RefreshCw, Download, Upload, Trash2, Save, Check,
  AlertTriangle, Info, Zap, Activity, Sparkles
} from 'lucide-react';
import Card from '../../components/UI/Card';

const Settings = ({ user, showToast }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    darkMode: true,
    autoSync: true,
    language: 'English',
    twoFactor: false
  });

  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-emerald-500 to-primary-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-yellow-500 to-orange-500' },
    { id: 'system', label: 'System', icon: Database, color: 'from-slate-500 to-gray-500' }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Modern Header with Glassmorphism */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <SettingsIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Settings & Preferences
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Customize your account and application experience
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Auto-save Enabled</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                <Download className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Tab Navigation */}
      <div className="relative">
        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <p className="text-gray-400">Manage your personal details and account information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Picture */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                        {(user?.name || 'U').charAt(0)}
                      </div>
                      <button className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-200">
                        <Upload className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">Click to upload new profile picture</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'Junaid'}
                      className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        defaultValue={user?.email || 'junaid@ayurherb.com'}
                        className="w-full py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Role</label>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                      <Shield className="w-5 h-5 text-primary-400" />
                      <span className="text-white font-medium">{user?.role || 'Administrator'}</span>
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full ml-auto">Active</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-primary-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
                  <p className="text-gray-400">Control how and when you receive notifications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Email Notifications */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Email Notifications
                  </h3>
                  
                  {[
                    { label: 'System Updates', desc: 'Important system announcements', enabled: true },
                    { label: 'Security Alerts', desc: 'Login attempts and security issues', enabled: true },
                    { label: 'Weekly Reports', desc: 'Weekly summary of activities', enabled: false },
                    { label: 'Marketing', desc: 'Product updates and promotions', enabled: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Push & SMS Notifications */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    Push & SMS Alerts
                  </h3>
                  
                  {[
                    { label: 'Push Notifications', desc: 'Browser and mobile notifications', enabled: true },
                    { label: 'SMS Alerts', desc: 'Critical alerts via text message', enabled: false },
                    { label: 'Emergency Alerts', desc: 'Urgent system notifications', enabled: true },
                    { label: 'Batch Updates', desc: 'Supply chain status changes', enabled: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                  <p className="text-gray-400">Protect your account with advanced security features</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Password & Authentication */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-yellow-400" />
                    Password & Authentication
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="w-full py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-sm transition-all duration-200"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-200">
                      Change Password
                    </button>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Two-Factor Authentication</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Add an extra layer of security to your account</p>
                      <button className="w-full py-2 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 rounded-lg transition-all duration-200">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Actions */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" />
                    Security Actions
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Active Sessions</h4>
                      <p className="text-gray-400 text-sm mb-4">Manage devices that are currently logged in</p>
                      <button className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-200">
                        View All Sessions
                      </button>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Danger Zone</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Irreversible actions that affect your account</p>
                      <button className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-200">
                        Revoke All Sessions
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Login History</h4>
                      <p className="text-gray-400 text-sm mb-4">Review recent login attempts</p>
                      <button className="w-full py-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-lg transition-all duration-200">
                        View Login History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">System Preferences</h2>
                  <p className="text-gray-400">Customize your application experience and data handling</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appearance */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-400" />
                    Appearance
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Dark Mode</p>
                          <p className="text-gray-400 text-sm">Use dark theme across the application</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
                      <div className="relative">
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select className="w-full py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200">
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data & Sync */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    Data & Synchronization
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-white font-medium">Auto-sync Data</p>
                        <p className="text-gray-400 text-sm">Automatically sync data across devices</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-2">Data Export</h4>
                      <p className="text-gray-400 text-sm mb-4">Download your data for backup or migration</p>
                      <button className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </button>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Clear Cache</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Clear application cache and temporary files</p>
                      <button className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-200">
                        Clear All Cache
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
