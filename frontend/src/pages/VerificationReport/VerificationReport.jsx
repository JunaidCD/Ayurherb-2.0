import React, { useState } from 'react';
import { Shield, FileCheck, Database, Award, Search, CheckCircle, Thermometer, Timer, Beaker } from 'lucide-react';

const VerificationReport = ({ user, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock batch data (same as from Collections page)
  const batchData = {
    'BAT 2024 001': {
      id: 'BAT 2024 001',
      herbType: 'Allovera',
      location: '21.0347°, 88.4400°',
      quantity: '5 kg',
      quality: 'Premium (AA)',
      harvestDate: '2025-09-24',
      processingSteps: {
        type: 'Drying Process',
        temperature: '20°C',
        duration: '2 hrs',
        status: 'Good condition',
        progress: '100%'
      },
      labResults: {
        testType: 'Pesticide Screening',
        result: '2ppm',
        status: 'Passed',
        date: '9/25/2025',
        blockchainTx: '0x8bf3c3a9914b...'
      }
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      showToast('Please enter a batch ID to search', 'warning');
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const batch = batchData[searchQuery.toUpperCase()];
      if (batch) {
        setSearchResults(batch);
        showToast(`Batch ${searchQuery} found successfully!`, 'success');
      } else {
        setSearchResults(null);
        showToast(`Batch ${searchQuery} not found`, 'error');
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleVerify = () => {
    if (searchResults) {
      showToast(`Batch ${searchResults.id} has been verified successfully!`, 'success');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Modern Header with Glassmorphism */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-emerald-200 to-blue-300 bg-clip-text text-transparent mb-2">
                  Verification & Report
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Comprehensive verification and reporting system for supply chain integrity
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Verification Active</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-2xl blur-lg"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Search className="w-6 h-6 text-emerald-400" />
            Batch Verification Search
          </h2>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Batch ID (e.g., BAT 2024 001)"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            
            {/* Batch Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-60"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <FileCheck className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-blue-300 bg-clip-text text-transparent">
                    {searchResults.id}
                  </h2>
                  <p className="text-gray-300 font-medium">{searchResults.herbType} - Batch Verification Details</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <span className="text-emerald-300 text-sm font-medium">Ready for Verification</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Batch Information</h3>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Batch ID:</span>
                      <span className="text-white font-semibold">{searchResults.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Herb Type:</span>
                      <span className="text-white font-semibold">{searchResults.herbType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Location:</span>
                      <span className="text-white font-semibold">{searchResults.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quantity:</span>
                      <span className="text-white font-semibold">{searchResults.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quality:</span>
                      <span className="text-white font-semibold">{searchResults.quality}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Harvest Date:</span>
                      <span className="text-white font-semibold">{searchResults.harvestDate}</span>
                    </div>
                  </div>
                </div>

                {/* Processing Details */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Thermometer className="w-5 h-5 text-orange-400" />
                    <h4 className="text-lg font-bold text-white">{searchResults.processingSteps.type}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-orange-300 text-sm mb-1">Temperature</div>
                      <div className="text-white font-bold">{searchResults.processingSteps.temperature}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-300 text-sm mb-1">Duration</div>
                      <div className="text-white font-bold">{searchResults.processingSteps.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-300 text-sm mb-1">Progress</div>
                      <div className="text-white font-bold">{searchResults.processingSteps.progress}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Lab Testing Results</h3>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Test Type:</span>
                      <span className="text-white font-semibold">{searchResults.labResults.testType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Result:</span>
                      <span className="text-white font-semibold">{searchResults.labResults.result}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Status:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {searchResults.labResults.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Test Date:</span>
                      <span className="text-white font-semibold">{searchResults.labResults.date}</span>
                    </div>
                  </div>

                  {/* Blockchain Verification */}
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 font-medium">Verified on Blockchain</span>
                      </div>
                      <span className="text-sm font-mono text-gray-400">{searchResults.labResults.blockchainTx}</span>
                    </div>
                  </div>
                </div>

                {/* Verify Button */}
                <div className="mt-8">
                  <button
                    onClick={handleVerify}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Shield className="w-6 h-6" />
                    Verify Batch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State (when no search results) */}
      {!searchResults && !isSearching && (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Search for Batch Verification</h3>
            <p className="text-gray-400 text-lg">Enter a batch ID above to view verification details</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationReport;
