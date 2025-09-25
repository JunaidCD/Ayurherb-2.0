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
