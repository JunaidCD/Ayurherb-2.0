import React, { useState, useEffect } from 'react';
import { Leaf, User, Settings, Beaker, Shield, ArrowRight, Eye, EyeOff, Sparkles, Lock, Mail } from 'lucide-react';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const Login = ({ onLogin, showToast }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Staggered animation for role cards
    const timer = setTimeout(() => {
      setAnimationStep(1);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const roles = [
    {
      id: 'Admin',
      name: strings.roles.admin,
      description: strings.login.adminDesc,
      icon: Settings,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderGradient: 'from-purple-500/50 to-purple-600/50',
      credentials: { username: 'admin', password: 'admin123' },
      features: ['System Analytics', 'User Management', 'Full Access']
    },
    {
      id: 'Processor',
      name: strings.roles.processor,
      description: strings.login.processorDesc,
      icon: User,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderGradient: 'from-blue-500/50 to-blue-600/50',
      credentials: { username: 'processor', password: 'process123' },
      features: ['Batch Processing', 'Workflow Management', 'Quality Control']
    },
    {
      id: 'Lab Tester',
      name: strings.roles.labTester,
      description: strings.login.labTesterDesc,
      icon: Beaker,
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-500/20 to-primary-600/20',
      borderGradient: 'from-primary-500/50 to-primary-600/50',
      credentials: { username: 'labtester', password: 'lab123' },
      features: ['Quality Testing', 'Lab Reports', 'Compliance Check']
    },
    {
      id: 'Customer',
      name: strings.roles.customer,
      description: strings.login.customerDesc,
      icon: Shield,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-500/20 to-orange-600/20',
      borderGradient: 'from-orange-500/50 to-orange-600/50',
      credentials: { username: 'customer', password: 'customer123' },
      features: ['Product Tracking', 'QR Scanning', 'Provenance View']
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    const selectedRoleData = roles.find(r => r.id === roleId);
    if (selectedRoleData) {
      setCredentials({
        username: selectedRoleData.credentials.username,
        password: selectedRoleData.credentials.password
      });
    }
  };

  const handleQuickLogin = (role) => {
    setSelectedRole(role.id);
    setCredentials({
      username: role.credentials.username,
      password: role.credentials.password
    });
    // Auto-login after a short delay
    setTimeout(() => {
      handleLogin(null, role);
    }, 500);
  };

  const handleLogin = async (e, roleData = null) => {
    if (e) e.preventDefault();
    
    const currentRole = roleData || roles.find(r => r.id === selectedRole);
    
    if (!currentRole) {
      showToast('Please select a role', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.login({
        username: credentials.username,
        password: credentials.password,
        role: currentRole.id
      });
      
      onLogin(response.user);
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>

      {/* Modern Navbar */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  {strings.appName}
                </h1>
                <p className="text-xs text-gray-400 font-medium">Supply Chain Management</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors font-medium">Contact</a>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 text-sm font-medium">Live Demo</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div className="w-full max-w-7xl">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-primary-300 text-sm font-medium">Next-Generation Supply Chain</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-gray-100 to-primary-200 bg-clip-text text-transparent leading-tight mb-6">
                Ayurvedic Supply Chain
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-emerald-400 to-primary-500 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Experience the future of Ayurvedic supply chain management with our comprehensive platform. 
                Track, manage, and optimize your entire supply chain from farm to consumer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-primary-600 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">4 Role-Based Dashboards</p>
                  <p className="text-gray-400 text-sm">Admin, Processor, Lab Tester, Customer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stunning Role Selection */}
          {!selectedRole && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent mb-6">
                  Choose Your Access Portal
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                  Select your role to access the comprehensive dashboard tailored for your responsibilities
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={role.id}
                      className={`transform transition-all duration-700 ${
                        animationStep ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className="group cursor-pointer relative h-full">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Main card */}
                        <div 
                          onClick={() => handleQuickLogin(role)}
                          className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl group-hover:shadow-primary-500/25 transition-all duration-500 transform group-hover:scale-105"
                        >
                          
                          {/* Header */}
                          <div className="text-center mb-8">
                            <div className="relative mb-6">
                              <div className={`w-20 h-20 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-shadow duration-300`}>
                                <Icon className="w-10 h-10 text-white" />
                              </div>
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Sparkles className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {role.name}
                            </h3>
                            <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                              {role.description}
                            </p>
                          </div>
                          
                          {/* Features */}
                          <div className="space-y-3 mb-8">
                            {role.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                                <div className={`w-2 h-2 bg-gradient-to-r ${role.gradient} rounded-full shadow-lg`}></div>
                                <span className="font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Access button */}
                          <button className={`w-full py-4 px-6 bg-gradient-to-r ${role.gradient} text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3`}>
                            <span>Access Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                          </button>

                          {/* Status indicator */}
                          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Elegant Login Form */}
          {selectedRole && (
            <div className="max-w-lg mx-auto mt-16">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-3xl blur-xl opacity-75"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
                  
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="relative inline-block mb-6">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-3xl blur opacity-60"></div>
                      <div className={`relative w-20 h-20 bg-gradient-to-br ${roles.find(r => r.id === selectedRole)?.gradient} rounded-3xl flex items-center justify-center shadow-2xl`}>
                        {React.createElement(roles.find(r => r.id === selectedRole)?.icon, { 
                          className: "w-10 h-10 text-white" 
                        })}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent mb-3">
                      {roles.find(r => r.id === selectedRole)?.name} Portal
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      Enter your credentials to access your personalized dashboard
                    </p>
                    
                    <button
                      onClick={() => setSelectedRole('')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-primary-400 hover:text-primary-300 font-medium rounded-xl border border-white/20 hover:border-primary-500/50 transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      <span>Change Role</span>
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-8">
                    {/* Username Field */}
                    <div className="space-y-3">
                      <label className="block text-base font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        {strings.login.username}
                      </label>
                      <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        className="w-full py-4 px-6 bg-white/10 border-2 border-white/20 focus:border-primary-500 text-white text-lg placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your username"
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                      <label className="block text-base font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                        {strings.login.password}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={credentials.password}
                          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                          className="w-full py-4 px-6 pr-16 bg-white/10 border-2 border-white/20 focus:border-primary-500 text-white text-lg placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-5 px-8 bg-gradient-to-r from-primary-500 via-emerald-500 to-primary-600 hover:from-primary-600 hover:via-emerald-600 hover:to-primary-700 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 ${
                        loading ? 'opacity-75 cursor-not-allowed transform-none' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>{strings.login.loginButton}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
