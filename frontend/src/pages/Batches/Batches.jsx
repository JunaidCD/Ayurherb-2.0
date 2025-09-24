import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, User, Calendar, Package, Beaker, TestTube, 
  Plus, CheckCircle, XCircle, Clock, Microscope, FlaskConical,
  FileText, Download, Eye, Activity, Leaf, Factory, RefreshCw,
  Upload, X, Save, Hash, Shield, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const Batches = ({ user, showToast = console.log }) => {
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  
  // New test form state
  const [newTest, setNewTest] = useState({
    testType: '',
    resultValue: '',
    resultUnit: '',
    status: 'Passed',
    technician: user?.name || 'Dr. Sarah Wilson',
    notes: '',
    certificate: null
  });
  const [submittingTest, setSubmittingTest] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    console.log('Component mounted, loading data...');
    loadBatchDetails();
    loadTestResults();
  }, []);

  // Force render with data for testing
  useEffect(() => {
    if (!batch) {
      console.log('Force setting batch data...');
      const forceBatch = {
        id: 'COL001',
        batchId: 'BAT-2024-001',
        farmer: 'Rajesh Kumar',
        herb: 'Ashwagandha',
        quantity: '500kg',
        location: 'Kerala, India',
        gpsCoordinates: '10.8505°N, 76.2711°E',
        harvestDate: '2024-09-20',
        submissionDate: '2024-09-23',
        status: 'Verified',
        qualityScore: 94,
        qualityGrade: 'Premium (A+)',
        processingSteps: []
      };
      setBatch(forceBatch);
      setLoading(false);
    }
  }, [batch]);

  const loadBatchDetails = async () => {
    try {
      setLoading(true);
      console.log('Loading batch details...');
      
      // Always use mock data for demo
      const mockBatch = {
        id: 'COL001',
        batchId: 'BAT-2024-001',
        farmer: 'Rajesh Kumar',
        herb: 'Ashwagandha',
        quantity: '500kg',
        location: 'Kerala, India',
        gpsCoordinates: '10.8505°N, 76.2711°E',
        harvestDate: '2024-09-20',
        submissionDate: '2024-09-23',
        status: 'Verified',
        qualityScore: 94,
        qualityGrade: 'Premium (A+)',
        processingSteps: [
          {
            step: 'Drying',
            stepType: 'Drying',
            temperature: '60°C',
            duration: '24 hours',
            date: '2024-09-21',
            status: 'Completed',
            notes: 'Controlled temperature drying'
          },
          {
            step: 'Grinding',
            stepType: 'Grinding',
            temperature: 'Room temp',
            duration: '2 hours',
            date: '2024-09-22',
            status: 'Completed',
            notes: 'Fine powder consistency achieved'
          }
        ]
      };
      console.log('Setting batch data:', mockBatch);
      setBatch(mockBatch);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      console.log('Loading complete');
    }
  };

  const loadTestResults = () => {
    setTestResults([
      {
        id: 1,
        testType: 'Moisture Content',
        result: '8.5%',
        status: 'Passed',
        testDate: '2024-09-23',
        technician: 'Dr. Sarah Wilson',
        blockchainStatus: 'On-Chain Verified ✅',
        txId: '0x1a2b3c4d5e6f7890abcdef1234567890'
      },
      {
        id: 2,
        testType: 'Pesticide Screening',
        result: 'Not Detected',
        status: 'Passed',
        testDate: '2024-09-23',
        technician: 'Dr. Sarah Wilson',
        blockchainStatus: 'On-Chain Verified ✅',
        txId: '0x2b3c4d5e6f7890abcdef1234567890ab'
      },
      {
        id: 3,
        testType: 'DNA Authentication',
        result: 'Confirmed',
        status: 'Passed',
        testDate: '2024-09-22',
        technician: 'Dr. Mike Chen',
        blockchainStatus: 'On-Chain Verified ✅',
        txId: '0x3c4d5e6f7890abcdef1234567890abcd'
      },
      {
        id: 4,
        testType: 'Heavy Metals',
        result: 'Pending',
        status: 'In Progress',
        testDate: '2024-09-24',
        technician: 'Dr. Sarah Wilson',
        blockchainStatus: 'Pending Verification',
        txId: null
      }
    ]);
  };

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
        batchId: batch.id,
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
        resultUnit: '',
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

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Passed</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">Failed</span>
          </div>
        );
      case 'in progress':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">In Progress</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm font-medium">Pending</span>
          </div>
        );
    }
  };

  console.log('Render - Loading:', loading, 'Batch:', batch);

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  if (!batch) {
    console.log('No batch data - showing empty state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Beaker className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No batch data available</p>
          <button 
            onClick={loadBatchDetails}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering main content with batch:', batch.id);

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
                  Batch Details
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  {batch.id} • {batch.herb} • Lab Testing View
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                    <TestTube className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">Lab Analysis</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={loadBatchDetails}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => navigate(`/add-processing/${batch?.id || 'COL001'}`)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Factory className="w-5 h-5" />
                Add Processing
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Batch Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Farmer & Batch Info */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">Farmer & Batch Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Farmer</p>
                      <p className="text-white font-semibold">{batch.farmer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Species</p>
                      <p className="text-white font-semibold">{batch.herb}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">GPS Location</p>
                      <p className="text-white font-semibold">{batch.gpsCoordinates || batch.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Harvest Date</p>
                      <p className="text-white font-semibold">{new Date(batch.harvestDate || batch.submissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Quantity</p>
                      <p className="text-white font-semibold">{batch.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Quality Grade</p>
                      <p className="text-white font-semibold">{batch.qualityGrade || 'Standard (A)'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Factory className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Processing Steps</h2>
              </div>
              
              <div className="space-y-4">
                {batch.processingSteps && batch.processingSteps.length > 0 ? (
                  batch.processingSteps.map((step, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{step.step || step.stepType}</h4>
                        <span className="text-emerald-400 text-sm">{step.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                        {step.temperature && (
                          <div>Temperature: {step.temperature}</div>
                        )}
                        {step.duration && (
                          <div>Duration: {step.duration}</div>
                        )}
                        <div>Date: {step.date}</div>
                        {step.notes && (
                          <div className="col-span-2">Notes: {step.notes}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Factory className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No processing steps recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Microscope className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Test Results</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                    <TestTube className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm font-medium">{testResults.length} Tests</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Test Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Result</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Blockchain</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Technician</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {testResults.map((test) => (
                      <tr key={test.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Beaker className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-medium">{test.testType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{test.result}</td>
                        <td className="px-6 py-4">{getStatusBadge(test.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {test.blockchainStatus === 'On-Chain Verified ✅' ? (
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 text-sm font-medium">Verified</span>
                                {test.txId && (
                                  <button 
                                    onClick={() => showToast(`Transaction ID: ${test.txId}`, 'info')}
                                    className="text-blue-400 hover:text-blue-300 text-xs"
                                    title={`TX: ${test.txId}`}
                                  >
                                    <Hash className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 text-sm">Pending</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{new Date(test.testDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-gray-300">{test.technician}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-200">
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>
                            <button className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg transition-all duration-200">
                              <Download className="w-4 h-4 text-emerald-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/add-processing/${batch?.id || 'COL001'}`)}
                  className="w-full p-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-3"
                >
                  <Factory className="w-5 h-5" />
                  Add Processing
                </button>
                
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Batch Summary */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Batch Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Tests</span>
                  <span className="text-white font-semibold">{testResults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Passed</span>
                  <span className="text-emerald-400 font-semibold">{testResults.filter(t => t.status === 'Passed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality Score</span>
                  <span className="text-white font-semibold">{batch.qualityScore || 94}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Quality Test Modal */}
      {showAddTestModal && (
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
                    <p className="text-gray-400">Batch: {batch?.id} • {batch?.herb}</p>
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

export default Batches;
