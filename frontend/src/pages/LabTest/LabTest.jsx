import React, { useState, useEffect } from 'react';
import { 
  TestTube, Beaker, FlaskConical, Microscope, Upload, Save, 
  CheckCircle, XCircle, Clock, Hash, Shield, Eye, Download,
  Plus, RefreshCw, AlertCircle, FileText, Activity
} from 'lucide-react';
import { api } from '../../utils/api';

const LabTest = ({ user, showToast = console.log }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Test form state
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

  useEffect(() => {
    loadBatches();
    loadTestResults();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      
      // Mock batches for testing
      const mockBatches = [
        {
          id: 'COL001',
          batchId: 'BAT-2024-001',
          farmer: 'Rajesh Kumar',
          herb: 'Ashwagandha',
          quantity: '500kg',
          location: 'Kerala, India',
          harvestDate: '2024-09-20',
          status: 'Ready for Testing'
        },
        {
          id: 'COL002',
          batchId: 'BAT-2024-002',
          farmer: 'Priya Sharma',
          herb: 'Turmeric',
          quantity: '750kg',
          location: 'Tamil Nadu, India',
          harvestDate: '2024-09-21',
          status: 'Ready for Testing'
        },
        {
          id: 'COL003',
          batchId: 'BAT-2024-003',
          farmer: 'Amit Patel',
          herb: 'Brahmi',
          quantity: '300kg',
          location: 'Gujarat, India',
          harvestDate: '2024-09-19',
          status: 'Testing Complete'
        }
      ];
      
      setBatches(mockBatches);
      if (!selectedBatch && mockBatches.length > 0) {
        setSelectedBatch(mockBatches[0]);
      }
      
    } catch (error) {
      console.error('Error loading batches:', error);
      showToast('Failed to load batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTestResults = () => {
    const mockResults = [
      {
        id: 1,
        batchId: 'COL001',
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
        batchId: 'COL002',
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
        batchId: 'COL003',
        testType: 'DNA Authentication',
        result: 'Confirmed',
        status: 'Passed',
        testDate: '2024-09-22',
        technician: 'Dr. Mike Chen',
        blockchainStatus: 'On-Chain Verified ✅',
        txId: '0x3c4d5e6f7890abcdef1234567890abcd'
      }
    ];
    setTestResults(mockResults);
  };

  // Test type configurations
  const testTypes = [
    { 
      value: 'moisture', 
      label: 'Moisture Content', 
      unit: '%', 
      icon: '💧',
      description: 'Water content analysis',
      normalRange: '5-12%'
    },
    { 
      value: 'pesticide', 
      label: 'Pesticide Screening', 
      unit: 'ppm', 
      icon: '🧪',
      description: 'Chemical residue detection',
      normalRange: '<0.01 ppm'
    },
    { 
      value: 'dna', 
      label: 'DNA Barcode', 
      unit: '', 
      icon: '🧬',
      description: 'Species authentication',
      normalRange: 'Match confirmed'
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
      if (!selectedBatch) {
        showToast('Please select a batch first', 'error');
        return;
      }
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
        result: `${newTest.resultValue}${selectedTestType.unit}`,
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
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">Pending</span>
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
                  Lab Test Center
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Quality testing with blockchain verification
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Lab Active</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testResults.length} Tests Completed
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Batch Selection */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Beaker className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Select Batch for Testing</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map((batch) => (
                  <button
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedBatch?.id === batch.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <TestTube className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-semibold">{batch.herb}</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>ID: {batch.id}</p>
                      <p>Farmer: {batch.farmer}</p>
                      <p>Quantity: {batch.quantity}</p>
                      <p>Location: {batch.location}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Form */}
          {selectedBatch && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Microscope className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">Add Quality Test</h2>
                  <div className="text-gray-400">for {selectedBatch.herb} ({selectedBatch.id})</div>
                </div>
                
                <div className="space-y-6">
                  {/* Test Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Test Type <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                          <p className="text-blue-400 text-xs mt-1">Normal: {type.normalRange}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result Value & Status */}
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

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitTest}
                    disabled={submittingTest || !newTest.testType || !newTest.resultValue}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingTest ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Test & Verify on Blockchain
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Results Sidebar */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Recent Test Results</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <TestTube className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No test results yet</p>
                  </div>
                ) : (
                  testResults.map((test) => (
                    <div key={test.id} className="bg-slate-800/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <TestTube className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">{test.testType}</span>
                        </div>
                        {getStatusBadge(test.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>Batch: {test.batchId}</div>
                        <div>Result: {test.result}</div>
                        <div>Date: {test.testDate}</div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">On-Chain Verified ✅</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400 text-xs">{test.txId?.substr(0, 10)}...</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTest;
