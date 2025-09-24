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
// Clear existing data first to apply new configuration
sharedStorage.clearAllData();
sharedStorage.initialize();

export default sharedStorage;
