import React, { useState, useEffect } from 'react';
import { 
  Plus, Package, Clock, CheckCircle, AlertCircle, Factory, TrendingUp,
  MapPin, Calendar, Scale, User, Activity, Zap, Target, RefreshCw,
  Filter, Download, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const ProcessorDashboard = ({ user, showToast }) => {
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
              <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
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
            change: '+12%',
            changeType: 'positive',
            icon: Package,
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Processing Steps',
            value: batches.reduce((acc, batch) => acc + (batch.processingSteps?.length || 0), 0),
            change: '+8%',
            changeType: 'positive',
            icon: Activity,
            gradient: 'from-emerald-500 to-primary-500'
          },
          {
            title: 'Completion Rate',
            value: '94.2%',
            change: '+3%',
            changeType: 'positive',
            icon: Target,
            gradient: 'from-indigo-500 to-blue-500'
          },
          {
            title: 'Efficiency Score',
            value: '87%',
            change: '+5%',
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

      {/* Enhanced Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {batches.map((batch, index) => (
          <div
            key={batch.id}
            className={`group transform transition-all duration-700 ${
              animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="relative h-full">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Main card */}
              <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{batch.herb}</h3>
                      <p className="text-gray-400 text-sm font-medium">{batch.id}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-2 rounded-xl border ${getStatusColor(batch.status)} flex items-center gap-2 shadow-lg`}>
                    {getStatusIcon(batch.status)}
                    <span className="text-sm font-semibold">{batch.status}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400 text-xs font-medium">Farmer</span>
                    </div>
                    <p className="text-white font-semibold text-sm">{batch.farmer}</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-gray-400 text-xs font-medium">Location</span>
                    </div>
                    <p className="text-white font-semibold text-sm">{batch.location}</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400 text-xs font-medium">Quantity</span>
                    </div>
                    <p className="text-white font-semibold text-sm">{batch.quantity}</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400 text-xs font-medium">Harvest</span>
                    </div>
                    <p className="text-white font-semibold text-sm">{new Date(batch.harvestDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Processing Steps */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-primary-400" />
                    <h4 className="text-white font-semibold">Processing Pipeline</h4>
                  </div>
                  <div className="space-y-3">
                    {batch.processingSteps?.slice(0, 3).map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className={`w-3 h-3 rounded-full shadow-lg ${
                          step.status === 'Completed' ? 'bg-emerald-400' : 
                          step.status === 'In Progress' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{step.step}</p>
                          <p className="text-gray-400 text-xs">{step.status}</p>
                        </div>
                      </div>
                    ))}
                    {batch.processingSteps?.length > 3 && (
                      <div className="text-center">
                        <span className="text-primary-400 text-sm font-medium">
                          +{batch.processingSteps.length - 3} more steps
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedBatch(batch);
                    setShowProcessingModal(true);
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Add Processing Step
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
