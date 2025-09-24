import React from 'react';
import Batches from './Batches/Batches';

// Simple test wrapper
const TestBatches = () => {
  const mockUser = {
    name: 'Dr. Sarah Wilson',
    role: 'Lab Tester'
  };

  const mockShowToast = (message, type) => {
    console.log(`Toast: ${message} (${type})`);
  };

  return (
    <div>
      <Batches user={mockUser} showToast={mockShowToast} />
    </div>
  );
};

export default TestBatches;
