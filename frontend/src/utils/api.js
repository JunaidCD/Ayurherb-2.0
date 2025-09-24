// API functions for Ayurherb 2.0
// Now connecting to real backend server

import { sharedStorage } from './sharedStorage.js';

const API_BASE_URL = 'http://localhost:3001/api/v1';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error.message);
    // Fallback to mock data for development
    throw error;
  }
};

// Mock data - Exact farmer submission data from Image 1
let mockCollections = [
  {
    id: 'COL001',
    batchId: 'BAT 2024 001',
    collectorId: 'COL 2024',
    farmer: 'COL 2024',
    herb: 'Brahmi',
    speciesName: 'Brahmi',
    quantity: '5 kg',
    weight: '5 kg',
    moisture: '20%',
    gpsCoordinates: '22.6290°, 88.4412°',
    latitude: '22.6290°',
    longitude: '88.4412°',
    accuracy: '±162 meters',
    collectionTime: '9/23/2025, 10:06:50 AM',
    submissionDate: '2025-09-23',
    timestamp: '9/23/2025, 10:06:50 AM',
    status: 'Verified',
    location: '22.6290°, 88.4412°',
    qualityGrade: 'Standard (A)',
    qualityAssessment: 'Standard (A)'
  },
  {
    id: 'COL002',
    batchId: 'BAT 2024 002',
    collectorId: 'COL 2024',
    farmer: 'Rajesh Kumar',
    herb: 'Ashwagandha',
    speciesName: 'Ashwagandha',
    quantity: '500kg',
    weight: '500kg',
    moisture: '15%',
    gpsCoordinates: '10.8505°, 76.2711°',
    latitude: '10.8505°',
    longitude: '76.2711°',
    accuracy: '±50 meters',
    collectionTime: '1/15/2024, 08:30:00 AM',
    submissionDate: '2024-01-15',
    timestamp: '1/15/2024, 08:30:00 AM',
    status: 'Verified',
    location: 'Kerala, India',
    qualityGrade: 'Premium (AA)',
    qualityAssessment: 'Premium (AA)'
  },
  {
    id: 'COL003',
    batchId: 'BAT 2024 003',
    collectorId: 'COL 2024',
    farmer: 'Suresh Patel',
    herb: 'Brahmi',
    speciesName: 'Brahmi',
    quantity: '300kg',
    weight: '300kg',
    moisture: '18%',
    gpsCoordinates: '23.0225°, 72.5714°',
    latitude: '23.0225°',
    longitude: '72.5714°',
    accuracy: '±75 meters',
    collectionTime: '1/25/2024, 14:15:30 PM',
    submissionDate: '2024-01-25',
    timestamp: '1/25/2024, 14:15:30 PM',
    status: 'Synced',
    location: 'Gujarat, India',
    qualityGrade: 'Standard (A)',
    qualityAssessment: 'Standard (A)'
  },
  {
    id: 'COL004',
    batchId: 'BAT-2025-011',
    collectorId: 'COL-102',
    farmer: 'COL-102',
    herb: 'Ashwagandha',
    speciesName: 'Ashwagandha',
    quantity: '12 kg',
    weight: '12 kg',
    moisture: '9%',
    gpsCoordinates: '18.9123°, 77.5123°',
    latitude: '18.9123°',
    longitude: '77.5123°',
    accuracy: '±89 meters',
    collectionTime: '9/21/2025, 10:12:00 AM',
    submissionDate: '2025-09-21',
    timestamp: '9/21/2025, 10:12:00 AM',
    status: 'Verified',
    location: '18.9123°, 77.5123° (Protected forest)',
    qualityGrade: 'Premium (AA)',
    qualityAssessment: 'Premium (AA)'
  }
];

// Function to convert verified collections to processing batches
const convertCollectionToBatch = (collection) => {
  return {
    id: collection.batchId || `AH${collection.id.replace('COL', '')}`,
    batchId: collection.batchId,
    collectorId: collection.collectorId,
    herb: collection.herb,
    speciesName: collection.speciesName,
    farmer: collection.farmer,
    location: collection.location,
    gpsCoordinates: collection.gpsCoordinates,
    latitude: collection.latitude,
    longitude: collection.longitude,
    accuracy: collection.accuracy,
    harvestDate: collection.submissionDate,
    collectionTime: collection.collectionTime,
    timestamp: collection.timestamp,
    quantity: collection.quantity,
    weight: collection.weight,
    moisture: collection.moisture,
    qualityGrade: collection.qualityGrade,
    qualityAssessment: collection.qualityAssessment,
    status: 'Processing',
    qualityScore: collection.qualityGrade === 'Premium (AA)' ? 98 : 92,
    processingSteps: [
      { step: 'Collection Verified', date: collection.submissionDate, status: 'Completed' },
      { step: 'Quality Check', date: new Date().toISOString().split('T')[0], status: 'In Progress' }
    ],
    labResults: {
      moisture: collection.moisture,
      pesticide: 'Pending Test',
      dna: 'Pending Test',
      ayushCompliance: false
    },
    collectionId: collection.id // Link back to original collection
  };
};

// Get current processing batches (verified collections converted to batches)
const getProcessingBatches = () => {
  return mockCollections
    .filter(collection => collection.status === 'Verified')
    .map(convertCollectionToBatch);
};

const mockStats = {
  totalCollections: 1247,
  verifiedBatches: 1089,
  recalledBatches: 23,
  pendingTests: 135,
  environmentalImpact: {
    carbonFootprint: 2.4,
    waterUsage: 1250,
    sustainabilityScore: 87
  }
};

const mockChartData = [
  { month: 'Jan', harvest: 2400, processed: 2100, verified: 1900 },
  { month: 'Feb', harvest: 1398, processed: 1200, verified: 1100 },
  { month: 'Mar', harvest: 9800, processed: 8900, verified: 8200 },
  { month: 'Apr', harvest: 3908, processed: 3500, verified: 3200 },
  { month: 'May', harvest: 4800, processed: 4300, verified: 4000 },
  { month: 'Jun', harvest: 3800, processed: 3400, verified: 3100 }
];

// API Functions
export const api = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      return await response.json();
    } catch (error) {
      throw new Error('Backend server not available');
    }
  },

  // Authentication
  login: async (credentials) => {
    await delay(1000);
    if (credentials.username && credentials.password) {
      return {
        success: true,
        user: {
          id: '1',
          username: credentials.username,
          role: credentials.role,
          name: 'Junaid',
          email: 'junaid@ayurherb.com'
        },
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    await delay(500);
    return mockStats;
  },

  // Batches - Now using shared storage
  getBatches: async (filters = {}) => {
    await delay(800);
    let filteredBatches = sharedStorage.getBatches(); // Get batches from verified collections in shared storage
    
    if (filters.status) {
      filteredBatches = filteredBatches.filter(batch => 
        batch.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.search) {
      filteredBatches = filteredBatches.filter(batch =>
        batch.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        batch.herb.toLowerCase().includes(filters.search.toLowerCase()) ||
        batch.farmer.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return filteredBatches;
  },

  getBatchById: async (id) => {
    await delay(500);
    const batches = sharedStorage.getBatches();
    const batch = batches.find(b => b.id === id);
    if (!batch) throw new Error('Batch not found');
    return batch;
  },

  // Processing
  addProcessingStep: async (batchId, stepData) => {
    try {
      // Try real API first
      const result = await apiCall('/processing-steps', {
        method: 'POST',
        body: JSON.stringify({
          batchId,
          processorId: 'PROC001',
          stepType: stepData.stepType || stepData.step,
          temperature: stepData.temperature || 0,
          duration: stepData.duration || '',
          notes: stepData.notes || '',
          fileHash: ''
        })
      });
      
      return {
        success: true,
        message: 'Processing step added to blockchain successfully',
        step: result,
        blockchain: true
      };
    } catch (error) {
      // Fallback to mock/local storage
      await delay(1000);
      
      // Get current batches and update the specific batch
      const batches = sharedStorage.getBatches();
      const batchIndex = batches.findIndex(b => b.id === batchId);
      
      if (batchIndex >= 0) {
        const newStep = {
          id: Date.now().toString(),
          step: stepData.step || stepData.stepType,
          stepType: stepData.stepType,
          temperature: stepData.temperature,
          duration: stepData.duration,
          notes: stepData.notes,
          description: stepData.description || `${stepData.stepType} process completed`,
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toLocaleString(),
          status: 'Completed'
        };
        
        // Add the step to the batch's processing steps
        if (!batches[batchIndex].processingSteps) {
          batches[batchIndex].processingSteps = [];
        }
        batches[batchIndex].processingSteps.push(newStep);
        
        // Update the collections in shared storage
        const collections = sharedStorage.getCollections();
        const collectionIndex = collections.findIndex(c => c.batchId === batches[batchIndex].batchId);
        if (collectionIndex >= 0) {
          collections[collectionIndex].lastUpdated = new Date().toISOString();
          sharedStorage.setCollections(collections);
        }
      }
      
      return {
        success: true,
        message: 'Processing step added successfully (local storage)',
        step: {
          id: Date.now().toString(),
          ...stepData,
          date: new Date().toISOString().split('T')[0],
          status: 'Completed'
        },
        blockchain: false
      };
    }
  },

  // Lab Testing
  addLabResult: async (batchId, testData) => {
    await delay(1200);
    return {
      success: true,
      message: 'Lab results added successfully',
      result: {
        id: Date.now().toString(),
        batchId,
        ...testData,
        testDate: new Date().toISOString().split('T')[0],
        technician: 'Dr. Sarah Wilson'
      }
    };
  },

  // Charts and Analytics
  getHarvestData: async () => {
    await delay(600);
    return mockChartData;
  },

  getEnvironmentalReport: async () => {
    await delay(700);
    return {
      carbonFootprint: mockStats.environmentalImpact.carbonFootprint,
      waterUsage: mockStats.environmentalImpact.waterUsage,
      sustainabilityScore: mockStats.environmentalImpact.sustainabilityScore,
      monthlyData: mockChartData.map(item => ({
        month: item.month,
        carbon: Math.random() * 5,
        water: Math.random() * 2000,
        sustainability: 70 + Math.random() * 30
      }))
    };
  },

  getAyushCompliance: async () => {
    await delay(500);
    return {
      overallCompliance: 94.2,
      categories: [
        { name: 'Quality Standards', score: 96.5, status: 'Excellent' },
        { name: 'Documentation', score: 92.8, status: 'Good' },
        { name: 'Traceability', score: 98.1, status: 'Excellent' },
        { name: 'Safety Protocols', score: 89.4, status: 'Good' }
      ]
    };
  },

  // Collections (Farmer submissions) - Now using shared storage
  getCollections: async () => {
    await delay(600);
    return sharedStorage.getCollections();
  },

  // Add new collection (for farmer submissions)
  addCollection: async (collectionData) => {
    await delay(800);
    const newCollection = {
      id: `COL${Date.now().toString().slice(-3)}`,
      batchId: `BAT 2024 ${Date.now().toString().slice(-3)}`,
      collectorId: 'COL 2024',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      ...collectionData
    };
    
    const success = sharedStorage.addCollection(newCollection);
    if (!success) throw new Error('Failed to save collection');
    
    return {
      success: true,
      message: 'Collection added successfully',
      collection: newCollection
    };
  },

  // Update collection status (this will affect processor dashboard)
  updateCollectionStatus: async (collectionId, newStatus) => {
    await delay(800);
    const success = sharedStorage.updateCollectionStatus(collectionId, newStatus);
    if (!success) throw new Error('Collection not found');
    
    const collections = sharedStorage.getCollections();
    const updatedCollection = collections.find(c => c.id === collectionId);
    
    return {
      success: true,
      message: `Collection ${collectionId} status updated to ${newStatus}`,
      collection: updatedCollection
    };
  },

  // File upload simulation
  uploadFile: async (file) => {
    await delay(2000);
    return {
      success: true,
      fileUrl: `https://mock-storage.com/${file.name}`,
      fileName: file.name,
      fileSize: file.size
    };
  },

  // Clear all batches/collections
  clearAllBatches: async () => {
    await delay(500);
    const success = sharedStorage.clearAllData();
    if (!success) throw new Error('Failed to clear data');
    
    return {
      success: true,
      message: 'All batches cleared successfully'
    };
  }
};

export default api;
