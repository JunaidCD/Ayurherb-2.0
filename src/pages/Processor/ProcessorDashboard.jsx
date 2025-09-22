import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const ProcessorDashboard = ({ user, showToast }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [processingForm, setProcessingForm] = useState({
    step: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await api.getBatches();
      setBatches(data);
    } catch (error) {
      showToast('Failed to load batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProcessingStep = async (e) => {
    e.preventDefault();
    
    if (!processingForm.step || !processingForm.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await api.addProcessingStep(selectedBatch.id, processingForm);
      showToast(strings.processing.stepAdded, 'success');
      setShowProcessingModal(false);
      setProcessingForm({ step: '', description: '', notes: '' });
      loadBatches();
    } catch (error) {
      showToast('Failed to add processing step', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-primary-400" />;
      case 'recalled':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'border-primary-500/30 bg-primary-500/10';
      case 'recalled':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-yellow-500/30 bg-yellow-500/10';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-dark-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{strings.processing.title}</h1>
          <p className="text-gray-400">Manage processing workflows and batch operations</p>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} hover className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{batch.herb}</h3>
                  <p className="text-gray-400 text-sm">{batch.id}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border ${getStatusColor(batch.status)} flex items-center gap-2`}>
                {getStatusIcon(batch.status)}
                <span className="text-sm font-medium">{batch.status}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Farmer:</span>
                <span className="text-white">{batch.farmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white">{batch.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity:</span>
                <span className="text-white">{batch.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Harvest Date:</span>
                <span className="text-white">{new Date(batch.harvestDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Processing Steps:</h4>
              <div className="space-y-2">
                {batch.processingSteps?.slice(0, 3).map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      step.status === 'Completed' ? 'bg-primary-400' : 'bg-yellow-400'
                    }`}></div>
                    <span className="text-gray-300">{step.step}</span>
                    <span className="text-gray-500">({step.status})</span>
                  </div>
                ))}
                {batch.processingSteps?.length > 3 && (
                  <p className="text-xs text-gray-500">+{batch.processingSteps.length - 3} more steps</p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBatch(batch);
                setShowProcessingModal(true);
              }}
              className="btn-primary w-full justify-center"
            >
              <Plus className="w-4 h-4" />
              {strings.processing.addStep}
            </button>
          </Card>
        ))}
      </div>

      {/* Processing Modal */}
      <Modal
        isOpen={showProcessingModal}
        onClose={() => setShowProcessingModal(false)}
        title={`${strings.processing.addStep} - ${selectedBatch?.id}`}
      >
        <form onSubmit={handleAddProcessingStep} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {strings.processing.stepType} *
            </label>
            <select
              value={processingForm.step}
              onChange={(e) => setProcessingForm({ ...processingForm, step: e.target.value })}
              className="input-field w-full"
              required
            >
              <option value="">Select processing step...</option>
              {Object.entries(strings.processing.steps).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {strings.processing.description} *
            </label>
            <textarea
              value={processingForm.description}
              onChange={(e) => setProcessingForm({ ...processingForm, description: e.target.value })}
              className="input-field w-full h-24 resize-none"
              placeholder="Describe the processing step..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {strings.processing.notes}
            </label>
            <textarea
              value={processingForm.notes}
              onChange={(e) => setProcessingForm({ ...processingForm, notes: e.target.value })}
              className="input-field w-full h-20 resize-none"
              placeholder="Additional notes (optional)..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowProcessingModal(false)}
              className="btn-secondary flex-1 justify-center"
            >
              {strings.actions.cancel}
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
            >
              {strings.processing.submit}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProcessorDashboard;
