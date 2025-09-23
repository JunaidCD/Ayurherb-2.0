import React from 'react';
import { QrCode } from 'lucide-react';
import Card from './Card';

const QRViewer = ({ batchId, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  return (
    <Card className="flex flex-col items-center justify-center text-center" glass>
      <div className={`${sizeClasses[size]} bg-white rounded-lg flex items-center justify-center mb-4`}>
        {/* QR Code placeholder - replace with actual QR code library */}
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg flex items-center justify-center">
          <QrCode className="w-16 h-16 text-gray-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Batch QR Code</h3>
      <p className="text-gray-400 text-sm">Batch ID: {batchId}</p>
      <p className="text-xs text-gray-500 mt-2">
        Scan to view product provenance
      </p>
    </Card>
  );
};

export default QRViewer;
