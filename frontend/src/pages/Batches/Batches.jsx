import React, { useState, useEffect } from 'react';
import { Package, Thermometer, Clock, CheckCircle, AlertCircle, Calendar, Download } from 'lucide-react';
import { api } from '../../utils/api.js';
import { sharedStorage } from '../../utils/sharedStorage.js';

const Batches = () => {
  const [processedBatches, setProcessedBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch processed batches
  const fetchProcessedBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const batches = await api.getProcessedBatches();
      console.log('Fetched processed batches:', batches);
      setProcessedBatches(batches);
    } catch (err) {
      console.error('Error fetching processed batches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Force initialization of sample data
    const initializeSampleData = () => {
      console.log('=== INITIALIZING SAMPLE DATA FOR BATCHES PAGE ===');
      
      // Force create sample processing steps
      const sampleProcessingSteps = {
        'BAT 2024 001': [
          {
            stepType: 'Drying Process',
            temperature: 20,
            duration: '2 hrs',
            notes: 'Good condition',
            status: 'Completed',
            date: '2025-09-24',
            timestamp: new Date().toLocaleString()
          }
        ]
      };
      localStorage.setItem('ayurherb_processing_steps', JSON.stringify(sampleProcessingSteps));
      console.log('✅ Force created sample processing steps:', sampleProcessingSteps);
      
      // Ensure sample collection exists
      const collections = sharedStorage.getCollections();
      console.log('Current collections:', collections);
      
      const hasSampleBatch = collections.some(c => c.batchId === 'BAT 2024 001');
      console.log('Has sample batch BAT 2024 001:', hasSampleBatch);
      
      if (!hasSampleBatch) {
        const sampleCollection = {
          id: 'COL004',
          batchId: 'BAT 2024 001',
          collectorId: 'COL 2024',
          farmer: 'COL 2024',
          herb: 'Allovera',
          speciesName: 'Allovera',
          quantity: '5 kg',
          weight: '5 kg',
          moisture: '12%',
          gpsCoordinates: '12.9716°, 77.5946°',
          latitude: '12.9716°',
          longitude: '77.5946°',
          accuracy: '±45 meters',
          collectionTime: '9/24/2025, 8:30:00 AM',
          submissionDate: '2025-09-24',
          timestamp: '9/24/2025, 8:30:00 AM',
          status: 'Verified',
          location: 'Bangalore, Karnataka',
          qualityGrade: 'Premium (AA)',
          qualityAssessment: 'Premium (AA)',
          createdAt: new Date().toISOString()
        };
        
        collections.push(sampleCollection);
        sharedStorage.setCollections(collections);
        console.log('✅ Added sample collection:', sampleCollection);
      }
    };

    initializeSampleData();
    
    // Small delay to ensure data is set before fetching
    setTimeout(() => {
      fetchProcessedBatches();
    }, 100);

    // Listen for storage changes to update in real-time
    const unsubscribe = sharedStorage.addStorageListener((event) => {
      if (event.key === 'ayurherb_processing_steps' || event.key === 'ayurherb_collections') {
        console.log('Storage updated, refetching processed batches...');
        fetchProcessedBatches();
      }
    });

    return unsubscribe;
  }, []);

  // CSV Export Function
  const exportBatchToCSV = (batch) => {
    // Prepare CSV data
    const csvData = [
      ['Field', 'Value'],
      ['Batch ID', batch.batchId],
      ['Herb Type', batch.herb],
      ['Quantity', batch.quantity],
      ['Quality Grade', 'Premium (AA)'],
      ['Progress', `${batch.progress}%`],
      ['Status', 'Complete'],
      ['Date', '2025-09-24'],
      ['Location', batch.location || 'Bangalore, Karnataka'],
      ['Farmer', batch.farmer || 'COL 2024'],
      ['Collection ID', batch.id || 'COL004'],
      ['GPS Coordinates', batch.gpsCoordinates || '12.9716°, 77.5946°'],
      ['Moisture Content', batch.moisture || '12%'],
      ['Collection Time', batch.collectionTime || '9/24/2025, 8:30:00 AM'],
      ['Submission Date', batch.submissionDate || '2025-09-24'],
      ['Processing Steps', ''],
    ];

    // Add processing steps data
    if (batch.customProcessingSteps && batch.customProcessingSteps.length > 0) {
      batch.customProcessingSteps.forEach((step, index) => {
        csvData.push([`Step ${index + 1} - Type`, step.stepType]);
        csvData.push([`Step ${index + 1} - Temperature`, `${step.temperature}°C`]);
        csvData.push([`Step ${index + 1} - Duration`, step.duration]);
        csvData.push([`Step ${index + 1} - Status`, step.status]);
        csvData.push([`Step ${index + 1} - Notes`, step.notes]);
        csvData.push([`Step ${index + 1} - Date`, step.date]);
      });
    }

    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${batch.batchId}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Updated Batch Card Component to match second image format
  const BatchCard = ({ batch }) => {
    console.log('🔄 Rendering BatchCard with batch:', batch);
    
    return (
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-4 hover:border-slate-500/70 transition-all duration-300 shadow-lg">
        {/* Header with icon and batch info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{batch.batchId}</h3>
            <p className="text-sm text-slate-400">{batch.herb}</p>
          </div>
          {/* CSV Export Button */}
          <button
            onClick={() => exportBatchToCSV(batch)}
            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 hover:text-emerald-200 transition-all duration-200 flex items-center gap-1.5 text-sm"
            title="Export batch details to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                Batches
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Processed batch management
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
              <div className="animate-spin w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-gray-300">Loading processed batches...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-red-500/20 rounded-2xl p-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Error Loading Batches</h2>
              <p className="text-xl text-gray-300">{error}</p>
              <button 
                onClick={fetchProcessedBatches}
                className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : processedBatches.length === 0 ? (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-gray-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-12">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                No Processed Batches Yet
              </h2>
              
              <p className="text-xl text-gray-300 font-medium">
                New Processed Batches will appear here
              </p>
              
              <p className="text-gray-400 mt-4 max-w-md mx-auto">
                Once you complete processing steps for batches, they will be displayed on this page for tracking and management.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-8">
          {/* Left side - Main batch cards */}
          <div className="max-w-md">
            {processedBatches.map((batch) => (
              <div key={batch.batchId} className="mb-4">
                <BatchCard batch={batch} />
              </div>
            ))}
          </div>

          {/* Right side - Processing History and Recent Batches */}
          <div className="flex-1 space-y-6">
            {/* Processing History - Last 30 Days */}
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Processing History - Last 30 Days
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 001</div>
                    <div className="text-xs text-slate-400">Allovera - Drying Process</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400">Completed</div>
                    <div className="text-xs text-slate-400">Sep 24</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 002</div>
                    <div className="text-xs text-slate-400">Turmeric - Grinding Process</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-400">In Progress</div>
                    <div className="text-xs text-slate-400">Sep 23</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">BAT 2024 003</div>
                    <div className="text-xs text-slate-400">Ashwagandha - Storage Process</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400">Completed</div>
                    <div className="text-xs text-slate-400">Sep 22</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Batches - Last 6 Months */}
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                Recent Batches - Last 6 Months
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">24</div>
                  <div className="text-xs text-slate-400">Total Batches</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-emerald-400">18</div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-400">4</div>
                  <div className="text-xs text-slate-400">In Progress</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-400">2</div>
                  <div className="text-xs text-slate-400">Pending</div>
                </div>
              </div>
              
              {/* Recent batch list */}
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-slate-300 mb-2">Recent Batches:</div>
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-sm text-white">BAT 2024 004</span>
                  <span className="text-xs text-slate-400">Neem - Aug 2024</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-sm text-white">BAT 2024 005</span>
                  <span className="text-xs text-slate-400">Brahmi - Jul 2024</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-sm text-white">BAT 2024 006</span>
                  <span className="text-xs text-slate-400">Giloy - Jun 2024</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-sm text-white">BAT 2024 007</span>
                  <span className="text-xs text-slate-400">Amla - May 2024</span>
                </div>
              </div>
            </div>

            {/* Processing Statistics */}
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                Processing Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Average Processing Time</span>
                  <span className="text-sm font-medium text-white">3.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Success Rate</span>
                  <span className="text-sm font-medium text-emerald-400">94.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Quality Grade Average</span>
                  <span className="text-sm font-medium text-blue-400">Premium (AA)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Total Volume Processed</span>
                  <span className="text-sm font-medium text-white">1,247 kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batches;
