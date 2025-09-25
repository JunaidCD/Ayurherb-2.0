import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Eye, CheckCircle, Clock, Database, User, MapPin, Calendar,
  Download, Filter, Search, MoreHorizontal, ArrowUpRight,
  TrendingUp, ArrowDownRight, Zap, Target, Award, Activity,
  Thermometer, Timer, FileText, Shield, Beaker, Copy, ChevronDown
} from 'lucide-react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import DataTable from '../../components/UI/DataTable';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';
import { sharedStorage } from '../../utils/sharedStorage';

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
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showProcessingOptions, setShowProcessingOptions] = useState(false);
  const [showLabOptions, setShowLabOptions] = useState(false);

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
        total: 1, // Override to show 1 instead of actual data length
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

  const handleDownload = (dataType, format) => {
    // Close all dropdowns
    setShowDownloadDropdown(false);
    setShowProcessingOptions(false);
    setShowLabOptions(false);
    
    // Generate data based on type
    let data, filename;
    
    if (dataType === 'processing') {
      data = {
        batchId: 'BAT 2024 001',
        herbType: 'Allovera',
        processType: 'Drying Process',
        temperature: '20°C',
        duration: '2 hrs',
        status: 'Good condition',
        quantity: '5 kg',
        quality: 'Premium (AA)',
        date: '2025-09-24',
        progress: '100%'
      };
      filename = `processing-data-BAT2024001.${format}`;
    } else {
      data = {
        batchId: 'BAT 2024 001',
        testType: 'Pesticide Screening',
        result: '2ppm',
        status: 'Passed',
        technician: 'Junaid',
        herbType: 'Allovera',
        date: '9/25/2025',
        blockchainTx: '0x8bf3c3a9914b...'
      };
      filename = `lab-test-data-BAT2024001.${format}`;
    }
    
    if (format === 'csv') {
      downloadAsCSV(data, filename);
    } else {
      downloadAsPDF(data, filename, dataType);
    }
    
    showToast(`${dataType === 'processing' ? 'Processing' : 'Lab test'} data downloaded as ${format.toUpperCase()}`, 'success');
  };
  
  const downloadAsCSV = (data, filename) => {
    const headers = Object.keys(data).join(',');
    const values = Object.values(data).join(',');
    const csvContent = `${headers}\n${values}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadAsPDF = (data, filename, dataType) => {
    // Create a simple HTML content for PDF
    const htmlContent = `
      <html>
        <head>
          <title>${dataType === 'processing' ? 'Processing Data' : 'Lab Test Data'} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .data-table th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${dataType === 'processing' ? 'Processing Data' : 'Lab Test Data'} Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table class="data-table">
            ${Object.entries(data).map(([key, value]) => 
              `<tr><th>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</th><td>${value}</td></tr>`
            ).join('')}
          </table>
        </body>
      </html>
    `;
    
    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.pdf', '.html')); // Browser will save as HTML
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* Processing & Lab Testing Details Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-blue-300 bg-clip-text text-transparent">
                    BAT 2024 001
                  </h2>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('BAT 2024 001');
                      showToast('Batch ID copied to clipboard!', 'success');
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 group"
                    title="Copy Batch ID"
                  >
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </button>
                </div>
                <p className="text-gray-300 font-medium">Allovera Processing & Lab Results</p>
              </div>
            </div>
            {/* Download Data Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-emerald-300 font-medium transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Data
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDownloadDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showDownloadDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-50">
                  <div className="p-2">
                    {/* Processing Data Option */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowProcessingOptions(!showProcessingOptions);
                          setShowLabOptions(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-left text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Thermometer className="w-4 h-4 text-orange-400" />
                          <span>Processing Data</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProcessingOptions ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Processing Sub-options */}
                      {showProcessingOptions && (
                        <div className="ml-4 mt-1 space-y-1">
                          <button
                            onClick={() => handleDownload('processing', 'pdf')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all duration-200"
                          >
                            <FileText className="w-3 h-3" />
                            Download as PDF
                          </button>
                          <button
                            onClick={() => handleDownload('processing', 'csv')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all duration-200"
                          >
                            <Database className="w-3 h-3" />
                            Download as CSV
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Lab Test Data Option */}
                    <div className="relative mt-1">
                      <button
                        onClick={() => {
                          setShowLabOptions(!showLabOptions);
                          setShowProcessingOptions(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-left text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Beaker className="w-4 h-4 text-purple-400" />
                          <span>Lab Test Data</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLabOptions ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Lab Test Sub-options */}
                      {showLabOptions && (
                        <div className="ml-4 mt-1 space-y-1">
                          <button
                            onClick={() => handleDownload('lab', 'pdf')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all duration-200"
                          >
                            <FileText className="w-3 h-3" />
                            Download as PDF
                          </button>
                          <button
                            onClick={() => handleDownload('lab', 'csv')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all duration-200"
                          >
                            <Database className="w-3 h-3" />
                            Download as CSV
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Processing Step Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Drying Process</h3>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">Progress</span>
                  <span className="text-emerald-400 font-bold text-lg">100%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000"></div>
                </div>
                <div className="text-right mt-1">
                  <span className="text-emerald-400 text-sm font-medium">Complete</span>
                </div>
              </div>

              {/* Processing Details Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 text-center">
                  <Thermometer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-orange-300 text-sm font-medium mb-1">Temp</div>
                  <div className="text-white text-lg font-bold">20°C</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
                  <Timer className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-blue-300 text-sm font-medium mb-1">Duration</div>
                  <div className="text-white text-lg font-bold">2 hrs</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-emerald-300 text-sm font-medium mb-1">Status</div>
                  <div className="text-white text-sm font-bold">Good condition</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Quantity</div>
                  <div className="text-white font-semibold">5 kg</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Quality</div>
                  <div className="text-white font-semibold">Premium (AA)</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Date</div>
                  <div className="text-white font-semibold">2025-09-24</div>
                </div>
              </div>
            </div>

            {/* Lab Testing Results */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Lab Testing Results</h3>
              </div>

              {/* Lab Results Card */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">BAT 2024 001</h4>
                      <p className="text-gray-400 text-sm">Pesticide Screening</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Result:</span>
                    <span className="text-white font-semibold">2ppm</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Passed
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Technician:</span>
                    <span className="text-white font-semibold">Junaid</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Herb Type:</span>
                    <span className="text-white font-semibold">Allovera</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-white font-semibold">9/25/2025</span>
                  </div>
                </div>

                {/* Blockchain Verification */}
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 font-medium">Verified on Blockchain</span>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('0x8bf3c3a9914b...');
                        showToast('Transaction hash copied to clipboard', 'success');
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="text-sm font-mono">Tx: 0x8bf3c3a9914b...</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Collections;
