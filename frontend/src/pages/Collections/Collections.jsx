import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Eye, CheckCircle, Clock, Database, User, MapPin, Calendar,
  Download, Filter, Search, MoreHorizontal, ArrowUpRight, Sparkles,
  TrendingUp, ArrowDownRight, Zap, Target, Award, Activity
} from 'lucide-react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import DataTable from '../../components/UI/DataTable';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';
import { sharedStorage } from '../../utils/sharedStorage';
import FarmerSubmissionForm from '../../components/FarmerSubmissionForm';

const Collections = ({ user, showToast }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    queued: 0,
    synced: 0,
    verified: 0
  });
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    loadCollections();
    // Staggered animations
    const timer = setTimeout(() => setAnimationStep(1), 300);
    
    // Set up real-time sync listener
    const removeListener = sharedStorage.addStorageListener((event) => {
      if (event.key === 'ayurherb_collections') {
        // Reload collections when data changes in other tabs
        loadCollections();
        showToast('Collections updated from another application', 'info');
      }
    });
    
    return () => {
      clearTimeout(timer);
      removeListener();
    };
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
      
      // Update collection status via API
      await api.updateCollectionStatus(collection.id, 'Synced');
      
      // Reload collections to get updated data
      await loadCollections();
      showToast('Collection synced successfully', 'success');
    } catch (error) {
      showToast('Failed to sync collection', 'error');
    }
  };

  const handleMarkVerified = async (collection) => {
    try {
      showToast(`Marking collection ${collection.id} as verified...`, 'info');
      
      // Update collection status via API
      await api.updateCollectionStatus(collection.id, 'Verified');
      
      // Reload collections to get updated data
      await loadCollections();
      showToast(`Collection ${collection.id} verified and sent to processor dashboard!`, 'success');
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
      subtitle: 'All farmer submissions',
      value: stats.total,
      icon: Database,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12.5%',
      changeType: 'positive',
      target: 50
    },
    {
      title: 'Queued',
      subtitle: 'Pending processing',
      value: stats.queued,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      change: '+5.2%',
      changeType: 'positive',
      target: 10
    },
    {
      title: 'Synced',
      subtitle: 'Successfully processed',
      value: stats.synced,
      icon: RefreshCw,
      gradient: 'from-purple-500 to-pink-500',
      change: '+18.7%',
      changeType: 'positive',
      target: 30
    },
    {
      title: 'Verified',
      subtitle: 'Quality approved',
      value: stats.verified,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-primary-500',
      change: '+22.1%',
      changeType: 'positive',
      target: 25
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
                  Collections Management
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Monitor and manage farmer submissions across the supply chain
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Real-time Sync Active</span>
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
                  onClick={loadCollections}
                  className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <Filter className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <button 
                onClick={() => setShowSubmissionForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                New Submission
              </button>
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
                      <span className="text-3xl font-black text-white">{stat.value}</span>
                      <span className="text-lg text-gray-400">items</span>
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
                      <span className="text-gray-500 text-xs">vs last week</span>
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
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Collections Grid */}
      <div className="relative mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Recent Collections</h2>
            <p className="text-gray-400">Latest farmer submissions requiring attention</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="queued">Queued</option>
              <option value="synced">Synced</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.slice(0, 6).map((collection, index) => (
            <div
              key={collection.id}
              className={`group transform transition-all duration-500 ${
                animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100 + 500}ms` }}
            >
              <div className="relative h-full">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Main card */}
                <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{collection.farmer}</h3>
                        <p className="text-primary-400 text-sm font-mono">{collection.id}</p>
                      </div>
                    </div>
                    <StatusBadge status={collection.status} />
                  </div>

                  {/* Farmer Submission Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Batch ID</p>
                      <p className="text-white font-semibold">{collection.batchId}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Collector ID</p>
                      <p className="text-white font-semibold">{collection.collectorId}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Species Name</p>
                      <p className="text-white font-semibold">{collection.speciesName}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Weight</p>
                      <p className="text-white font-semibold">{collection.weight}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Moisture</p>
                      <p className="text-white font-semibold">{collection.moisture}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Quality Grade</p>
                      <p className="text-white font-semibold">{collection.qualityGrade}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10 col-span-2">
                      <p className="text-gray-400 text-xs mb-1">GPS Coordinates</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary-400" />
                        <p className="text-white font-semibold">{collection.gpsCoordinates}</p>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">Accuracy: {collection.accuracy}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10 col-span-2">
                      <p className="text-gray-400 text-xs mb-1">Collection Time</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <p className="text-white font-semibold">{collection.collectionTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => showToast(`Viewing collection ${collection.id}`, 'info')}
                      className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    
                    {collection.status.toLowerCase() === 'queued' && (
                      <button
                        onClick={() => handleSyncCollection(collection)}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Sync
                      </button>
                    )}
                    
                    {collection.status.toLowerCase() === 'synced' && (
                      <button
                        onClick={() => handleMarkVerified(collection)}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-primary-500 hover:from-emerald-600 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </button>
                    )}
                  </div>

                  {/* Progress indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Collections Table */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-gray-500/20 to-slate-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">All Collections Database</h3>
              <p className="text-gray-400">Complete overview of farmer submissions and their processing status</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => showToast('Export functionality coming soon!', 'info')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button 
                onClick={() => showToast('Bulk actions coming soon!', 'info')}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Bulk Actions
              </button>
            </div>
          </div>
          
          {/* Enhanced Table */}
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Batch ID</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Collector</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Species</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Weight</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Moisture</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">GPS Coordinates</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Collection Time</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection, index) => (
                    <tr 
                      key={collection.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group cursor-pointer"
                      onClick={() => showToast(`Viewing details for ${collection.id}`, 'info')}
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-primary-400 font-semibold">{collection.batchId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium">{collection.collectorId}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-300">{collection.speciesName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-semibold">{collection.weight}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-semibold">{collection.moisture}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-400" />
                          <span className="text-gray-400 text-xs">{collection.gpsCoordinates}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          <span className="text-gray-400 text-xs">{collection.collectionTime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={collection.status} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Viewing ${collection.id}`, 'info');
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          {collection.status.toLowerCase() === 'queued' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSyncCollection(collection);
                              }}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-200"
                              title="Sync Collection"
                            >
                              <RefreshCw className="w-4 h-4 text-blue-400" />
                            </button>
                          )}
                          
                          {collection.status.toLowerCase() === 'synced' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkVerified(collection);
                              }}
                              className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-all duration-200"
                              title="Mark as Verified"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </button>
                          )}
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`More options for ${collection.id}`, 'info');
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                            title="More Options"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Table Footer */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Showing {collections.length} of {stats.total} total collections
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 text-sm transition-all duration-200">
                Previous
              </button>
              <button className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 text-sm transition-all duration-200">
                2
              </button>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 text-sm transition-all duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Submission Form */}
      <FarmerSubmissionForm
        isOpen={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
        showToast={showToast}
        onSubmissionSuccess={(newCollection) => {
          loadCollections(); // Reload to show the new submission
          showToast(`New collection ${newCollection.id} added successfully!`, 'success');
        }}
      />
    </div>
  );
};

export default Collections;
