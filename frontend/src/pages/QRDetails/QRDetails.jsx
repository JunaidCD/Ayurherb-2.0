import React from 'react';
import { 
  Package, MapPin, Calendar, Thermometer, Clock, 
  CheckCircle, Shield, Star, Activity, Beaker,
  ArrowLeft, ShoppingCart, CreditCard
} from 'lucide-react';

const QRDetails = ({ onBack }) => {
  const batchData = {
    batchInfo: {
      batchId: "BAT 2024 001",
      herbType: "Allovera",
      location: "21.0397°, 88.4400°",
      quantity: "5 kg",
      quality: "Premium (A++)",
      harvestDate: "2025-09-22"
    },
    dryingProcess: {
      temperature: "20°C",
      duration: "2 hrs",
      progress: "100%"
    },
    labTesting: {
      testType: "Pesticide Screening",
      result: "2 ppm",
      status: "Passed",
      testDate: "9/25/2025"
    },
    verification: {
      status: "Verified on Blockchain",
      blockchainRef: "0xbF73c399",
      certification: "Ayush Certified"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={onBack}
                  className="w-12 h-12 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl flex items-center justify-center border border-slate-600/30 hover:border-primary-500/50 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-300" />
                </button>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                    Product Details
                  </h1>
                  <p className="text-xl text-gray-300 font-light">
                    Complete batch information and verification
                  </p>
                </div>
              </div>
              <div className="text-6xl">🌵</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Batch Information */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary-500/20 to-blue-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-primary-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Batch Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-slate-300 font-medium">Batch ID</span>
                  <span className="text-white font-bold">{batchData.batchInfo.batchId}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-slate-300 font-medium">Herb Type</span>
                  <span className="text-emerald-400 font-bold">{batchData.batchInfo.herbType}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 font-medium">Location</span>
                  </div>
                  <span className="text-white font-bold">{batchData.batchInfo.location}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-slate-300 font-medium">Quantity</span>
                  <span className="text-white font-bold">{batchData.batchInfo.quantity}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300 font-medium">Quality</span>
                  </div>
                  <span className="text-yellow-400 font-bold">{batchData.batchInfo.quality}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300 font-medium">Harvest Date</span>
                  </div>
                  <span className="text-white font-bold">{batchData.batchInfo.harvestDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drying Process */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Drying Process</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <span className="text-slate-300 font-medium">Temperature</span>
                  </div>
                  <span className="text-red-400 font-bold">{batchData.dryingProcess.temperature}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 font-medium">Duration</span>
                  </div>
                  <span className="text-blue-400 font-bold">{batchData.dryingProcess.duration}</span>
                </div>
                
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">Progress</span>
                    <span className="text-emerald-400 font-bold">{batchData.dryingProcess.progress}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-primary-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Testing Results */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                <Beaker className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Lab Testing Results</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <p className="text-slate-400 text-sm mb-1">Test Type</p>
                <p className="text-white font-bold">{batchData.labTesting.testType}</p>
              </div>
              
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <p className="text-slate-400 text-sm mb-1">Result</p>
                <p className="text-blue-400 font-bold">{batchData.labTesting.result}</p>
              </div>
              
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <p className="text-slate-400 text-sm mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <p className="text-emerald-400 font-bold">{batchData.labTesting.status}</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <p className="text-slate-400 text-sm mb-1">Test Date</p>
                <p className="text-white font-bold">{batchData.labTesting.testDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Verification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-300 font-bold">Blockchain Status</p>
                </div>
                <p className="text-emerald-400 font-medium">{batchData.verification.status}</p>
              </div>
              
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-blue-300 font-bold mb-2">Blockchain Reference</p>
                <p className="text-blue-400 font-mono text-sm">{batchData.verification.blockchainRef}</p>
              </div>
              
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-300 font-bold">Certification</p>
                </div>
                <p className="text-yellow-400 font-medium">{batchData.verification.certification}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-500 via-primary-500 to-blue-500 hover:from-emerald-600 hover:via-primary-600 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <ShoppingCart className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Add Item to Cart</span>
          </button>
          
          <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 hover:from-primary-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <CreditCard className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRDetails;
