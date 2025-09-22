import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye, CheckCircle, Clock, Database, User, MapPin, Calendar } from 'lucide-react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import DataTable from '../../components/UI/DataTable';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const Collections = ({ user, showToast }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    queued: 0,
    synced: 0,
    verified: 0
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await api.getCollections();
      setCollections(data);
      
      // Calculate stats
      const stats = {
        total: data.length,
        queued: data.filter(c => c.status.toLowerCase() === 'queued').length,
        synced: data.filter(c => c.status.toLowerCase() === 'synced').length,
        verified: data.filter(c => c.status.toLowerCase() === 'verified').length
      };
      setStats(stats);
    } catch (error) {
      showToast('Failed to load collections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCollection = async (collection) => {
    try {
      showToast(`Syncing collection ${collection.id}...`, 'info');
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update collection status
      const updatedCollections = collections.map(c => 
        c.id === collection.id ? { ...c, status: 'Synced' } : c
      );
      setCollections(updatedCollections);
      showToast('Collection synced successfully', 'success');
    } catch (error) {
      showToast('Failed to sync collection', 'error');
    }
  };

  const handleMarkVerified = async (collection) => {
    try {
      showToast(`Marking collection ${collection.id} as verified...`, 'info');
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update collection status
      const updatedCollections = collections.map(c => 
        c.id === collection.id ? { ...c, status: 'Verified' } : c
      );
      setCollections(updatedCollections);
      showToast('Collection marked as verified', 'success');
    } catch (error) {
      showToast('Failed to verify collection', 'error');
    }
  };

  const collectionColumns = [
    { key: 'id', label: 'Collection ID', sortable: true },
    { key: 'farmer', label: strings.batches.farmer, sortable: true },
    { key: 'herb', label: strings.batches.herb, sortable: true },
    { key: 'quantity', label: strings.batches.quantity, sortable: true },
    { key: 'location', label: strings.batches.location },
    { key: 'submissionDate', label: strings.collections.submissionDate, type: 'date', sortable: true },
    { key: 'status', label: strings.collections.syncStatus, type: 'status' }
  ];

  const statCards = [
    {
      title: 'Total Collections',
      value: stats.total,
      icon: Database,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Queued',
      value: stats.queued,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Synced',
      value: stats.synced,
      icon: RefreshCw,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Verified',
      value: stats.verified,
      icon: CheckCircle,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20'
    }
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
          <div className="h-96 bg-dark-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{strings.collections.title}</h1>
          <p className="text-gray-400">{strings.collections.farmerSubmissions}</p>
        </div>
        <button 
          onClick={loadCollections}
          className="btn-primary"
        >
          <RefreshCw className="w-4 h-4" />
          {strings.actions.refresh}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Collections Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {collections.slice(0, 6).map((collection) => (
          <Card key={collection.id} hover className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{collection.farmer}</h3>
                  <p className="text-gray-400 text-sm">{collection.id}</p>
                </div>
              </div>
              <StatusBadge status={collection.status} />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Herb:</span>
                <span className="text-white">{collection.herb}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity:</span>
                <span className="text-white">{collection.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Location:</span>
                <div className="flex items-center gap-1 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{collection.location}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Submitted:</span>
                <div className="flex items-center gap-1 text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{new Date(collection.submissionDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => showToast(`Viewing collection ${collection.id}`, 'info')}
                className="btn-secondary flex-1 justify-center text-sm py-2"
              >
                <Eye className="w-4 h-4" />
                {strings.collections.viewCollection}
              </button>
              
              {collection.status.toLowerCase() === 'queued' && (
                <button
                  onClick={() => handleSyncCollection(collection)}
                  className="btn-primary flex-1 justify-center text-sm py-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {strings.collections.syncNow}
                </button>
              )}
              
              {collection.status.toLowerCase() === 'synced' && (
                <button
                  onClick={() => handleMarkVerified(collection)}
                  className="btn-primary flex-1 justify-center text-sm py-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {strings.collections.markVerified}
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Collections Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">All Collections</h3>
          <div className="flex gap-2">
            <button className="btn-secondary">
              Export CSV
            </button>
            <button className="btn-primary">
              Bulk Actions
            </button>
          </div>
        </div>
        
        <DataTable
          data={collections}
          columns={collectionColumns}
          searchable={true}
          filterable={true}
          onView={(collection) => showToast(`Viewing collection ${collection.id}`, 'info')}
          onEdit={(collection) => {
            if (collection.status.toLowerCase() === 'queued') {
              handleSyncCollection(collection);
            } else if (collection.status.toLowerCase() === 'synced') {
              handleMarkVerified(collection);
            }
          }}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Collections;
