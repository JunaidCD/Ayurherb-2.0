import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Eye, Plus, TrendingUp, BarChart3, 
  RefreshCw, Download, Calendar, MapPin, User, Scale, Activity,
  CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  Sparkles, Target, Zap, Database
} from 'lucide-react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import DataTable from '../../components/UI/DataTable';
import { api } from '../../utils/api';

const Batches = ({ user, showToast }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    loadBatches();
    // Staggered animations
    const timer = setTimeout(() => setAnimationStep(1), 300);
    return () => clearTimeout(timer);
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await api.getBatches();
      setBatches(data);
    } catch (error) {
      showToast('Failed to load batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.herb.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      header: 'Batch ID',
      render: (value) => (
        <span className="font-mono text-primary-400">{value}</span>
      )
    },
    {
      key: 'herb',
      header: 'Herb',
      render: (value) => (
        <span className="font-medium text-white">{value}</span>
      )
    },
    {
      key: 'farmer',
      header: 'Farmer',
      render: (value) => (
        <span className="text-gray-300">{value}</span>
      )
    },
    {
      key: 'location',
      header: 'Location',
      render: (value) => (
        <span className="text-gray-300">{value}</span>
      )
    },
    {
      key: 'harvestDate',
      header: 'Harvest Date',
      render: (value) => (
        <span className="text-gray-300">{new Date(value).toLocaleDateString()}</span>
      )
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (value) => (
        <span className="text-gray-300">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'qualityScore',
      header: 'Quality Score',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-slate-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                value >= 90 ? 'bg-emerald-500' : 
                value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm text-gray-300">{value}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, batch) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast(`Viewing details for ${batch.id}`, 'info')}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Get batch statistics
  const getStatusCounts = () => {
    const counts = { verified: 0, synced: 0, recalled: 0, queued: 0 };
    batches.forEach(batch => {
      const status = batch.status.toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalBatches = batches.length;
  const avgQualityScore = batches.length > 0 ? 
    Math.round(batches.reduce((acc, batch) => acc + batch.qualityScore, 0) / batches.length) : 0;

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
                  <Database className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Batch Management
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Advanced tracking and management of herb batches throughout the supply chain
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Live Tracking</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {totalBatches} Total Batches • {filteredBatches.length} Filtered
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={loadBatches}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                <Download className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Batches',
            value: totalBatches,
            change: '+12%',
            changeType: 'positive',
            icon: Package,
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Verified Batches',
            value: statusCounts.verified,
            change: '+8%',
            changeType: 'positive',
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-primary-500'
          },
          {
            title: 'Avg Quality Score',
            value: `${avgQualityScore}%`,
            change: '+5%',
            changeType: 'positive',
            icon: Target,
            gradient: 'from-indigo-500 to-blue-500'
          },
          {
            title: 'Processing Rate',
            value: '94%',
            change: '+3%',
            changeType: 'positive',
            icon: Zap,
            gradient: 'from-yellow-500 to-orange-500'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`group transform transition-all duration-700 ${
                animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{stat.value}</span>
                    </div>
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
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Filters */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search batches, farmers, or herbs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-12 pr-10 py-3 bg-gray-800/90 border border-white/20 rounded-xl text-white font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 cursor-pointer shadow-lg"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em 1.25em'
                  }}
                >
                  <option value="all" className="bg-gray-800 text-white py-2">🔄 All Statuses</option>
                  <option value="queued" className="bg-gray-800 text-white py-2">⏳ Queued</option>
                  <option value="synced" className="bg-gray-800 text-white py-2">🔄 Synced</option>
                  <option value="verified" className="bg-gray-800 text-white py-2">✅ Verified</option>
                  <option value="recalled" className="bg-gray-800 text-white py-2">⚠️ Recalled</option>
                </select>
              </div>
              
              <button
                onClick={() => showToast('Add batch functionality coming soon!', 'info')}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Batches Table */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Batch Inventory</h3>
                <p className="text-gray-400">Complete overview of all batches in the system</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full">
                <Activity className="w-4 h-4 text-primary-400" />
                <span className="text-primary-300 text-sm font-medium">{filteredBatches.length} Results</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <DataTable
              data={filteredBatches}
              columns={columns}
              loading={loading}
              emptyMessage="No batches found matching your criteria"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batches;
