import React from 'react';
import LabDashboard from './Lab/LabDashboard';

// Simple test wrapper for Lab Dashboard
const TestLabDashboard = () => {
  const mockUser = {
    name: 'Dr. Sarah Wilson',
    role: 'Lab Tester'
  };

  const mockShowToast = (message, type) => {
    console.log(`Toast: ${message} (${type})`);
  };

  return (
    <div>
      <LabDashboard user={mockUser} showToast={mockShowToast} />
    </div>
  );
};

export default TestLabDashboard;
