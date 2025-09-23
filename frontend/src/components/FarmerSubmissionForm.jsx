import React, { useState } from 'react';
import { 
  User, MapPin, Calendar, Scale, Droplets, Award, 
  Plus, CheckCircle, X, Loader
} from 'lucide-react';
import { api } from '../utils/api';

const FarmerSubmissionForm = ({ isOpen, onClose, showToast, onSubmissionSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmer: '',
    herb: '',
    speciesName: '',
    quantity: '',
    weight: '',
    moisture: '',
    gpsCoordinates: '',
    latitude: '',
    longitude: '',
    accuracy: '',
    qualityGrade: 'Standard (A)',
    location: '',
    status: 'Synced'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateGPSCoordinates = () => {
    // Generate random GPS coordinates for demo
    const lat = (Math.random() * (25 - 20) + 20).toFixed(4);
    const lng = (Math.random() * (90 - 70) + 70).toFixed(4);
    const accuracy = Math.floor(Math.random() * 200) + 50;
    
    setFormData(prev => ({
      ...prev,
      latitude: `${lat}°`,
      longitude: `${lng}°`,
      gpsCoordinates: `${lat}°, ${lng}°`,
      accuracy: `±${accuracy} meters`
    }));
  };

  const generateCollectorId = () => {
    // Generate random collector ID
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const collectorId = `COL-${randomNum.toString().padStart(3, '0')}`;
    
    setFormData(prev => ({
      ...prev,
      farmer: collectorId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmer || !formData.herb || !formData.quantity) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const submissionData = {
        ...formData,
        collectionTime: new Date().toLocaleString(),
        submissionDate: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleString()
      };

      const result = await api.addCollection(submissionData);
      
      if (result.success) {
        showToast('Collection submitted successfully!', 'success');
        
        // Reset form
        setFormData({
          farmer: '',
          herb: '',
          speciesName: '',
          quantity: '',
          weight: '',
          moisture: '',
          gpsCoordinates: '',
          latitude: '',
          longitude: '',
          accuracy: '',
          qualityGrade: 'Standard (A)',
          location: '',
          status: 'Synced'
        });
        
        if (onSubmissionSuccess) {
          onSubmissionSuccess(result.collection);
        }
        
        onClose();
      }
    } catch (error) {
      showToast('Failed to submit collection: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Farmer Submission</h2>
              <p className="text-gray-400">Submit new herb collection data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farmer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Collector ID *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="farmer"
                  value={formData.farmer}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="e.g., COL-001"
                  required
                />
                <button
                  type="button"
                  onClick={generateCollectorId}
                  className="px-4 py-3 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 text-primary-300 rounded-xl transition-all duration-200 flex items-center gap-2"
                  title="Generate random collector ID"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Herb Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Herb Type *
              </label>
              <select
                name="herb"
                value={formData.herb}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                required
              >
                <option value="">Select herb type</option>
                <option value="Allovera">Allovera</option>
                <option value="Brahmi">Brahmi</option>
                <option value="Ashwagandha">Ashwagandha</option>
                <option value="Turmeric">Turmeric</option>
                <option value="Neem">Neem</option>
                <option value="Tulsi">Tulsi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Species Name
              </label>
              <input
                type="text"
                name="speciesName"
                value={formData.speciesName || formData.herb}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="Species name (auto-filled)"
              />
            </div>
          </div>

          {/* Quantity and Quality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity/Weight *
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={(e) => {
                  handleInputChange(e);
                  setFormData(prev => ({ ...prev, weight: e.target.value }));
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="e.g., 5 kg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Moisture %
              </label>
              <input
                type="text"
                name="moisture"
                value={formData.moisture}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="e.g., 30%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quality Grade
              </label>
              <select
                name="qualityGrade"
                value={formData.qualityGrade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="Premium (AA)">Premium (AA)</option>
                <option value="Standard (A)">Standard (A)</option>
                <option value="Basic (B)">Basic (B)</option>
              </select>
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">
                GPS Coordinates
              </label>
              <button
                type="button"
                onClick={generateGPSCoordinates}
                className="px-3 py-1 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 rounded-lg text-primary-300 text-sm transition-all duration-200 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Generate GPS
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Latitude"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Longitude"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="accuracy"
                  value={formData.accuracy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Accuracy"
                />
              </div>
            </div>
            {formData.gpsCoordinates && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-gray-400 text-xs mb-1">Combined GPS Coordinates</p>
                <p className="text-white font-semibold">{formData.gpsCoordinates}</p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Collection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerSubmissionForm;
