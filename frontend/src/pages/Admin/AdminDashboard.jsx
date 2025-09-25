import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Package, CheckCircle, AlertTriangle, Clock, TrendingUp, Users, Leaf, 
  Activity, Zap, Globe, Shield, Star, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, Download, RefreshCw, Eye, MoreHorizontal,
  Sparkles, Target, Award, Briefcase
} from 'lucide-react';
import Card from '../../components/UI/Card';
import DataTable from '../../components/UI/DataTable';
import StatusBadge from '../../components/UI/StatusBadge';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const AdminDashboard = ({ user, showToast }) => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    loadDashboardData();
    // Staggered animations
    const timer = setTimeout(() => setAnimationStep(1), 300);
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, harvestData, batchesData] = await Promise.all([
        api.getDashboardStats(),
        api.getHarvestData(),
        api.getBatches()
      ]);
      
      setStats(statsData);
      setChartData(harvestData);
      setBatches(batchesData.slice(0, 8)); // Show more batches
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Collections',
      subtitle: 'Active batches in system',
      value: stats?.totalCollections || 1547,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
      changeType: 'positive',
      trend: [65, 78, 82, 95, 88, 92, 100],
      target: 1600
    },
    {
      title: 'Verified Batches',
      subtitle: 'Quality approved',
      value: stats?.verifiedBatches || 1089,
      icon: Shield,
      gradient: 'from-emerald-500 to-primary-500',
      change: '+8.2%',
      changeType: 'positive',
      trend: [45, 52, 68, 75, 82, 88, 95],
      target: 1200
    },
    {
      title: 'Active Farmers',
      subtitle: 'Contributing suppliers',
      value: stats?.activeFarmers || 234,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      change: '+15.3%',
      changeType: 'positive',
      trend: [20, 25, 30, 35, 42, 48, 55],
      target: 300
    },
    {
      title: 'Quality Score',
      subtitle: 'Average batch rating',
      value: stats?.qualityScore || 94.2,
      icon: Star,
      gradient: 'from-yellow-500 to-orange-500',
      change: '+2.1%',
      changeType: 'positive',
      trend: [88, 89, 91, 92, 93, 94, 94.2],
      target: 95,
      suffix: '%'
    }
  ];

  const pieData = [
    { name: 'Verified', value: 68, color: '#22c55e' },
    { name: 'Pending', value: 22, color: '#f59e0b' },
    { name: 'Processing', value: 8, color: '#3b82f6' },
    { name: 'Rejected', value: 2, color: '#ef4444' }
  ];

  const areaData = [
    { month: 'Jan', harvest: 420, processed: 380, verified: 340 },
    { month: 'Feb', harvest: 520, processed: 480, verified: 450 },
    { month: 'Mar', harvest: 680, processed: 620, verified: 580 },
    { month: 'Apr', harvest: 780, processed: 720, verified: 680 },
    { month: 'May', harvest: 920, processed: 850, verified: 800 },
    { month: 'Jun', harvest: 1100, processed: 1020, verified: 980 }
  ];

  const batchColumns = [
    { key: 'id', label: strings.batches.batchId, sortable: true },
    { key: 'herb', label: strings.batches.herb, sortable: true },
    { key: 'farmer', label: strings.batches.farmer, sortable: true },
    { key: 'location', label: strings.batches.location },
    { key: 'status', label: strings.batches.status, type: 'status' },
    { key: 'qualityScore', label: strings.batches.qualityScore, type: 'number' }
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
                  <Leaf className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.name || 'Admin'}!
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Your supply chain is performing exceptionally well today
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">All Systems Operational</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
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
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const progress = ((stat.value / stat.target) * 100).toFixed(1);
          
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
                      <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-gray-500 text-xs">{stat.subtitle}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Value */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </span>
                      {stat.suffix && <span className="text-lg text-gray-400">{stat.suffix}</span>}
                    </div>
                    
                    {/* Change indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 text-xs">vs last period</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Progress to target</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Mini trend chart */}
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stat.trend.map((value, i) => ({ value, index: i }))}>
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

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Supply Chain Flow - Area Chart */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Supply Chain Flow</h3>
                  <p className="text-gray-400 text-sm">Harvest → Processing → Verification trends</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-300 text-xs">Harvest</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 text-xs">Processed</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-300 text-xs">Verified</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="harvestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="processedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="verifiedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
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
                        backdropFilter: 'blur(12px)'
                      }}
                    />
                    <Area type="monotone" dataKey="harvest" stackId="1" stroke="#22c55e" fill="url(#harvestGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="processed" stackId="1" stroke="#3b82f6" fill="url(#processedGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="verified" stackId="1" stroke="#8b5cf6" fill="url(#verifiedGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Status Distribution - Pie Chart */}
        <div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Batch Status</h3>
                <p className="text-gray-400 text-sm">Current distribution</p>
              </div>
              
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value, percent }) => {
                        if (percent > 0.05) { // Only show label if slice is > 5%
                          return `${name}: ${value}%`;
                        }
                        return '';
                      }}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
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
                      labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white">{item.value}%</span>
                      <div className="text-xs text-gray-400">of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity Feed */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary-500/20 to-blue-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
                <p className="text-gray-400 text-sm">Latest supply chain events</p>
              </div>
              <button className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 rounded-xl text-primary-300 text-sm transition-all duration-200">
                View All
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {batches.slice(0, 6).map((batch, index) => (
                <div key={batch.id} className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg`}>
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{batch.herb}</p>
                      <StatusBadge status={batch.status} />
                    </div>
                    <p className="text-gray-400 text-sm">{batch.farmer} • {batch.location}</p>
                    <p className="text-gray-500 text-xs mt-1">Quality Score: {batch.qualityScore}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{new Date(batch.harvestDate).toLocaleDateString()}</p>
                    <button className="mt-2 p-2 opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Performance Metrics</h3>
              <p className="text-gray-400 text-sm">Key performance indicators</p>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Processing Efficiency', value: 94, color: 'from-emerald-500 to-primary-500', icon: Zap },
                { label: 'Quality Compliance', value: 98, color: 'from-blue-500 to-purple-500', icon: Shield },
                { label: 'Supply Chain Speed', value: 87, color: 'from-yellow-500 to-orange-500', icon: Activity },
                { label: 'Farmer Satisfaction', value: 92, color: 'from-pink-500 to-red-500', icon: Award }
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
                      <span className="text-2xl font-bold text-white">{metric.value}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
