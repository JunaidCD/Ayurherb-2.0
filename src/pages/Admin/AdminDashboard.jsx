import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, CheckCircle, AlertTriangle, Clock, TrendingUp, Users, Leaf } from 'lucide-react';
import Card from '../../components/UI/Card';
import DataTable from '../../components/UI/DataTable';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const AdminDashboard = ({ user, showToast }) => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
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
      setBatches(batchesData.slice(0, 5)); // Show only recent 5 batches
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: strings.dashboard.totalCollections,
      value: stats?.totalCollections || 0,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      change: '+12%'
    },
    {
      title: strings.dashboard.verifiedBatches,
      value: stats?.verifiedBatches || 0,
      icon: CheckCircle,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20',
      change: '+8%'
    },
    {
      title: strings.dashboard.recalledBatches,
      value: stats?.recalledBatches || 0,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      change: '-2%'
    },
    {
      title: strings.dashboard.pendingTests,
      value: stats?.pendingTests || 0,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      change: '+5%'
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {strings.dashboard.welcome}, {user.name}!
          </h1>
          <p className="text-gray-400">{strings.dashboard.overview}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-primary-400" />
                    <span className="text-primary-400 text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-500/5 pointer-events-none"></div>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harvest Trends Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{strings.dashboard.harvestTrends}</h3>
            <button className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
              {strings.dashboard.viewAll}
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="harvest" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{strings.dashboard.recentActivity}</h3>
            <button className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
              {strings.dashboard.viewAll}
            </button>
          </div>
          <div className="space-y-4">
            {batches.slice(0, 4).map((batch, index) => (
              <div key={batch.id} className="flex items-center gap-4 p-3 bg-dark-700/50 rounded-lg">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{batch.herb}</p>
                  <p className="text-gray-400 text-sm">{batch.farmer} • {batch.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 text-sm font-medium">{batch.status}</p>
                  <p className="text-gray-500 text-xs">{batch.harvestDate}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Batch Details Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{strings.dashboard.batchDetails}</h3>
          <button className="btn-primary">
            {strings.dashboard.viewAll}
          </button>
        </div>
        <DataTable
          data={batches}
          columns={batchColumns}
          searchable={true}
          filterable={true}
          onRowClick={(batch) => showToast(`Viewing batch ${batch.id}`, 'info')}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
