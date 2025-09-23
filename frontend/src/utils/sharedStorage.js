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
      // Initialize with default farmer submissions matching the images
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
          moisture: '40%',
          gpsCoordinates: '22.6290°, 88.4412°',
          latitude: '22.6290°',
          longitude: '88.4412°',
          accuracy: '±162 meters',
          collectionTime: '9/23/2025, 1:56:03 PM',
          submissionDate: '2025-09-23',
          timestamp: '9/23/2025, 1:56:03 PM',
          status: 'Synced',
          location: '22.6290°, 88.4412°',
          qualityGrade: 'Standard (A)',
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL002',
          batchId: 'BAT 2024 002',
          collectorId: 'COL 2024',
          farmer: 'COL 2024',
          herb: 'Brahmi',
          speciesName: 'Brahmi',
          quantity: '2 kg',
          weight: '2 kg',
          moisture: '30%',
          gpsCoordinates: '21.0347°, 88.4400°',
          latitude: '21.0347°',
          longitude: '88.4400°',
          accuracy: '±89 meters',
          collectionTime: '9/21/2025, 5:59:53 PM',
          submissionDate: '2025-09-21',
          timestamp: '9/21/2025, 5:59:53 PM',
          status: 'Synced',
          location: '21.0347°, 88.4400°',
          qualityGrade: 'Standard (A)',
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL003',
          batchId: 'BAT 2024 003',
          collectorId: 'Rajesh Kumar',
          farmer: 'Rajesh Kumar',
          herb: 'Ashwagandha',
          speciesName: 'Ashwagandha',
          quantity: '3.5 kg',
          weight: '3.5 kg',
          moisture: '25%',
          gpsCoordinates: '10.8505°, 76.2711°',
          latitude: '10.8505°',
          longitude: '76.2711°',
          accuracy: '±45 meters',
          collectionTime: '9/22/2025, 2:30:15 PM',
          submissionDate: '2025-09-22',
          timestamp: '9/22/2025, 2:30:15 PM',
          status: 'Synced',
          location: 'Kerala, India',
          qualityGrade: 'Premium (AA)',
          qualityAssessment: 'Premium (AA)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL004',
          batchId: 'BAT 2024 004',
          collectorId: 'Priya Sharma',
          farmer: 'Priya Sharma',
          herb: 'Turmeric',
          speciesName: 'Turmeric',
          quantity: '7 kg',
          weight: '7 kg',
          moisture: '35%',
          gpsCoordinates: '11.1271°, 78.6569°',
          latitude: '11.1271°',
          longitude: '78.6569°',
          accuracy: '±120 meters',
          collectionTime: '9/20/2025, 11:45:22 AM',
          submissionDate: '2025-09-20',
          timestamp: '9/20/2025, 11:45:22 AM',
          status: 'Synced',
          location: 'Tamil Nadu, India',
          qualityGrade: 'Standard (A)',
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL005',
          batchId: 'BAT 2024 005',
          collectorId: 'Amit Singh',
          farmer: 'Amit Singh',
          herb: 'Neem',
          speciesName: 'Neem',
          quantity: '4.2 kg',
          weight: '4.2 kg',
          moisture: '28%',
          gpsCoordinates: '26.9124°, 75.7873°',
          latitude: '26.9124°',
          longitude: '75.7873°',
          accuracy: '±85 meters',
          collectionTime: '9/19/2025, 4:20:10 PM',
          submissionDate: '2025-09-19',
          timestamp: '9/19/2025, 4:20:10 PM',
          status: 'Synced',
          location: 'Rajasthan, India',
          qualityGrade: 'Standard (A)',
          qualityAssessment: 'Standard (A)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'COL006',
          batchId: 'BAT 2024 006',
          collectorId: 'Sunita Devi',
          farmer: 'Sunita Devi',
          herb: 'Tulsi',
          speciesName: 'Tulsi',
          quantity: '1.8 kg',
          weight: '1.8 kg',
          moisture: '22%',
          gpsCoordinates: '25.5941°, 85.1376°',
          latitude: '25.5941°',
          longitude: '85.1376°',
          accuracy: '±95 meters',
          collectionTime: '9/18/2025, 9:15:45 AM',
          submissionDate: '2025-09-18',
          timestamp: '9/18/2025, 9:15:45 AM',
          status: 'Synced',
          location: 'Bihar, India',
          qualityGrade: 'Premium (AA)',
          qualityAssessment: 'Premium (AA)',
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
sharedStorage.initialize();

export default sharedStorage;
