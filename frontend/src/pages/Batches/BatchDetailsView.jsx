import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, User, Calendar, Package, Beaker, TestTube, 
  Plus, CheckCircle, XCircle, Clock, Microscope, FlaskConical,
  FileText, Download, Eye, Activity, Leaf, Factory, RefreshCw
} from 'lucide-react';
import { api } from '../../utils/api';

const Batches = ({ user, showToast }) => {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);
  const [showAddTestModal, setShowAddTestModal] = useState(false);

  useEffect(() => {
    loadBatchDetails();
    loadTestResults();
  }, []);

  const loadBatchDetails = async () => {
    try {
      setLoading(true);
      // Get the first batch as example
      const batches = await api.getBatches();
      if (batches.length > 0) {
        setBatch(batches[0]);
      }
    } catch (error) {
      showToast('Failed to load batch details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTestResults = () => {
    // Mock test results data
    setTestResults([
      {
        id: 1,
        testType: 'Moisture Content',
        result: '8.5%',
        status: 'Passed',
        testDate: '2024-09-23',
        technician: 'Dr. Sarah Wilson',
        method: 'Gravimetric Analysis',
        notes: 'Within acceptable range'
      },
      {
        id: 2,
        testType: 'Pesticide Screening',
        result: 'Not Detected',
        status: 'Passed',
        testDate: '2024-09-23',
        technician: 'Dr. Sarah Wilson',
        method: 'LC-MS/MS',
        notes: 'All compounds below detection limit'
      },
      {
        id: 3,
        testType: 'DNA Authentication',
        result: 'Confirmed',
        status: 'Passed',
        testDate: '2024-09-22',
        technician: 'Dr. Mike Chen',
        method: 'PCR Analysis',
        notes: 'Species identity verified'
      },
      {
        id: 4,
        testType: 'Heavy Metals',
        result: 'Pending',
        status: 'In Progress',
        testDate: '2024-09-24',
        technician: 'Dr. Sarah Wilson',
        method: 'ICP-MS',
        notes: 'Analysis in progress'
      }
    ]);
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

  if (!batch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Beaker className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Batch not found</p>
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
                onClick={() => setShowAddTestModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add New Test
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
                  onClick={() => setShowAddTestModal(true)}
                  className="w-full p-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  Add New Test
                </button>
                
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Generate Report
                </button>
                
                <button className="w-full p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  Export Data
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
                  <span className="text-gray-400">In Progress</span>
                  <span className="text-yellow-400 font-semibold">{testResults.filter(t => t.status === 'In Progress').length}</span>
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

      {/* Add Test Modal */}
      {showAddTestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-blue-500/50 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 max-w-md mx-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add New Test</h3>
                  <p className="text-gray-400">Add test for {batch?.id}</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                Test form functionality will be implemented here.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddTestModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddTestModal(false);
                    showToast('Test form will be implemented', 'info');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Add Test
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
