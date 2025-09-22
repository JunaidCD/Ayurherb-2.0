// Mock API functions for Ayurherb 2.0
// Replace these with actual API calls when backend is ready

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockBatches = [
  {
    id: 'AH001',
    herb: 'Ashwagandha',
    farmer: 'Rajesh Kumar',
    location: 'Kerala, India',
    harvestDate: '2024-01-15',
    quantity: '500kg',
    status: 'Verified',
    qualityScore: 95,
    processingSteps: [
      { step: 'Harvesting', date: '2024-01-15', status: 'Completed' },
      { step: 'Drying', date: '2024-01-18', status: 'Completed' },
      { step: 'Grinding', date: '2024-01-22', status: 'In Progress' }
    ],
    labResults: {
      moisture: 8.5,
      pesticide: 'Not Detected',
      dna: 'Confirmed',
      ayushCompliance: true
    }
  },
  {
    id: 'AH002',
    herb: 'Turmeric',
    farmer: 'Priya Sharma',
    location: 'Tamil Nadu, India',
    harvestDate: '2024-01-20',
    quantity: '750kg',
    status: 'Synced',
    qualityScore: 88,
    processingSteps: [
      { step: 'Harvesting', date: '2024-01-20', status: 'Completed' },
      { step: 'Cleaning', date: '2024-01-22', status: 'Completed' }
    ],
    labResults: {
      moisture: 12.2,
      pesticide: 'Not Detected',
      dna: 'Confirmed',
      ayushCompliance: true
    }
  },
  {
    id: 'AH003',
    herb: 'Brahmi',
    farmer: 'Suresh Patel',
    location: 'Gujarat, India',
    harvestDate: '2024-01-25',
    quantity: '300kg',
    status: 'Recalled',
    qualityScore: 65,
    processingSteps: [
      { step: 'Harvesting', date: '2024-01-25', status: 'Completed' }
    ],
    labResults: {
      moisture: 15.8,
      pesticide: 'Detected',
      dna: 'Confirmed',
      ayushCompliance: false
    }
  }
];

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

  // Batches
  getBatches: async (filters = {}) => {
    await delay(800);
    let filteredBatches = [...mockBatches];
    
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
    const batch = mockBatches.find(b => b.id === id);
    if (!batch) throw new Error('Batch not found');
    return batch;
  },

  // Processing
  addProcessingStep: async (batchId, stepData) => {
    await delay(1000);
    return {
      success: true,
      message: 'Processing step added successfully',
      step: {
        id: Date.now().toString(),
        ...stepData,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed'
      }
    };
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

  // Collections (Farmer submissions)
  getCollections: async () => {
    await delay(600);
    return [
      {
        id: 'COL001',
        farmer: 'Rajesh Kumar',
        herb: 'Ashwagandha',
        quantity: '500kg',
        submissionDate: '2024-01-15',
        status: 'Verified',
        location: 'Kerala, India'
      },
      {
        id: 'COL002',
        farmer: 'Priya Sharma',
        herb: 'Turmeric',
        quantity: '750kg',
        submissionDate: '2024-01-20',
        status: 'Synced',
        location: 'Tamil Nadu, India'
      },
      {
        id: 'COL003',
        farmer: 'Suresh Patel',
        herb: 'Brahmi',
        quantity: '300kg',
        submissionDate: '2024-01-25',
        status: 'Queued',
        location: 'Gujarat, India'
      }
    ];
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
  }
};

export default api;
