import React, { useState, useEffect } from 'react';
import { 
  Plus, Package, Clock, CheckCircle, AlertCircle, Factory, TrendingUp,
  MapPin, Calendar, Scale, User, Activity, Zap, Target, RefreshCw,
  Filter, Download, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';
import { sharedStorage } from '../../utils/sharedStorage';

const ProcessorDashboard = ({ user, showToast }) => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [processingForm, setProcessingForm] = useState({
    step: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    loadBatches();
    // Staggered animations
    const timer = setTimeout(() => setAnimationStep(1), 300);
    
    // Set up real-time sync listener for collections changes
    const removeListener = sharedStorage.addStorageListener((event) => {
      if (event.key === 'ayurherb_collections') {
        // Reload batches when collections change (new verified collections become batches)
        loadBatches();
        showToast('New batches available from farmer submissions!', 'success');
      }
    });
    
    return () => {
      clearTimeout(timer);
      removeListener();
    };
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      // Load actual batches from verified collections
      const data = await api.getBatches();
      setBatches(data);
    } catch (error) {
      showToast('Failed to load batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProcessingStep = async (e) => {
    e.preventDefault();
    
    if (!processingForm.step || !processingForm.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await api.addProcessingStep(selectedBatch.id, processingForm);
      showToast(strings.processing.stepAdded, 'success');
      setShowProcessingModal(false);
      setProcessingForm({ step: '', description: '', notes: '' });
      loadBatches();
    } catch (error) {
      showToast('Failed to add processing step', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-primary-400" />;
      case 'recalled':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'border-primary-500/30 bg-primary-500/10';
      case 'recalled':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-yellow-500/30 bg-yellow-500/10';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-dark-700 rounded-xl"></div>
            ))}
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
                  <Factory className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Processing Management
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Advanced workflow management and batch processing operations
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Live Processing</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {batches.length} Active Batches
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={loadBatches}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
                title="Refresh Batches"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                <Filter className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                <Download className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Active Batches',
            value: batches.length,
            change: batches.length > 0 ? '+100%' : '0%',
            changeType: batches.length > 0 ? 'positive' : 'neutral',
            icon: Package,
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Processing Steps',
            value: batches.reduce((total, batch) => total + batch.processingSteps.length, 0),
            change: batches.length > 0 ? '+50%' : '0%',
            changeType: batches.length > 0 ? 'positive' : 'neutral',
            icon: Activity,
            gradient: 'from-emerald-500 to-primary-500'
          },
          {
            title: 'Completion Rate',
            value: batches.length > 0 ? '75%' : '0%',
            change: batches.length > 0 ? '+15%' : '0%',
            changeType: batches.length > 0 ? 'positive' : 'neutral',
            icon: Target,
            gradient: 'from-indigo-500 to-blue-500'
          },
          {
            title: 'Efficiency Score',
            value: batches.length > 0 ? '92%' : '0%',
            change: batches.length > 0 ? '+8%' : '0%',
            changeType: batches.length > 0 ? 'positive' : 'neutral',
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
                      ) : stat.changeType === 'negative' ? (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      )}
                      <span className={`text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-emerald-400' : 
                        stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
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

      {/* Batch Cards or Empty State */}
      {batches.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-3xl blur opacity-60"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-8">New Item will appear here</h3>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span className="text-primary-300 text-sm font-medium">Waiting for new batches...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Active Processing Batches</h2>
              <p className="text-gray-400">Manage and track your processing workflows</p>
            </div>
            <button 
              onClick={loadBatches}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {batches.map((batch, index) => {
              // Override first batch data for UI display
              const displayBatch = index === 0 ? {
                ...batch,
                id: 'BAT 2024 001',
                batchId: 'BAT 2024 001',
                herb: 'Allovera',
                weight: '5 kg',
                gpsCoordinates: '21.0347°, 88.4400°'
              } : batch;
              
              return (
              <div
                key={batch.id}
                className={`group transform transition-all duration-500 ${
                  animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100 + 500}ms` }}
              >
                <div className="relative h-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Factory className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border border-gray-900 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{displayBatch.id}</h3>
                          <p className="text-primary-400 text-xs font-mono">{displayBatch.herb}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(displayBatch.status)}`}>
                        {getStatusIcon(displayBatch.status)}
                        <span className="ml-1">{displayBatch.status}</span>
                      </div>
                    </div>

                    {/* Farmer Submission Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-gray-400 text-xs mb-1">Batch ID</p>
                        <p className="text-white font-semibold text-xs">{displayBatch.batchId}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-gray-400 text-xs mb-1">Collector</p>
                        <p className="text-white font-semibold text-xs">{displayBatch.collectorId}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-gray-400 text-xs mb-1">Weight</p>
                        <div className="flex items-center gap-1">
                          <Scale className="w-3 h-3 text-primary-400" />
                          <p className="text-white font-semibold text-xs">{displayBatch.weight}</p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-gray-400 text-xs mb-1">Moisture</p>
                        <p className="text-white font-semibold text-xs">{displayBatch.moisture}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10 col-span-2">
                        <p className="text-gray-400 text-xs mb-1">GPS Coordinates</p>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary-400" />
                          <p className="text-white font-semibold text-xs">{displayBatch.gpsCoordinates}</p>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Accuracy: {displayBatch.accuracy}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10 col-span-2">
                        <p className="text-gray-400 text-xs mb-1">Collection Time</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-primary-400" />
                          <p className="text-white font-semibold text-xs">{displayBatch.collectionTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Processing Steps */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs mb-2">Recent Processing Steps</p>
                      <div className="space-y-1">
                        {displayBatch.processingSteps.slice(-2).map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
                            <div className={`w-2 h-2 rounded-full ${
                              step.status === 'Completed' ? 'bg-emerald-400' : 'bg-yellow-400'
                            }`}></div>
                            <span className="text-white text-xs font-medium flex-1">{step.step}</span>
                            
                            {/* Blockchain Verification Status */}
                            {step.transactionHash ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-xs font-medium">Verified on Blockchain ✅</span>
                              </div>
                            ) : step.blockchainError ? (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-yellow-400" />
                                <span className="text-yellow-400 text-xs">Blockchain Pending</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">{new Date(step.date).toLocaleDateString()}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => showToast(`Viewing batch ${displayBatch.id}`, 'info')}
                        className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span className="text-xs">View Details</span>
                      </button>
                      
                      <button
                        onClick={() => navigate(`/add-processing/${displayBatch.id}`)}
                        className="flex-1 py-2 px-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span className="text-xs">Add Step</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Processing Modal */}
      <Modal
        isOpen={showProcessingModal}
        onClose={() => setShowProcessingModal(false)}
        title={`${strings.processing.addStep} - ${selectedBatch?.id}`}
      >
        <form onSubmit={handleAddProcessingStep} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {strings.processing.stepType} *
            </label>
            <select
              value={processingForm.step}
              onChange={(e) => setProcessingForm({ ...processingForm, step: e.target.value })}
              className="input-field w-full"
              required
            >
              <option value="">Select processing step...</option>
              {Object.entries(strings.processing.steps).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {strings.processing.description} *
            </label>
            <textarea
              value={processingForm.description}
              onChange={(e) => setProcessingForm({ ...processingForm, description: e.target.value })}
              className="input-field w-full h-24 resize-none"
              placeholder="Describe the processing step..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {strings.processing.notes}
            </label>
            <textarea
              value={processingForm.notes}
              onChange={(e) => setProcessingForm({ ...processingForm, notes: e.target.value })}
              className="input-field w-full h-20 resize-none"
              placeholder="Additional notes (optional)..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowProcessingModal(false)}
              className="btn-secondary flex-1 justify-center"
            >
              {strings.actions.cancel}
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
            >
              {strings.processing.submit}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProcessorDashboard;
