import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, 
  User, 
  Calendar, 
  Package, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Leaf,
  Phone,
  Mail,
  Award,
  Droplets,
  Bug,
  Dna
} from 'lucide-react';
import Card from '../../components/UI/Card';
import StatusBadge from '../../components/UI/StatusBadge';
import QRViewer from '../../components/UI/QRViewer';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const CustomerPortal = ({ user, showToast }) => {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchId) {
      loadBatchData(batchId);
    }
  }, [batchId]);

  const loadBatchData = async (id) => {
    try {
      setLoading(true);
      const data = await api.getBatchById(id);
      setBatch(data);
    } catch (error) {
      showToast('Batch not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isRecalled = batch?.status?.toLowerCase() === 'recalled';

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-dark-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-dark-700 rounded-xl"></div>
                <div className="h-48 bg-dark-700 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-dark-700 rounded-xl"></div>
                <div className="h-48 bg-dark-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
        <Card className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Batch Not Found</h2>
          <p className="text-gray-400">The requested batch could not be found in our system.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{strings.customer.title}</h1>
              <p className="text-gray-400">Batch ID: {batch.id}</p>
            </div>
          </div>
          <StatusBadge status={batch.status} size="md" />
        </div>

        {/* Recall Alert */}
        {isRecalled && (
          <Card className="border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-400">{strings.customer.recallAlert}</h3>
                <p className="text-red-300">{strings.customer.productRecalled}</p>
                <button className="text-red-400 hover:text-red-300 text-sm underline mt-2">
                  {strings.customer.contactSupport}
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Safety Status */}
        {!isRecalled && (
          <Card className="border-primary-500/30 bg-primary-500/10">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-primary-400" />
              <div>
                <h3 className="text-lg font-semibold text-primary-400">Product Verified</h3>
                <p className="text-primary-300">{strings.customer.productSafe}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Batch Information */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                {strings.customer.batchInfo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Herb:</span>
                    <span className="text-white font-medium">{batch.herb}</span>
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
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality Score:</span>
                    <span className="text-white font-medium">{batch.qualityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{batch.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <StatusBadge status={batch.status} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Processing History */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {strings.customer.processingHistory}
              </h3>
              <div className="space-y-4">
                {batch.processingSteps?.map((step, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-dark-700/50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      step.status === 'Completed' ? 'bg-primary-400' : 'bg-yellow-400'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{step.step}</h4>
                      <p className="text-gray-400 text-sm">{step.date}</p>
                    </div>
                    <StatusBadge status={step.status} size="sm" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Quality Test Results */}
            {batch.labResults && (
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {strings.customer.qualityResults}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-dark-700/50 rounded-lg text-center">
                    <Droplets className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Moisture Content</p>
                    <p className="text-white font-semibold">{batch.labResults.moisture}%</p>
                  </div>
                  <div className="p-4 bg-dark-700/50 rounded-lg text-center">
                    <Bug className={`w-8 h-8 mx-auto mb-2 ${
                      batch.labResults.pesticide === 'Not Detected' ? 'text-primary-400' : 'text-red-400'
                    }`} />
                    <p className="text-gray-400 text-sm">Pesticide Test</p>
                    <p className={`font-semibold ${
                      batch.labResults.pesticide === 'Not Detected' ? 'text-primary-400' : 'text-red-400'
                    }`}>
                      {batch.labResults.pesticide}
                    </p>
                  </div>
                  <div className="p-4 bg-dark-700/50 rounded-lg text-center">
                    <Dna className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">DNA Authentication</p>
                    <p className="text-primary-400 font-semibold">{batch.labResults.dna}</p>
                  </div>
                </div>
                
                {/* AYUSH Compliance */}
                <div className="mt-4 p-4 bg-dark-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className={`w-6 h-6 ${
                        batch.labResults.ayushCompliance ? 'text-primary-400' : 'text-red-400'
                      }`} />
                      <span className="text-white font-medium">AYUSH Compliance</span>
                    </div>
                    <StatusBadge 
                      status={batch.labResults.ayushCompliance ? 'Compliant' : 'Non-Compliant'} 
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <QRViewer batchId={batch.id} />

            {/* Farmer Profile */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {strings.customer.farmerProfile}
              </h3>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-primary-400" />
                </div>
                <h4 className="text-white font-semibold">{batch.farmer}</h4>
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {batch.location}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>farmer@ayurherb.com</span>
                </div>
              </div>
            </Card>

            {/* Traceability Map */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {strings.customer.traceabilityMap}
              </h3>
              <div className="aspect-square bg-dark-700/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Interactive Map</p>
                  <p className="text-gray-500 text-xs">Coming Soon</p>
                </div>
              </div>
            </Card>

            {/* Certifications */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {strings.customer.certifications}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-dark-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-white text-sm">Organic Certified</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-dark-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-white text-sm">AYUSH Approved</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-dark-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-white text-sm">GMP Compliant</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
