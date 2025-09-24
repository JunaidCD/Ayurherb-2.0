import React from 'react';
import { Package } from 'lucide-react';

const Batches = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                Batches
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Processed batch management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-gray-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-12">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              No Processed Batches Yet
            </h2>
            
            <p className="text-xl text-gray-300 font-medium">
              New Processed Batches will appear here
            </p>
            
            <p className="text-gray-400 mt-4 max-w-md mx-auto">
              Once you complete processing steps for batches, they will be displayed on this page for tracking and management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batches;
