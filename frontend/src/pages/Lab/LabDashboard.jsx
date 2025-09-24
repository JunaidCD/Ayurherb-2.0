import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Beaker, TestTube, CheckCircle, XCircle, Clock,
  TrendingUp, Activity, AlertCircle, FlaskConical, Microscope,
  RefreshCw, Calendar, User, Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const LabDashboard = ({ user, showToast }) => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalPending: 0,
    totalCompleted: 0,
    totalFailed: 0
  });

  useEffect(() => {
    loadBatches();
    loadRecentActivity();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await api.getBatches();
      setBatches(data);
      calculateStats(data);
    } catch (error) {
      showToast('Failed to load batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = () => {
    // Mock recent activity data
    setRecentActivity([
      {
        id: 1,
        action: 'Test Completed',
        batchId: 'BAT 2024 001',
        herb: 'Brahmi',
        time: '2 hours ago',
        status: 'passed'
      },
      {
        id: 2,
        action: 'Test Started',
        batchId: 'BAT 2024 002',
        herb: 'Ashwagandha',
        time: '4 hours ago',
        status: 'pending'
      },
      {
        id: 3,
        action: 'Test Failed',
        batchId: 'BAT 2024 003',
        herb: 'Turmeric',
        time: '6 hours ago',
        status: 'failed'
      }
    ]);
  };

  const calculateStats = (batchData) => {
    const pending = batchData.filter(batch => !batch.labResults).length;
    const completed = batchData.filter(batch => batch.labResults && batch.labResults.ayushCompliance !== false).length;
    const failed = batchData.filter(batch => batch.labResults && batch.labResults.ayushCompliance === false).length;
    
    setStats({
      totalPending: pending,
      totalCompleted: completed,
      totalFailed: failed
    });
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.herb.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'pending') {
      matchesStatus = !batch.labResults;
    } else if (statusFilter === 'completed') {
      matchesStatus = batch.labResults && batch.labResults.ayushCompliance !== false;
    } else if (statusFilter === 'failed') {
      matchesStatus = batch.labResults && batch.labResults.ayushCompliance === false;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (batch) => {
    if (!batch.labResults) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-300 text-sm font-medium">Pending</span>
        </div>
      );
    } else if (batch.labResults.ayushCompliance === false) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-300 text-sm font-medium">Failed</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300 text-sm font-medium">Passed</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Lab Dashboard
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Quality testing and laboratory results management
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Lab Active</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {batches.length} Total Batches • {filteredBatches.length} Filtered
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
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Tests Pending',
            value: stats.totalPending,
            icon: Clock,
            gradient: 'from-yellow-500 to-orange-500',
            bgColor: 'from-yellow-500/20 to-orange-500/10'
          },
          {
            title: 'Tests Completed',
            value: stats.totalCompleted,
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-green-500',
            bgColor: 'from-emerald-500/20 to-green-500/10'
          },
          {
            title: 'Tests Failed',
            value: stats.totalFailed,
            icon: XCircle,
            gradient: 'from-red-500 to-pink-500',
            bgColor: 'from-red-500/20 to-pink-500/10'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className={`relative h-full bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.title}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by batch ID or herb name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/90 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-12 pr-10 py-3 bg-gray-800/90 border border-white/20 rounded-xl text-white font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 cursor-pointer"
              >
                <option value="all">All Tests</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Batches List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Batches Waiting for Tests</h3>
                    <p className="text-gray-400">Complete overview of all batches requiring lab testing</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                    <TestTube className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">{filteredBatches.length} Batches</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {filteredBatches.length === 0 ? (
                  <div className="text-center py-12">
                    <Beaker className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No batches found matching your criteria</p>
                  </div>
                ) : (
                  filteredBatches.map((batch) => (
                    <div 
                      key={batch.id} 
                      onClick={() => navigate(`/batch/${batch.id}`)}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Microscope className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{batch.herb}</h4>
                            <p className="text-gray-400 text-sm">{batch.id}</p>
                          </div>
                        </div>
                        {getStatusBadge(batch)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{batch.farmer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{batch.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'passed' ? 'bg-emerald-500/20' :
                      activity.status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}>
                      {activity.status === 'passed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : activity.status === 'failed' ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.batchId} • {activity.herb}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
