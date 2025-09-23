// Simple API for farmer app to submit data directly to shared storage
// This can be imported and used by the farmer application

import { sharedStorage } from './sharedStorage.js';

// Function that farmer app can call to submit collection data
export const submitFarmerCollection = (farmerData) => {
  try {
    // Create collection object with proper structure
    const collection = {
      id: `COL${Date.now().toString().slice(-3)}`,
      batchId: `BAT 2024 ${Date.now().toString().slice(-3)}`,
      collectorId: farmerData.collectorId || 'COL 2024',
      farmer: farmerData.farmer || farmerData.collectorId || 'COL 2024',
      herb: farmerData.herb || farmerData.speciesName,
      speciesName: farmerData.speciesName || farmerData.herb,
      quantity: farmerData.quantity || farmerData.weight,
      weight: farmerData.weight || farmerData.quantity,
      moisture: farmerData.moisture,
      gpsCoordinates: farmerData.gpsCoordinates,
      latitude: farmerData.latitude,
      longitude: farmerData.longitude,
      accuracy: farmerData.accuracy,
      collectionTime: farmerData.collectionTime || new Date().toLocaleString(),
      submissionDate: farmerData.submissionDate || new Date().toISOString().split('T')[0],
      timestamp: farmerData.timestamp || new Date().toLocaleString(),
      status: 'Synced', // Immediately available for processing
      location: farmerData.location || farmerData.gpsCoordinates,
      qualityGrade: farmerData.qualityGrade || 'Standard (A)',
      qualityAssessment: farmerData.qualityAssessment || farmerData.qualityGrade || 'Standard (A)',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Add to shared storage
    const success = sharedStorage.addCollection(collection);
    
    if (success) {
      console.log('✅ Farmer collection submitted successfully:', collection.id);
      return {
        success: true,
        collection: collection,
        message: `Collection ${collection.id} submitted successfully`
      };
    } else {
      throw new Error('Failed to save to shared storage');
    }
    
  } catch (error) {
    console.error('❌ Error submitting farmer collection:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get all collections (for farmer app to display)
export const getFarmerCollections = () => {
  return sharedStorage.getCollections();
};

// Function to update collection status
export const updateFarmerCollectionStatus = (collectionId, newStatus) => {
  return sharedStorage.updateCollectionStatus(collectionId, newStatus);
};

// Global function that can be called from browser console or other apps
window.submitFarmerData = submitFarmerCollection;
window.getFarmerData = getFarmerCollections;

// Example usage for farmer app:
/*
// In your farmer app, when user submits data:
const farmerSubmission = {
  collectorId: 'COL 2024',
  speciesName: 'Allovera',
  weight: '5 kg',
  moisture: '40%',
  gpsCoordinates: '22.6290°, 88.4412°',
  accuracy: '±162 meters',
  qualityGrade: 'Standard (A)'
};

const result = submitFarmerCollection(farmerSubmission);
if (result.success) {
  console.log('Data submitted to processor dashboard!');
}
*/

export default {
  submitFarmerCollection,
  getFarmerCollections,
  updateFarmerCollectionStatus
};
