import React, { useState, useEffect } from 'react';
import { Plus, Beaker, Upload, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const LabDashboard = ({ user, showToast }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [testForm, setTestForm] = useState({
    moistureContent: '',
    pesticideTest: 'Not Detected',
    dnaAuthentication: 'Confirmed',
    ayushCompliance: true,
    certificate: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const uploadResult = await api.uploadFile(file);
      setTestForm({ ...testForm, certificate: uploadResult });
      setUploadProgress(100);
      showToast(strings.lab.fileUploaded, 'success');
    } catch (error) {
      showToast('File upload failed', 'error');
      setUploadProgress(0);
    }
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    
    if (!testForm.moistureContent) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await api.addLabResult(selectedBatch.id, testForm);
      showToast(strings.lab.resultsAdded, 'success');
      setShowTestModal(false);
      setTestForm({
        moistureContent: '',
        pesticideTest: 'Not Detected',
        dnaAuthentication: 'Confirmed',
        ayushCompliance: true,
        certificate: null
      });
      setUploadProgress(0);
      loadBatches();
    } catch (error) {
      showToast('Failed to submit test results', 'error');
    }
  };

  const getTestStatusIcon = (batch) => {
    if (batch.labResults) {
      return <CheckCircle className="w-5 h-5 text-primary-400" />;
    }
    return <Clock className="w-5 h-5 text-yellow-400" />;
  };

  const getTestStatusColor = (batch) => {
    if (batch.labResults) {
      return 'border-primary-500/30 bg-primary-500/10';
    }
    return 'border-yellow-500/30 bg-yellow-500/10';
  };

  const getComplianceStatus = (batch) => {
    if (!batch.labResults) return 'Pending';
    return batch.labResults.ayushCompliance ? 'Compliant' : 'Non-Compliant';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-dark-700 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-white mb-2">{strings.lab.title}</h1>
          <p className="text-gray-400">Manage quality testing and laboratory results</p>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} hover className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{batch.herb}</h3>
                  <p className="text-gray-400 text-sm">{batch.id}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border ${getTestStatusColor(batch)} flex items-center gap-2`}>
                {getTestStatusIcon(batch)}
                <span className="text-sm font-medium">
                  {batch.labResults ? 'Tested' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Farmer:</span>
                <span className="text-white">{batch.farmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity:</span>
                <span className="text-white">{batch.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quality Score:</span>
                <span className="text-white">{batch.qualityScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AYUSH Status:</span>
                <span className={`text-sm font-medium ${
                  getComplianceStatus(batch) === 'Compliant' ? 'text-primary-400' : 
                  getComplianceStatus(batch) === 'Non-Compliant' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {getComplianceStatus(batch)}
                </span>
              </div>
            </div>

            {/* Lab Results */}
            {batch.labResults && (
              <div className="mb-4 p-3 bg-dark-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">{strings.lab.testResults}:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moisture:</span>
                    <span className="text-white">{batch.labResults.moisture}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pesticide:</span>
                    <span className={`${
                      batch.labResults.pesticide === 'Not Detected' ? 'text-primary-400' : 'text-red-400'
                    }`}>
                      {batch.labResults.pesticide}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">DNA:</span>
                    <span className="text-primary-400">{batch.labResults.dna}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedBatch(batch);
                setShowTestModal(true);
              }}
              className="btn-primary w-full justify-center"
              disabled={batch.labResults}
            >
              <Plus className="w-4 h-4" />
              {batch.labResults ? 'Results Added' : strings.lab.addTest}
            </button>
          </Card>
        ))}
      </div>

      {/* Test Results Modal */}
      <Modal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        title={`${strings.lab.addTest} - ${selectedBatch?.id}`}
        size="lg"
      >
        <form onSubmit={handleSubmitTest} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {strings.lab.moistureContent} *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={testForm.moistureContent}
                onChange={(e) => setTestForm({ ...testForm, moistureContent: e.target.value })}
                className="input-field w-full"
                placeholder="e.g., 8.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {strings.lab.pesticideTest}
              </label>
              <select
                value={testForm.pesticideTest}
                onChange={(e) => setTestForm({ ...testForm, pesticideTest: e.target.value })}
                className="input-field w-full"
              >
                <option value="Not Detected">Not Detected</option>
                <option value="Detected">Detected</option>
                <option value="Trace Amounts">Trace Amounts</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {strings.lab.dnaAuthentication}
              </label>
              <select
                value={testForm.dnaAuthentication}
                onChange={(e) => setTestForm({ ...testForm, dnaAuthentication: e.target.value })}
                className="input-field w-full"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not Confirmed">Not Confirmed</option>
                <option value="Inconclusive">Inconclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {strings.lab.ayushCompliance}
              </label>
              <select
                value={testForm.ayushCompliance}
                onChange={(e) => setTestForm({ ...testForm, ayushCompliance: e.target.value === 'true' })}
                className="input-field w-full"
              >
                <option value="true">Compliant</option>
                <option value="false">Non-Compliant</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {strings.lab.uploadCertificate}
            </label>
            <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-primary-500/50 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="certificate-upload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="certificate-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">{strings.lab.dragDropFile}</p>
                {testForm.certificate && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-primary-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{testForm.certificate.fileName}</span>
                  </div>
                )}
              </label>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2 w-full bg-dark-600 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowTestModal(false)}
              className="btn-secondary flex-1 justify-center"
            >
              {strings.actions.cancel}
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
            >
              {strings.lab.submit}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LabDashboard;
