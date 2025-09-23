import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Download, FileText, TrendingUp, Leaf, Droplets, Award, Shield,
  BarChart3, RefreshCw, Filter, Calendar, ArrowUpRight, ArrowDownRight,
  Sparkles, Target, Zap, Activity, Globe, Eye, MoreHorizontal, Plus
} from 'lucide-react';
import Card from '../../components/UI/Card';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const Reports = ({ user, showToast }) => {
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadReportsData();
    // Staggered animations
    const timer = setTimeout(() => setAnimationStep(1), 300);
    return () => clearTimeout(timer);
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      const [envData, compData] = await Promise.all([
        api.getEnvironmentalReport(),
        api.getAyushCompliance()
      ]);
      
      setEnvironmentalData(envData);
      setComplianceData(compData);
    } catch (error) {
      showToast('Failed to load reports data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type) => {
    showToast(`Exporting ${type} report...`, 'info');
    // Simulate export functionality
  };

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

  const sustainabilityData = [
    { name: 'Excellent', value: 45, color: '#22C55E' },
    { name: 'Good', value: 35, color: '#3B82F6' },
    { name: 'Fair', value: 15, color: '#F59E0B' },
    { name: 'Poor', value: 5, color: '#EF4444' }
  ];

  const metricCards = [
    {
      title: 'Carbon Footprint',
      subtitle: 'CO₂ emissions reduced',
      value: environmentalData?.carbonFootprint || 2.4,
      unit: 'kg CO₂',
      icon: Leaf,
      gradient: 'from-emerald-500 to-green-500',
      change: '-12%',
      changeType: 'positive',
      target: 3.0,
      trend: [2.8, 2.7, 2.5, 2.4, 2.3, 2.4]
    },
    {
      title: 'Water Usage',
      subtitle: 'Optimized consumption',
      value: environmentalData?.waterUsage || 1250,
      unit: 'Liters',
      icon: Droplets,
      gradient: 'from-blue-500 to-cyan-500',
      change: '-8%',
      changeType: 'positive',
      target: 1500,
      trend: [1400, 1350, 1300, 1280, 1260, 1250]
    },
    {
      title: 'Sustainability Score',
      subtitle: 'Overall environmental rating',
      value: environmentalData?.sustainabilityScore || 87,
      unit: '%',
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      change: '+5%',
      changeType: 'positive',
      target: 90,
      trend: [82, 83, 85, 86, 86, 87]
    },
    {
      title: 'AYUSH Compliance',
      subtitle: 'Regulatory adherence',
      value: complianceData?.overallCompliance || 94.2,
      unit: '%',
      icon: Shield,
      gradient: 'from-yellow-500 to-orange-500',
      change: '+3%',
      changeType: 'positive',
      target: 95,
      trend: [91, 92, 93, 93.5, 94, 94.2]
    }
  ];

  const environmentalTrends = [
    { month: 'Jan', carbon: 2.8, water: 1400, sustainability: 82 },
    { month: 'Feb', carbon: 2.7, water: 1350, sustainability: 83 },
    { month: 'Mar', carbon: 2.5, water: 1300, sustainability: 85 },
    { month: 'Apr', carbon: 2.4, water: 1280, sustainability: 86 },
    { month: 'May', carbon: 2.3, water: 1260, sustainability: 86 },
    { month: 'Jun', carbon: 2.4, water: 1250, sustainability: 87 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-dark-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-dark-700 rounded-xl"></div>
            <div className="h-80 bg-dark-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

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
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Reports & Analytics
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Environmental impact and compliance insights for sustainable operations
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Real-time Analytics</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleExportReport('Environmental')}
                  className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => handleExportReport('Environmental')}
                  className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <Filter className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              
              <button 
                onClick={() => handleExportReport('PDF')}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const progress = ((metric.value / metric.target) * 100).toFixed(1);
          
          return (
            <div
              key={index}
              className={`group transform transition-all duration-700 ${
                animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-full">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Main card */}
                <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium mb-1">{metric.title}</p>
                      <p className="text-gray-500 text-xs">{metric.subtitle}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Value */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                      </span>
                      <span className="text-lg text-gray-400">{metric.unit}</span>
                    </div>
                    
                    {/* Change indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      {metric.changeType === 'positive' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm font-semibold ${
                        metric.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-gray-500 text-xs">vs last period</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Target progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Mini trend chart */}
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.trend.map((value, i) => ({ value, index: i }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="url(#gradient)" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Environmental Impact Trends - Enhanced */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Environmental Impact Trends</h3>
                  <p className="text-gray-400 text-sm">Multi-dimensional sustainability metrics over time</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-300 text-xs">Carbon</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 text-xs">Water</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-300 text-xs">Sustainability</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={environmentalTrends}>
                    <defs>
                      <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="sustainabilityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)',
                        color: '#ffffff'
                      }}
                    />
                    <Area type="monotone" dataKey="carbon" stackId="1" stroke="#22c55e" fill="url(#carbonGradient)" strokeWidth={3} />
                    <Area type="monotone" dataKey="water" stackId="2" stroke="#3b82f6" fill="url(#waterGradient)" strokeWidth={3} />
                    <Area type="monotone" dataKey="sustainability" stackId="3" stroke="#8b5cf6" fill="url(#sustainabilityGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Sustainability Donut Chart */}
        <div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Sustainability Score</h3>
                <p className="text-gray-400 text-sm">Performance distribution across categories</p>
              </div>
              
              <div className="relative h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sustainabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={false}
                    >
                      {sustainabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        color: '#1f2937'
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Score Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white">87%</div>
                    <div className="text-xs text-gray-400">Overall Score</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                {sustainabilityData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-white font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Performance Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Real-time Performance Monitor */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Performance Monitor</h3>
                <p className="text-gray-400 text-sm">Real-time system health indicators</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 text-xs font-medium">Live</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Supply Chain Efficiency', value: 94, color: 'from-emerald-500 to-primary-500', icon: Zap },
                { label: 'Quality Compliance', value: 98, color: 'from-blue-500 to-purple-500', icon: Shield },
                { label: 'Environmental Impact', value: 87, color: 'from-green-500 to-emerald-500', icon: Leaf },
                { label: 'Farmer Satisfaction', value: 92, color: 'from-yellow-500 to-orange-500', icon: Award }
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-300 font-medium">{metric.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">{metric.value}%</span>
                        <div className="text-xs text-emerald-400">+2.3%</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000 ease-out relative`}
                          style={{ width: `${metric.value}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Compliance Matrix */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AYUSH Compliance Matrix</h3>
                <p className="text-gray-400 text-sm">Regulatory compliance across all categories</p>
              </div>
              <button 
                onClick={() => handleExportReport('AYUSH Compliance')}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: 'Quality Standards', score: 96.5, status: 'Excellent' },
                { name: 'Documentation', score: 92.8, status: 'Good' },
                { name: 'Traceability', score: 98.1, status: 'Excellent' },
                { name: 'Safety Protocols', score: 89.4, status: 'Good' }
              ].map((category, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold text-sm">{category.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {category.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-white">{category.score}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        category.status === 'Excellent' ? 'bg-gradient-to-r from-emerald-500 to-primary-500' :
                        'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Quality', score: 96.5 },
                  { name: 'Docs', score: 92.8 },
                  { name: 'Trace', score: 98.1 },
                  { name: 'Safety', score: 89.4 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="score" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Report Generation Hub */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary-500/20 to-blue-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Advanced Report Generation</h3>
              <p className="text-gray-400 text-lg">Create comprehensive analytics reports for stakeholders and compliance</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">AI-Powered Insights</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Reports */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Quick Reports
              </h4>
              
              {[
                { name: 'Daily Summary', desc: 'Key metrics overview', time: '< 1 min', color: 'from-emerald-500 to-green-500' },
                { name: 'Weekly Analytics', desc: 'Trend analysis report', time: '< 2 min', color: 'from-blue-500 to-cyan-500' },
                { name: 'Monthly Compliance', desc: 'Regulatory status', time: '< 3 min', color: 'from-primary-500 to-emerald-500' }
              ].map((report, index) => (
                <div key={index} className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-white font-semibold">{report.name}</h5>
                    <span className="text-xs text-gray-400">{report.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{report.desc}</p>
                  <button 
                    onClick={() => handleExportReport(report.name)}
                    className={`w-full py-2 px-4 bg-gradient-to-r ${report.color} text-white font-medium rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0`}
                  >
                    Generate Report
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Reports */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Custom Reports
              </h4>
              
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
                    <select className="w-full py-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                      <option>Environmental Impact</option>
                      <option>Supply Chain Analysis</option>
                      <option>Compliance Audit</option>
                      <option>Performance Review</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                    <select className="w-full py-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 6 months</option>
                      <option>Last year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 px-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-200">
                        PDF
                      </button>
                      <button className="py-2 px-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm hover:bg-green-500/30 transition-all duration-200">
                        Excel
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleExportReport('Custom')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Generate Custom Report
                  </button>
                </div>
              </div>
            </div>

            {/* Scheduled Reports */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Scheduled Reports
              </h4>
              
              {[
                { name: 'Weekly Sustainability', next: 'Tomorrow 9:00 AM', status: 'Active' },
                { name: 'Monthly Compliance', next: 'Next Monday', status: 'Active' },
                { name: 'Quarterly Review', next: 'In 2 weeks', status: 'Pending' }
              ].map((schedule, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-semibold text-sm">{schedule.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">Next: {schedule.next}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1 px-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-all duration-200">
                      Edit
                    </button>
                    <button className="flex-1 py-1 px-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-all duration-200">
                      Run Now
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => showToast('Schedule new report functionality coming soon!', 'info')}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule New Report
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-white">Recent Reports</h4>
              <button className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Environmental Impact Q3', date: '2 hours ago', size: '2.4 MB', type: 'PDF' },
                { name: 'Weekly Compliance', date: 'Yesterday', size: '1.8 MB', type: 'Excel' },
                { name: 'Supply Chain Analysis', date: '3 days ago', size: '3.1 MB', type: 'PDF' },
                { name: 'Monthly Summary', date: '1 week ago', size: '2.7 MB', type: 'PDF' }
              ].map((report, index) => (
                <div key={index} className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <FileText className="w-5 h-5 text-primary-400" />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.type === 'PDF' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {report.type}
                    </span>
                  </div>
                  <h5 className="text-white font-medium text-sm mb-2">{report.name}</h5>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                  </div>
                  <button className="w-full mt-3 py-2 px-3 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-xs rounded transition-all duration-200 opacity-0 group-hover:opacity-100">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
