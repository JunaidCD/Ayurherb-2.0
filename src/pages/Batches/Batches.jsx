import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, Plus } from 'lucide-react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import DataTable from '../../components/UI/DataTable';
import { api } from '../../utils/api';

const Batches = ({ user, showToast }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBatches();
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Batch Management</h1>
          <p className="text-gray-400">Track and manage herb batches throughout the supply chain</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="queued">Queued</option>
                <option value="synced">Synced</option>
                <option value="verified">Verified</option>
                <option value="recalled">Recalled</option>
              </select>
            </div>
            <button
              onClick={() => showToast('Add batch functionality coming soon!', 'info')}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Batch
            </button>
          </div>
        </div>
      </Card>

      {/* Batches Table */}
      <Card>
        <DataTable
          data={filteredBatches}
          columns={columns}
          loading={loading}
          emptyMessage="No batches found"
        />
      </Card>
    </div>
  );
};

export default Batches;
