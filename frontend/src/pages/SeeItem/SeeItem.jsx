import React, { useState, useEffect } from 'react';
import { Package, TestTube, AlertCircle, Eye, Sparkles, Download, Calendar, BarChart3, CheckCircle, Clock } from 'lucide-react';

const SeeItem = () => {
  const [testedItems, setTestedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Check for tested items from lab tests
    const checkForTestedItems = () => {
      const labTests = JSON.parse(localStorage.getItem('ayurherb_lab_tests') || '[]');
      setTestedItems(labTests);
    };

    checkForTestedItems();

    // Listen for storage changes to update when new lab tests are added
    const handleStorageChange = (e) => {
      if (e.key === 'ayurherb_lab_tests') {
        checkForTestedItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // CSV Export Function for BAT 2024 001
  const downloadBatchCSV = () => {
    const batchData = {
      batchId: 'BAT 2024 001',
      testType: 'Pesticide Screening',
      result: '2ppm',
      status: 'Passed',
      technician: 'Junaid',
      herbType: 'Allovera',
      date: '9/25/2025',
      farmerId: 'FARM001',
      farmerName: 'Rajesh Kumar',
      originLocation: 'Kerala, India',
      harvestDate: '2024-01-15',
      quantity: '5.0 kg',
      qualityGrade: 'Premium',
      blockchainTx: '0x8bf3c3a9914b126481ece5ed7c4215febd9e1414083ed8ea359453f7308dc0ee',
      blockNumber: '15',
      gasUsed: '1583987',
      network: 'Hyperledger Besu',
      contractAddress: '0x4f6B416f62f3B88E3179Afa5f8611CdEb4C22eF3'
    };

    // Prepare CSV data
    const csvData = [
      ['Field', 'Value'],
      ['Batch ID', batchData.batchId],
      ['Test Type', batchData.testType],
      ['Test Result', batchData.result],
      ['Test Status', batchData.status],
      ['Technician', batchData.technician],
      ['Herb Type', batchData.herbType],
      ['Test Date', batchData.date],
      ['Farmer ID', batchData.farmerId],
      ['Farmer Name', batchData.farmerName],
      ['Origin Location', batchData.originLocation],
      ['Harvest Date', batchData.harvestDate],
      ['Quantity', batchData.quantity],
      ['Quality Grade', batchData.qualityGrade],
      ['Blockchain Network', batchData.network],
      ['Transaction Hash', batchData.blockchainTx],
      ['Block Number', batchData.blockNumber],
      ['Gas Used', batchData.gasUsed],
      ['Contract Address', batchData.contractAddress],
      ['Export Date', new Date().toLocaleString()],
      ['Export Time', new Date().toISOString()]
    ];

    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${batchData.batchId}_complete_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent mb-2">
                See Item
              </h1>
              <p className="text-xl text-gray-300 font-light">
                View tested items and lab results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-gray-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-12">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-gray-300">Loading tested items...</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Tested Items</h2>
            <p className="text-gray-400">Items that have completed lab testing</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Test Result Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 hover:border-slate-500/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">BAT 2024 001</h3>
                    <p className="text-sm text-gray-400">Pesticide Screening</p>
                  </div>
                </div>
                {/* Download Button */}
                <button
                  onClick={downloadBatchCSV}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200 flex items-center gap-2 text-sm"
                  title="Download complete batch report as CSV"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Result:</span>
                  <span className="text-white font-medium">2ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-emerald-400 font-medium">Passed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Technician:</span>
                  <span className="text-white">Junaid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Herb Type:</span>
                  <span className="text-white">Allovera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">9/25/2025</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-600/50">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium">Verified on Blockchain</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  TX: 0x8bf3c3a9914b...
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column - Test History */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 h-full">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Test History - Last 30 Days
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 001</div>
                    <div className="text-xs text-slate-400">Allovera - Pesticide Screening</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400">Passed</div>
                    <div className="text-xs text-slate-400">Sep 25</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 002</div>
                    <div className="text-xs text-slate-400">Turmeric - Heavy Metal Test</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400">Passed</div>
                    <div className="text-xs text-slate-400">Sep 23</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 003</div>
                    <div className="text-xs text-slate-400">Ashwagandha - Moisture Content</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-yellow-400">Pending</div>
                    <div className="text-xs text-slate-400">Sep 22</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 004</div>
                    <div className="text-xs text-slate-400">Neem - Microbial Test</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400">Passed</div>
                    <div className="text-xs text-slate-400">Sep 20</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 005</div>
                    <div className="text-xs text-slate-400">Brahmi - Pesticide Screening</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-400">Failed</div>
                    <div className="text-xs text-slate-400">Sep 18</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Statistics and Activity */}
          <div className="lg:col-span-1 space-y-6">
            {/* Test Statistics */}
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Test Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">47</div>
                  <div className="text-xs text-slate-400">Total Tests</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-emerald-400">42</div>
                  <div className="text-xs text-slate-400">Passed</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-400">3</div>
                  <div className="text-xs text-slate-400">Failed</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-400">2</div>
                  <div className="text-xs text-slate-400">Pending</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Success Rate</span>
                  <span className="text-sm font-medium text-emerald-400">89.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Avg. Processing Time</span>
                  <span className="text-sm font-medium text-white">2.3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Most Tested Herb</span>
                  <span className="text-sm font-medium text-blue-400">Ashwagandha</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">This Month</span>
                  <span className="text-sm font-medium text-white">12 Tests</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">Test completed for BAT 2024 001</div>
                    <div className="text-xs text-slate-400">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">Blockchain verification successful</div>
                    <div className="text-xs text-slate-400">5 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">New batch BAT 2024 006 received</div>
                    <div className="text-xs text-slate-400">1 hour ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">Quality report generated</div>
                    <div className="text-xs text-slate-400">3 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default SeeItem;
