import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Beaker, TestTube, CheckCircle, XCircle, Clock,
  TrendingUp, Activity, AlertCircle, FlaskConical, Microscope,
  RefreshCw, Calendar, User, Package, Plus, Upload, X, Save, 
  Hash, Shield, Eye, Download, Thermometer, Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const LabDashboard = ({ user, showToast = console.log }) => {
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

  // Add Quality Test Modal State
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [newTest, setNewTest] = useState({
    testType: '',
    resultValue: '',
    status: 'Passed',
    technician: user?.name || 'Dr. Sarah Wilson',
    notes: '',
    certificate: null
  });
  const [submittingTest, setSubmittingTest] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    console.log('Lab Dashboard mounted, loading data...');
    loadBatches();
    loadRecentActivity();
  }, []);

  // No force loading - keep batches empty

  const loadBatches = async () => {
    try {
      setLoading(true);
      
      // Sample batch data for testing
      const mockBatches = [
        {
          id: 'BAT 2024 001',
          batchId: 'BAT 2024 001',
          herb: 'Allovera',
          farmer: 'COL 2024',
          quantity: '5 kg',
          location: 'Bangalore, Karnataka',
          progress: 100,
          customProcessingSteps: [
            {
              stepType: 'Drying Process',
              temperature: 20,
              duration: '2 hrs',
              notes: 'Good condition',
              status: 'Completed',
              date: '2025-09-24'
            }
          ]
        }
      ];
      
      setBatches(mockBatches);
      calculateStats(mockBatches);
      
    } catch (error) {
      console.error('Error loading batches:', error);
      showToast('Using demo data - Backend not connected', 'info');
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

  // Test type configurations
  const testTypes = [
    { 
      value: 'moisture', 
      label: 'Moisture Content', 
      unit: '%', 
      icon: '💧',
      description: 'Water content analysis'
    },
    { 
      value: 'pesticide', 
      label: 'Pesticide Screening', 
      unit: 'ppm', 
      icon: '🧪',
      description: 'Chemical residue detection'
    },
    { 
      value: 'dna', 
      label: 'DNA Barcode', 
      unit: '', 
      icon: '🧬',
      description: 'Species authentication'
    },
    { 
      value: 'heavy_metals', 
      label: 'Heavy Metals', 
      unit: 'ppm', 
      icon: '⚗️',
      description: 'Toxic metal analysis'
    },
    { 
      value: 'microbial', 
      label: 'Microbial Testing', 
      unit: 'CFU/g', 
      icon: '🦠',
      description: 'Pathogen detection'
    }
  ];

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Please upload PDF or image files only', 'error');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }

      setNewTest(prev => ({ ...prev, certificate: file }));
      showToast('Certificate uploaded successfully', 'success');
    }
  };

  // Submit new test
  const handleSubmitTest = async () => {
    try {
      // Validation
      if (!newTest.testType || !newTest.resultValue) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      setSubmittingTest(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Get selected test type details
      const selectedTestType = testTypes.find(t => t.value === newTest.testType);
      
      // Create test data
      const testData = {
        batchId: selectedBatch.id,
        testType: selectedTestType.label,
        result: `${newTest.resultValue}${selectedTestType.unit ? selectedTestType.unit : ''}`,
        status: newTest.status,
        technician: newTest.technician,
        notes: newTest.notes,
        testDate: new Date().toISOString(),
        certificate: newTest.certificate
      };

      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate blockchain transaction
      const mockTxId = `0x${Math.random().toString(16).substr(2, 32)}`;
      
      setUploadProgress(100);

      // Add to test results
      const newTestResult = {
        id: testResults.length + 1,
        batchId: selectedBatch.id,
        testType: selectedTestType.label,
        result: testData.result,
        status: newTest.status,
        testDate: new Date().toLocaleDateString(),
        technician: newTest.technician,
        blockchainStatus: 'On-Chain Verified ✅',
        txId: mockTxId,
        notes: newTest.notes
      };

      setTestResults(prev => [...prev, newTestResult]);
      
      // Reset form
      setNewTest({
        testType: '',
        resultValue: '',
        status: 'Passed',
        technician: user?.name || 'Dr. Sarah Wilson',
        notes: '',
        certificate: null
      });
      
      setShowAddTestModal(false);
      showToast(`Test added successfully! Blockchain TX: ${mockTxId.substr(0, 10)}...`, 'success');

    } catch (error) {
      showToast('Failed to add test: ' + error.message, 'error');
    } finally {
      setSubmittingTest(false);
      setUploadProgress(0);
    }
  };

  // Open Add Test Modal
  const openAddTestModal = (batch) => {
    setSelectedBatch(batch);
    setShowAddTestModal(true);
  };

  // Copy batch ID to clipboard
  const copyBatchId = async (batchId) => {
    try {
      await navigator.clipboard.writeText(batchId);
      showToast(`Batch ID "${batchId}" copied to clipboard`, 'success');
    } catch (err) {
      console.error('Failed to copy batch ID:', err);
      showToast('Failed to copy batch ID', 'error');
    }
  };

  // Batch Card Component (from Processor Batches page)
  const BatchCard = ({ batch }) => {
    return (
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-4 hover:border-slate-500/70 transition-all duration-300 shadow-lg">
        {/* Header with icon and batch info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{batch.batchId}</h3>
              <button
                onClick={() => copyBatchId(batch.batchId)}
                className="p-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded-lg transition-all duration-200 group"
                title="Copy Batch ID"
              >
                <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
              </button>
            </div>
            <p className="text-sm text-slate-400">{batch.herb}</p>
          </div>
        </div>

        {/* Progress section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-white">{batch.progress}%</span>
            <span className="text-sm text-slate-400">Complete</span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${batch.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Processing step info */}
        {batch.customProcessingSteps && batch.customProcessingSteps.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                {batch.customProcessingSteps[batch.customProcessingSteps.length - 1].stepType}
              </span>
            </div>
            
            {/* Three metric boxes */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-orange-500/20 rounded-lg p-3 text-center border border-orange-500/30">
                <Thermometer className="w-4 h-4 text-orange-300 mx-auto mb-1" />
                <div className="text-xs text-orange-200 mb-1">Temp</div>
                <div className="text-sm font-bold text-white">
                  {batch.customProcessingSteps[batch.customProcessingSteps.length - 1].temperature}°C
                </div>
              </div>
              
              <div className="bg-blue-500/20 rounded-lg p-3 text-center border border-blue-500/30">
                <Clock className="w-4 h-4 text-blue-300 mx-auto mb-1" />
                <div className="text-xs text-blue-200 mb-1">Duration</div>
                <div className="text-sm font-bold text-white">
                  {batch.customProcessingSteps[batch.customProcessingSteps.length - 1].duration}
                </div>
              </div>
              
              <div className="bg-emerald-500/20 rounded-lg p-3 text-center border border-emerald-500/30">
                <CheckCircle className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
                <div className="text-xs text-emerald-200 mb-1">Status</div>
                <div className="text-xs font-bold text-emerald-300">
                  Good condition
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom info grid */}
        <div className="grid grid-cols-3 gap-3 text-xs border-t border-slate-600/50 pt-3">
          <div>
            <div className="text-slate-400 mb-1">Quantity</div>
            <div className="font-semibold text-white">{batch.quantity}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Quality</div>
            <div className="font-semibold text-white">Premium (AA)</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Date</div>
            <div className="font-semibold text-white">2025-09-24</div>
          </div>
        </div>
      </div>
    );
  };

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
                    <p className="text-gray-400 text-lg">New Item for Testing will appear here</p>
                  </div>
                ) : (
                  <div className="max-w-md">
                    {filteredBatches.map((batch) => (
                      <div key={batch.id} className="mb-4">
                        <BatchCard batch={batch} />
                      </div>
                    ))}
                  </div>
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

      {/* Add Quality Test Modal */}
      {showAddTestModal && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-blue-500/50 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-8">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Add Quality Test</h3>
                    <p className="text-gray-400">Batch: {selectedBatch.id} • {selectedBatch.herb}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddTestModal(false)}
                  className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                
                {/* Test Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Test Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {testTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setNewTest(prev => ({ ...prev, testType: type.value }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          newTest.testType === type.value
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="text-white font-semibold">{type.label}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{type.description}</p>
                        {type.unit && (
                          <p className="text-blue-400 text-xs mt-1">Unit: {type.unit}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Result Value <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newTest.resultValue}
                        onChange={(e) => setNewTest(prev => ({ ...prev, resultValue: e.target.value }))}
                        placeholder="Enter result value"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-200"
                      />
                      {newTest.testType && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          {testTypes.find(t => t.value === newTest.testType)?.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pass/Fail Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Test Status
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setNewTest(prev => ({ ...prev, status: 'Passed' }))}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                          newTest.status === 'Passed'
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                            : 'border-slate-600 bg-slate-700/30 text-gray-400 hover:border-slate-500'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Pass
                      </button>
                      <button
                        onClick={() => setNewTest(prev => ({ ...prev, status: 'Failed' }))}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                          newTest.status === 'Failed'
                            ? 'border-red-500 bg-red-500/20 text-red-300'
                            : 'border-slate-600 bg-slate-700/30 text-gray-400 hover:border-slate-500'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Fail
                      </button>
                    </div>
                  </div>
                </div>

                {/* Technician */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technician
                  </label>
                  <input
                    type="text"
                    value={newTest.technician}
                    onChange={(e) => setNewTest(prev => ({ ...prev, technician: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Certificate Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Test Certificate (PDF/Image)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="certificate-upload"
                    />
                    <label
                      htmlFor="certificate-upload"
                      className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-emerald-500 transition-all duration-200 bg-slate-700/20"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        {newTest.certificate ? (
                          <div>
                            <p className="text-emerald-400 font-medium">{newTest.certificate.name}</p>
                            <p className="text-gray-400 text-sm">
                              {(newTest.certificate.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-300">Click to upload certificate</p>
                            <p className="text-gray-400 text-sm">PDF, JPG, PNG up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newTest.notes}
                    onChange={(e) => setNewTest(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the test..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-200 resize-none"
                  />
                </div>

                {/* Progress Bar */}
                {submittingTest && (
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <TestTube className="w-5 h-5 text-blue-400 animate-pulse" />
                      <span className="text-white font-medium">Processing Test & Blockchain Verification...</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{uploadProgress}% Complete</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAddTestModal(false)}
                  disabled={submittingTest}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTest}
                  disabled={submittingTest || !newTest.testType || !newTest.resultValue}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingTest ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Add Test & Verify on Blockchain
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;
