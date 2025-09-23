import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, ArrowLeft, Thermometer, Clock, FileText, 
  Settings, CheckCircle, AlertCircle, Package, Factory,
  Zap, Sparkles, Star, Flame, Droplets, Wind, Sun, Target
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';

const AddProcessingAdvanced = ({ user, showToast }) => {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingForm, setProcessingForm] = useState({
    stepType: '',
    temperature: '',
    duration: '',
    notes: ''
  });

  const stepTypes = [
    { 
      value: 'Drying', 
      label: 'Drying Process', 
      icon: Flame, 
      emoji: '🔥',
      color: 'from-orange-400 via-red-500 to-pink-500', 
      bgColor: 'bg-gradient-to-br from-orange-500/30 to-red-500/20', 
      borderColor: 'border-orange-400/60',
      description: 'Remove moisture content',
      particles: '🌡️💨'
    },
    { 
      value: 'Grinding', 
      label: 'Grinding & Milling', 
      icon: Settings, 
      emoji: '⚙️',
      color: 'from-blue-400 via-indigo-500 to-purple-500', 
      bgColor: 'bg-gradient-to-br from-blue-500/30 to-indigo-500/20', 
      borderColor: 'border-blue-400/60',
      description: 'Mechanical processing',
      particles: '⚡🔧'
    },
    { 
      value: 'Storage', 
      label: 'Storage & Preservation', 
      icon: Package, 
      emoji: '📦',
      color: 'from-purple-400 via-pink-500 to-rose-500', 
      bgColor: 'bg-gradient-to-br from-purple-500/30 to-pink-500/20', 
      borderColor: 'border-purple-400/60',
      description: 'Safe storage conditions',
      particles: '🏪❄️'
    },
    { 
      value: 'Quality Check', 
      label: 'Quality Assurance', 
      icon: Star, 
      emoji: '🔍',
      color: 'from-emerald-400 via-teal-500 to-cyan-500', 
      bgColor: 'bg-gradient-to-br from-emerald-500/30 to-teal-500/20', 
      borderColor: 'border-emerald-400/60',
      description: 'Quality verification',
      particles: '✨🎯'
    },
    { 
      value: 'Packaging', 
      label: 'Final Packaging', 
      icon: Package, 
      emoji: '📦',
      color: 'from-yellow-400 via-amber-500 to-orange-500', 
      bgColor: 'bg-gradient-to-br from-yellow-500/30 to-amber-500/20', 
      borderColor: 'border-yellow-400/60',
      description: 'Product packaging',
      particles: '📦🎁'
    },
    { 
      value: 'Cleaning', 
      label: 'Cleaning & Sanitization', 
      icon: Droplets, 
      emoji: '🧽',
      color: 'from-cyan-400 via-blue-500 to-teal-500', 
      bgColor: 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20', 
      borderColor: 'border-cyan-400/60',
      description: 'Cleaning procedures',
      particles: '💧✨'
    }
  ];

  useEffect(() => {
    if (batchId) {
      loadBatch();
    } else {
      setLoading(false);
    }
  }, [batchId]);

  const loadBatch = async () => {
    try {
      setLoading(true);
      const batchData = await api.getBatchById(batchId);
      setBatch(batchData);
    } catch (error) {
      showToast('Failed to load batch details', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProcessingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!processingForm.stepType || !processingForm.duration) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSaving(true);
      
      const processingStep = {
        step: processingForm.stepType,
        temperature: processingForm.temperature,
        duration: processingForm.duration,
        notes: processingForm.notes,
        description: `${processingForm.stepType} process completed`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleString(),
        status: 'Completed'
      };

      if (batchId) {
        await api.addProcessingStep(batchId, processingStep);
        showToast(`Processing step added to batch ${batchId}`, 'success');
      } else {
        showToast('Processing step recorded successfully', 'success');
      }
      
      // Reset form
      setProcessingForm({
        stepType: '',
        temperature: '',
        duration: '',
        notes: ''
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      showToast('Failed to save processing step: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          <div className="absolute inset-4 w-24 h-24 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Clean Header */}
        <div className="relative">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-6">
              {/* Simple Back Button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              {/* Simple Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              
              {/* Clean Typography */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                  Add Processing Step
                </h1>
                <p className="text-lg text-gray-300">
                  {batch ? (
                    <span>Record processing step for batch {batch.id}</span>
                  ) : (
                    <span>Record new processing step</span>
                  )}
                </p>
                
                {/* Simple Status */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-300 text-sm">Ready</span>
                  </div>
                  
                  {batch && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Package className="w-4 h-4" />
                      <span>{batch.herb} • {batch.weight}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Form */}
        <div className="relative">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
            
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Step Type Selection */}
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Select Processing Step
                    </h2>
                  </div>
                  <p className="text-gray-400">
                    Choose the type of processing operation to perform
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stepTypes.map((type, index) => {
                    const IconComponent = type.icon;
                    const isSelected = processingForm.stepType === type.value;
                    
                    return (
                      <div
                        key={type.value}
                        className="group"
                      >
                        <button
                          type="button"
                          onClick={() => setProcessingForm(prev => ({ ...prev, stepType: type.value }))}
                          className={`relative w-full p-6 rounded-2xl border transition-all duration-300 ${
                            isSelected
                              ? `${type.bgColor} ${type.borderColor} shadow-lg`
                              : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50 hover:shadow-md'
                          }`}
                        >
                          
                          {/* Icon Container */}
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-r ${type.color}`
                              : 'bg-slate-600/50 group-hover:bg-slate-500/50'
                          }`}>
                            <IconComponent className={`w-8 h-8 transition-colors duration-300 ${
                              isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            }`} />
                          </div>
                          
                          {/* Content */}
                          <div className="text-center space-y-2">
                            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                              isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                            }`}>
                              {type.label}
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${
                              isSelected ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'
                            }`}>
                              {type.description}
                            </p>
                          </div>
                          
                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-3 right-3">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              </div>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Parameters */}
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-white">
                    Processing Parameters
                  </h3>
                  <p className="text-gray-400">Configure the settings for your operation</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Temperature */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      Temperature
                    </label>
                    <div className="relative">
                      <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                      <input
                        type="text"
                        name="temperature"
                        value={processingForm.temperature}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                        placeholder="e.g., 60°C, Room temp, N/A"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Duration *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        name="duration"
                        value={processingForm.duration}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        placeholder="e.g., 2 hours, 30 minutes, 1 day"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white">
                    Additional Notes
                  </h3>
                  <p className="text-gray-400">Document important details and observations</p>
                </div>
                
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
                  <textarea
                    name="notes"
                    value={processingForm.notes}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none transition-all duration-200"
                    placeholder="Add any additional notes about this processing step...

• Equipment used and settings
• Quality observations  
• Environmental conditions
• Special handling requirements"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving || !processingForm.stepType || !processingForm.duration}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Processing Step
                    </>
                  )}
                </button>
              </div>
              
              {/* Simple Progress */}
              <div className="flex items-center justify-center gap-2 pt-4">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  processingForm.stepType ? 'bg-emerald-500' : 'bg-gray-600'
                }`}></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  processingForm.duration ? 'bg-emerald-500' : 'bg-gray-600'
                }`}></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  processingForm.notes ? 'bg-emerald-500' : 'bg-gray-600'
                }`}></div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">
                {processingForm.stepType && processingForm.duration ? '✅ Ready to save' : '⏳ Fill required fields'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProcessingAdvanced;
