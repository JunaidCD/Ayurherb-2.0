// UI Text strings for Ayurherb 2.0

export const strings = {
  // App Title
  appName: 'Ayurherb 2.0',
  appTagline: 'Ayurvedic Supply Chain Management',

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    batches: 'Batches',
    processing: 'Processing',
    labTesting: 'Lab Testing',
    reports: 'Reports',
    collections: 'Collections',
    settings: 'Settings',
    logout: 'Logout'
  },

  // Roles
  roles: {
    admin: 'Admin',
    processor: 'Processor',
    labTester: 'Lab Tester',
    customer: 'Customer'
  },

  // Login Page
  login: {
    title: 'Welcome to Ayurherb 2.0',
    subtitle: 'Select your role to continue',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign In',
    selectRole: 'Select Your Role',
    adminDesc: 'Full system access and analytics',
    processorDesc: 'Manage processing workflows',
    labTesterDesc: 'Quality testing and validation',
    customerDesc: 'Track product provenance'
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back',
    overview: 'System Overview',
    totalCollections: 'Total Collections',
    verifiedBatches: 'Verified Batches',
    recalledBatches: 'Recalled Batches',
    pendingTests: 'Pending Tests',
    recentActivity: 'Recent Activity',
    harvestTrends: 'Harvest Trends Over Time',
    batchDetails: 'Batch Details',
    viewAll: 'View All',
    noData: 'No data available'
  },

  // Batch Management
  batches: {
    title: 'Batch Management',
    searchPlaceholder: 'Search batches...',
    filterByStatus: 'Filter by Status',
    allStatuses: 'All Statuses',
    batchId: 'Batch ID',
    herb: 'Herb',
    farmer: 'Farmer',
    location: 'Location',
    harvestDate: 'Harvest Date',
    quantity: 'Quantity',
    status: 'Status',
    qualityScore: 'Quality Score',
    actions: 'Actions',
    viewDetails: 'View Details',
    addProcessing: 'Add Processing',
    runTests: 'Run Tests'
  },

  // Processing
  processing: {
    title: 'Processing Management',
    addStep: 'Add Processing Step',
    stepType: 'Processing Step',
    description: 'Description',
    date: 'Date',
    notes: 'Notes',
    submit: 'Add Step',
    cancel: 'Cancel',
    steps: {
      harvesting: 'Harvesting',
      cleaning: 'Cleaning',
      drying: 'Drying',
      grinding: 'Grinding',
      packaging: 'Packaging',
      storage: 'Storage',
      shipping: 'Shipping'
    },
    stepAdded: 'Processing step added successfully'
  },

  // Lab Testing
  lab: {
    title: 'Quality Testing',
    addTest: 'Add Test Results',
    testType: 'Test Type',
    moistureContent: 'Moisture Content (%)',
    pesticideTest: 'Pesticide Test',
    dnaAuthentication: 'DNA Authentication',
    ayushCompliance: 'AYUSH Compliance',
    uploadCertificate: 'Upload Certificate',
    testResults: 'Test Results',
    technician: 'Technician',
    testDate: 'Test Date',
    submit: 'Submit Results',
    resultsAdded: 'Test results added successfully',
    dragDropFile: 'Drag and drop files here, or click to select',
    fileUploaded: 'File uploaded successfully'
  },

  // Customer Portal
  customer: {
    title: 'Product Provenance',
    scanQR: 'Scan QR Code',
    batchInfo: 'Batch Information',
    farmerProfile: 'Farmer Profile',
    processingHistory: 'Processing History',
    qualityResults: 'Quality Test Results',
    certifications: 'Certifications',
    traceabilityMap: 'Traceability Map',
    recallAlert: 'Recall Alert',
    productSafe: 'This product is safe for consumption',
    productRecalled: 'This product has been recalled',
    contactSupport: 'Contact Support'
  },

  // Reports
  reports: {
    title: 'Reports & Analytics',
    environmentalImpact: 'Environmental Impact',
    ayushCompliance: 'AYUSH Compliance',
    carbonFootprint: 'Carbon Footprint',
    waterUsage: 'Water Usage',
    sustainabilityScore: 'Sustainability Score',
    complianceScore: 'Compliance Score',
    generateReport: 'Generate Report',
    exportData: 'Export Data',
    downloadPDF: 'Download PDF'
  },

  // Collections
  collections: {
    title: 'Saved Collections',
    farmerSubmissions: 'Farmer Submissions',
    submissionDate: 'Submission Date',
    syncStatus: 'Sync Status',
    viewCollection: 'View Collection',
    syncNow: 'Sync Now',
    markVerified: 'Mark as Verified'
  },

  // Status Labels
  status: {
    queued: 'Queued',
    synced: 'Synced',
    verified: 'Verified',
    recalled: 'Recalled',
    pending: 'Pending',
    completed: 'Completed',
    inProgress: 'In Progress',
    failed: 'Failed'
  },

  // Common Actions
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    add: 'Add',
    update: 'Update',
    submit: 'Submit',
    close: 'Close',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh'
  },

  // Messages
  messages: {
    success: 'Operation completed successfully',
    error: 'An error occurred. Please try again.',
    loading: 'Loading...',
    noResults: 'No results found',
    confirmDelete: 'Are you sure you want to delete this item?',
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
  },

  // Form Validation
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    minLength: 'Minimum length is {min} characters',
    maxLength: 'Maximum length is {max} characters',
    invalidFormat: 'Invalid format'
  }
};

export default strings;
