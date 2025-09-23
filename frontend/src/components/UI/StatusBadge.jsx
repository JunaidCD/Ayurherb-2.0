import React from 'react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const getStatusStyles = (status) => {
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case 'queued':
        return 'status-queued';
      case 'synced':
        return 'status-synced';
      case 'verified':
        return 'status-verified';
      case 'recalled':
        return 'status-recalled';
      case 'pending':
        return 'status-queued';
      case 'completed':
        return 'status-verified';
      case 'in progress':
      case 'in_progress':
        return 'status-synced';
      case 'failed':
        return 'status-recalled';
      default:
        return 'status-queued';
    }
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`status-badge ${getStatusStyles(status)} ${sizeClasses[size]} font-medium`}>
      {status}
    </span>
  );
};

export default StatusBadge;
