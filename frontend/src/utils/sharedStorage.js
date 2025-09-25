// Shared storage utility for cross-application data sharing
// This allows farmer submissions to be shared between different application instances

const STORAGE_KEYS = {
  COLLECTIONS: 'ayurherb_collections',
  BATCHES: 'ayurherb_batches',
  LAST_UPDATE: 'ayurherb_last_update'
};

// Storage event listeners for real-time sync
const storageListeners = new Set();

// Listen for storage changes from other tabs/applications
window.addEventListener('storage', (event) => {
  if (event.key && event.key.startsWith('ayurherb_')) {
    // Notify all registered listeners
    storageListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Storage listener error:', error);
      }
    });
  }
});

export const sharedStorage = {
  // Collections management
  getCollections: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading collections from storage:', error);
      return [];
    }
  },

  setCollections: (collections) => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEYS.COLLECTIONS,
        newValue: JSON.stringify(collections),
        storageArea: localStorage
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving collections to storage:', error);
      return false;
    }
  },

  addCollection: (collection) => {
    const collections = sharedStorage.getCollections();
    const existingIndex = collections.findIndex(c => c.id === collection.id);
    
    if (existingIndex >= 0) {
      collections[existingIndex] = collection;
    } else {
      collections.push(collection);
    }
    
    return sharedStorage.setCollections(collections);
  },

  updateCollectionStatus: (collectionId, newStatus) => {
    const collections = sharedStorage.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    
    if (collectionIndex >= 0) {
      collections[collectionIndex].status = newStatus;
      collections[collectionIndex].lastUpdated = new Date().toISOString();
      return sharedStorage.setCollections(collections);
    }
    
    return false;
  },

  // Batches management (derived from all collections)
  getBatches: () => {
    const collections = sharedStorage.getCollections();
    return collections
      .filter(collection => collection.status !== 'Queued') // Show all except queued
      .map(convertCollectionToBatch);
  },

  // Clear all data
  clearAllData: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
      localStorage.removeItem(STORAGE_KEYS.BATCHES);
      localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEYS.COLLECTIONS,
        newValue: null,
        storageArea: localStorage
      }));
      
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  // Storage event listeners
  addStorageListener: (callback) => {
    storageListeners.add(callback);
    return () => storageListeners.delete(callback);
  },

  // Utility functions
  getLastUpdate: () => {
    return localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Initialize with default data if empty
  initialize: () => {
    const collections = sharedStorage.getCollections();
    if (collections.length === 0) {
      // Initialize with comprehensive farmer submissions for dashboard
      const defaultCollections = [
        {
          id: 'COL001',
          batchId: 'BAT 2024 001',
          collectorId: 'COL 2024',
          farmer: 'COL 2024',
          herb: 'Allovera',
          speciesName: 'Allovera',
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
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL002',
          batchId: 'BAT 2024 003',
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
          qualityAssessment: 'Premium (AA)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL003',
          batchId: 'BAT 2024 004',
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
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
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
          qualityAssessment: 'Premium (AA)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL005',
          batchId: 'BAT-2025-012',
          collectorId: 'COL-103',
          farmer: 'Priya Sharma',
          herb: 'Turmeric',
          speciesName: 'Curcuma longa',
          quantity: '750kg',
          weight: '750kg',
          moisture: '12%',
          gpsCoordinates: '11.1271°, 78.6569°',
          latitude: '11.1271°',
          longitude: '78.6569°',
          accuracy: '±45 meters',
          collectionTime: '9/20/2025, 07:30:00 AM',
          submissionDate: '2025-09-20',
          timestamp: '9/20/2025, 07:30:00 AM',
          status: 'Verified',
          location: 'Tamil Nadu, India',
          qualityGrade: 'Premium (AA)',
          qualityAssessment: 'Premium (AA)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL006',
          batchId: 'BAT-2025-013',
          collectorId: 'COL-104',
          farmer: 'Amit Singh',
          herb: 'Neem',
          speciesName: 'Azadirachta indica',
          quantity: '400kg',
          weight: '400kg',
          moisture: '14%',
          gpsCoordinates: '26.9124°, 75.7873°',
          latitude: '26.9124°',
          longitude: '75.7873°',
          accuracy: '±60 meters',
          collectionTime: '9/19/2025, 09:15:00 AM',
          submissionDate: '2025-09-19',
          timestamp: '9/19/2025, 09:15:00 AM',
          status: 'Verified',
          location: 'Rajasthan, India',
          qualityGrade: 'Standard (A)',
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL007',
          batchId: 'BAT-2025-014',
          collectorId: 'COL-105',
          farmer: 'Lakshmi Devi',
          herb: 'Tulsi',
          speciesName: 'Ocimum sanctum',
          quantity: '200kg',
          weight: '200kg',
          moisture: '16%',
          gpsCoordinates: '15.3173°, 75.7139°',
          latitude: '15.3173°',
          longitude: '75.7139°',
          accuracy: '±35 meters',
          collectionTime: '9/18/2025, 06:45:00 AM',
          submissionDate: '2025-09-18',
          timestamp: '9/18/2025, 06:45:00 AM',
          status: 'Verified',
          location: 'Karnataka, India',
          qualityGrade: 'Premium (AA)',
          qualityAssessment: 'Premium (AA)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL008',
          batchId: 'BAT-2025-015',
          collectorId: 'COL-106',
          farmer: 'Ravi Kumar',
          herb: 'Ginger',
          speciesName: 'Zingiber officinale',
          quantity: '600kg',
          weight: '600kg',
          moisture: '18%',
          gpsCoordinates: '9.9312°, 76.2673°',
          latitude: '9.9312°',
          longitude: '76.2673°',
          accuracy: '±55 meters',
          collectionTime: '9/17/2025, 08:20:00 AM',
          submissionDate: '2025-09-17',
          timestamp: '9/17/2025, 08:20:00 AM',
          status: 'Verified',
          location: 'Kerala, India',
          qualityGrade: 'Standard (A)',
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
        }
      ];
      
      sharedStorage.setCollections(defaultCollections);
    }
  }
};

// Convert collection to batch format for processor dashboard
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

// Initialize storage on module load
// Only clear and reinitialize if no data exists
const initializeStorage = () => {
  const existingCollections = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
  const existingSteps = localStorage.getItem('ayurherb_processing_steps');
  
  // Only initialize if no data exists
  if (!existingCollections) {
    sharedStorage.initialize();
  } else {
    // Ensure we have the sample batch for processing steps demo
    const collections = sharedStorage.getCollections();
    const hasSampleBatch = collections.some(c => c.batchId === 'BAT 2024 009');
    
    if (!hasSampleBatch) {
      const sampleCollection = {
        id: 'COL004',
        batchId: 'BAT 2024 009',
        collectorId: 'COL 2024',
        farmer: 'COL 2024',
        herb: 'Turmeric',
        speciesName: 'Turmeric',
        quantity: '25 kg',
        weight: '25 kg',
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
    }
  }
  
  // Initialize sample processing steps for demo
  if (!existingSteps) {
    const sampleProcessingSteps = {
      'BAT 2024 003': [
        {
          stepType: 'Drying',
          temperature: 60,
          duration: '24 hours',
          notes: 'Optimal drying conditions maintained',
          status: 'Completed',
          date: '2024-01-16',
          timestamp: new Date().toLocaleString()
        },
        {
          stepType: 'Grinding',
          temperature: 25,
          duration: '2 hours',
          notes: 'Fine powder consistency achieved',
          status: 'Completed',
          date: '2024-01-17',
          timestamp: new Date().toLocaleString()
        }
      ],
      'BAT-2025-012': [
        {
          stepType: 'Cleaning',
          temperature: 20,
          duration: '1 hour',
          notes: 'Removed impurities and foreign matter',
          status: 'Completed',
          date: '2025-09-21',
          timestamp: new Date().toLocaleString()
        },
        {
          stepType: 'Drying',
          temperature: 55,
          duration: '18 hours',
          notes: 'Low temperature drying to preserve curcumin',
          status: 'Completed',
          date: '2025-09-22',
          timestamp: new Date().toLocaleString()
        }
      ]
    };
    localStorage.setItem('ayurherb_processing_steps', JSON.stringify(sampleProcessingSteps));
  }
};

initializeStorage();

export default sharedStorage;
