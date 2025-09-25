import React, { useState } from 'react';
import { Shield, FileCheck, Database, Award, Search, CheckCircle, Thermometer, Timer, Beaker, FileText, Download, Medal } from 'lucide-react';

const VerificationReport = ({ user, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [verificationCheckpoints, setVerificationCheckpoints] = useState({
    batchInfoVerified: false,
    processingStepsVerified: false,
    labResultsVerified: false,
    blockchainReadyVerified: false
  });

  // Mock batch data (same as from Collections page)
  const batchData = {
    'BAT 2024 001': {
      id: 'BAT 2024 001',
      herbType: 'Allovera',
      location: '21.0347°, 88.4400°',
      quantity: '5 kg',
      quality: 'Premium (AA)',
      harvestDate: '2025-09-24',
      processingSteps: {
        type: 'Drying Process',
        temperature: '20°C',
        duration: '2 hrs',
        status: 'Good condition',
        progress: '100%'
      },
      labResults: {
        testType: 'Pesticide Screening',
        result: '2ppm',
        status: 'Passed',
        date: '9/25/2025',
        blockchainTx: '0x8bf3c3a9914b...'
      }
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      showToast('Please enter a batch ID to search', 'warning');
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const batch = batchData[searchQuery.toUpperCase()];
      if (batch) {
        setSearchResults(batch);
        // Reset checkpoints when new batch is found
        setVerificationCheckpoints({
          batchInfoVerified: false,
          processingStepsVerified: false,
          labResultsVerified: false,
          blockchainReadyVerified: false
        });
        showToast(`Batch ${searchQuery} found successfully!`, 'success');
      } else {
        setSearchResults(null);
        showToast(`Batch ${searchQuery} not found`, 'error');
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleCheckpointChange = (checkpoint) => {
    setVerificationCheckpoints(prev => ({
      ...prev,
      [checkpoint]: !prev[checkpoint]
    }));
  };

  const areAllCheckpointsCompleted = () => {
    return Object.values(verificationCheckpoints).every(checkpoint => checkpoint === true);
  };

  const handleVerify = async () => {
    if (!searchResults) return;

    // Check if all checkpoints are completed
    if (!areAllCheckpointsCompleted()) {
      showToast('Please complete all verification checkpoints before proceeding', 'warning');
      return;
    }

    setIsVerifying(true);
    
    try {
      // Show loading state
      showToast('Initiating blockchain verification...', 'info');
      
      // Prepare verification data for blockchain
      const verificationData = {
        batchId: searchResults.id,
        herbType: searchResults.herbType,
        location: searchResults.location,
        quantity: searchResults.quantity,
        quality: searchResults.quality,
        harvestDate: searchResults.harvestDate,
        processingSteps: {
          type: searchResults.processingSteps.type,
          temperature: searchResults.processingSteps.temperature,
          duration: searchResults.processingSteps.duration,
          status: searchResults.processingSteps.status,
          progress: searchResults.processingSteps.progress
        },
        labResults: {
          testType: searchResults.labResults.testType,
          result: searchResults.labResults.result,
          status: searchResults.labResults.status,
          date: searchResults.labResults.date
        },
        verificationTimestamp: new Date().toISOString(),
        verifiedBy: user?.name || 'Admin',
        verificationStatus: 'VERIFIED'
      };

      // Simulate blockchain transaction
      showToast('Creating blockchain transaction...', 'info');
      
      // Simulate API call to blockchain service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 40)}${Math.random().toString(16).substr(2, 24)}`;
      
      // Update the search results with blockchain verification
      setSearchResults(prevResults => ({
        ...prevResults,
        labResults: {
          ...prevResults.labResults,
          blockchainTx: txHash,
          verifiedOnBlockchain: true,
          verificationTimestamp: new Date().toISOString()
        },
        verificationStatus: 'BLOCKCHAIN_VERIFIED'
      }));

      // Store verification in localStorage for persistence
      const verificationRecord = {
        ...verificationData,
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 500000,
        gasUsed: '21000',
        verificationComplete: true
      };
      
      const existingVerifications = JSON.parse(localStorage.getItem('ayurherb_blockchain_verifications') || '[]');
      existingVerifications.push(verificationRecord);
      localStorage.setItem('ayurherb_blockchain_verifications', JSON.stringify(existingVerifications));

      // Set verification details for modal
      setVerificationDetails({
        batchId: searchResults.id,
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 500000,
        timestamp: new Date().toLocaleString(),
        verifiedBy: user?.name || 'Admin'
      });

      // Show verification modal
      setShowVerificationModal(true);

      // Success notification with transaction hash
      showToast(
        `✅ Verified - Batch ${searchResults.id} successfully verified on blockchain!`, 
        'success'
      );
      
      // Log blockchain verification details
      console.log('Blockchain Verification Complete:', {
        batchId: searchResults.id,
        transactionHash: txHash,
        verificationData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Blockchain verification failed:', error);
      showToast('Blockchain verification failed. Please try again.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const generateEnvironmentalReport = () => {
    if (!searchResults || searchResults.verificationStatus !== 'BLOCKCHAIN_VERIFIED') {
      showToast('Please verify the batch first before generating environmental report', 'warning');
      return;
    }

    // Generate environmental impact data
    const reportData = {
      timePeriod: searchResults.harvestDate || '2025-09-24',
      herbSpecies: searchResults.herbType || 'Allovera',
      totalQuantity: searchResults.quantity || '5 kg',
      harvestZones: searchResults.location || '21.0347°, 88.4400°',
      quotaUsage: '150/200 kg (75% used)',
      overHarvestingFlags: 'No',
      sustainabilityIndicators: {
        carbonFootprint: '2.3 kg CO2 equivalent',
        waterFootprint: '45 liters per kg',
        batchRejectionRate: '8% (rule violations)',
        biodiversityImpact: 'Low risk',
        soilHealthIndex: '87/100',
        ecosystemBalance: 'Maintained'
      }
    };

    // Create PDF content as HTML string
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Environmental Impact Report - ${reportData.herbSpecies}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
          .title { color: #10b981; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { color: #6b7280; font-size: 16px; }
          .section { margin-bottom: 25px; }
          .section-title { color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 15px; border-left: 4px solid #10b981; padding-left: 15px; }
          .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
          .data-item { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 3px solid #10b981; }
          .data-label { font-weight: bold; color: #374151; margin-bottom: 5px; }
          .data-value { color: #10b981; font-size: 16px; }
          .sustainability-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; }
          .verified-badge { background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Environmental Impact Report</div>
          <div class="subtitle">Ayurherb 2.0 - Sustainable Herbal Supply Chain</div>
          <div style="margin-top: 15px;">
            <span class="verified-badge">Blockchain Verified</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Harvest Summary</div>
          <div class="data-grid">
            <div class="data-item">
              <div class="data-label">Time Period</div>
              <div class="data-value">${reportData.timePeriod}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Herb/Species Harvested</div>
              <div class="data-value">${reportData.herbSpecies}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Total Quantity Harvested</div>
              <div class="data-value">${reportData.totalQuantity}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Harvest Zones</div>
              <div class="data-value">${reportData.harvestZones}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Quota & Compliance</div>
          <div class="data-grid">
            <div class="data-item">
              <div class="data-label">Quota Usage</div>
              <div class="data-value">${reportData.quotaUsage}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Over-harvesting Flags</div>
              <div class="data-value" style="color: #10b981;">${reportData.overHarvestingFlags}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Sustainability Indicators</div>
          <div class="sustainability-grid">
            <div class="data-item">
              <div class="data-label">Carbon Footprint</div>
              <div class="data-value">${reportData.sustainabilityIndicators.carbonFootprint}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Water Footprint</div>
              <div class="data-value">${reportData.sustainabilityIndicators.waterFootprint}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Batch Rejection Rate</div>
              <div class="data-value">${reportData.sustainabilityIndicators.batchRejectionRate}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Biodiversity Impact</div>
              <div class="data-value">${reportData.sustainabilityIndicators.biodiversityImpact}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Soil Health Index</div>
              <div class="data-value">${reportData.sustainabilityIndicators.soilHealthIndex}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Ecosystem Balance</div>
              <div class="data-value">${reportData.sustainabilityIndicators.ecosystemBalance}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Report ID:</strong> ENV-${Date.now()}</p>
          <p><strong>Blockchain TX:</strong> ${verificationDetails?.transactionHash || 'N/A'}</p>
          <p style="margin-top: 20px; font-style: italic;">
            This report is generated from blockchain-verified data and represents the environmental impact 
            of sustainable herbal harvesting practices in the Ayurherb 2.0 supply chain.
          </p>
        </div>
      </body>
      </html>
    `;

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Environmental_Impact_Report_${reportData.herbSpecies}_${reportData.timePeriod.replace(/-/g, '')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Environmental Impact Report generated successfully!', 'success');
  };

  const generateAYUSHCertificate = () => {
    if (!searchResults || searchResults.verificationStatus !== 'BLOCKCHAIN_VERIFIED') {
      showToast('Please verify the batch first before generating AYUSH compliance certificate', 'warning');
      return;
    }

    // Generate AYUSH certificate data
    const certificateData = {
      batchId: searchResults.id || 'BAT 2024 001',
      collector: searchResults.farmer || 'COL 2024',
      harvestDate: searchResults.harvestDate || '2025-09-24',
      location: searchResults.location || '21.0347°, 88.4400°',
      blockchainProof: verificationDetails?.transactionHash || '0x8c8bf3c3a99d1b1c2a9d4e2f',
      verificationStatus: 'Verified'
    };

    // Create AYUSH Certificate content as HTML string
    const certificateContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AYUSH Compliance Certificate - ${certificateData.batchId}</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            color: #333;
          }
          .certificate-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 8px solid #d4af37;
            border-radius: 20px;
            padding: 60px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
          }
          .certificate-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #d4af37;
            padding-bottom: 30px;
          }
          .ayush-seal {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: linear-gradient(45deg, #d4af37, #f4e47a);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4px solid #b8860b;
            box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
          }
          .seal-content {
            text-align: center;
            color: #8b4513;
            font-weight: bold;
          }
          .seal-text-top {
            font-size: 10px;
            margin-bottom: 2px;
          }
          .seal-ayush {
            font-size: 18px;
            letter-spacing: 2px;
            margin: 2px 0;
          }
          .seal-text-bottom {
            font-size: 8px;
            margin-top: 2px;
          }
          .certificate-title {
            font-size: 32px;
            font-weight: bold;
            color: #1a5f3f;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .certificate-subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 10px;
          }
          .certificate-body {
            margin: 40px 0;
            line-height: 1.8;
          }
          .certificate-text {
            font-size: 16px;
            text-align: center;
            margin-bottom: 30px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
          }
          .detail-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #d4af37;
          }
          .detail-label {
            font-weight: bold;
            color: #1a5f3f;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .detail-value {
            color: #333;
            font-size: 16px;
            font-weight: 600;
          }
          .blockchain-section {
            background: linear-gradient(135deg, #e8f5e8, #d4edda);
            border: 2px solid #28a745;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
          }
          .blockchain-title {
            color: #155724;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 18px;
          }
          .blockchain-hash {
            font-family: 'Courier New', monospace;
            background: #fff;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #28a745;
            word-break: break-all;
            font-size: 12px;
            color: #155724;
          }
          .certificate-footer {
            margin-top: 50px;
            text-align: center;
            border-top: 2px solid #d4af37;
            padding-top: 30px;
          }
          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 40px;
          }
          .signature-box {
            text-align: center;
          }
          .signature-line {
            border-bottom: 2px solid #333;
            margin-bottom: 10px;
            height: 40px;
          }
          .signature-label {
            font-weight: bold;
            color: #1a5f3f;
          }
          .certificate-number {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 12px;
            color: #666;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(212, 175, 55, 0.1);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="certificate-number">Certificate No: AYUSH-${Date.now()}</div>
          <div class="watermark">VERIFIED</div>
          
          <div class="certificate-header">
            <div class="ayush-seal">
              <div class="seal-content">
                <div class="seal-text-top">Quality you can Trust</div>
                <div class="seal-ayush">AYUSH</div>
                <div class="seal-text-bottom">Premium</div>
              </div>
            </div>
            <div class="certificate-title">AYUSH Compliance Certificate</div>
            <div class="certificate-subtitle">Ministry of AYUSH, Government of India</div>
            <div class="certificate-subtitle">Ayurherb 2.0 - Blockchain Verified Supply Chain</div>
          </div>

          <div class="certificate-body">
            <div class="certificate-text">
              This is to certify that the herbal batch mentioned below has been verified and complies with 
              AYUSH quality standards and regulations for medicinal plants and herbal products.
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Batch ID</div>
                <div class="detail-value">${certificateData.batchId}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Collector</div>
                <div class="detail-value">${certificateData.collector}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Harvest Date</div>
                <div class="detail-value">${certificateData.harvestDate}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${certificateData.location}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Verification Status</div>
                <div class="detail-value" style="color: #28a745;">${certificateData.verificationStatus}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Certificate Date</div>
                <div class="detail-value">${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div class="blockchain-section">
              <div class="blockchain-title">Blockchain Verification Proof</div>
              <p style="margin: 10px 0; color: #155724;">
                This certificate is backed by immutable blockchain technology ensuring authenticity and traceability.
              </p>
              <div class="blockchain-hash">
                Transaction Hash: ${certificateData.blockchainProof}
              </div>
            </div>

            <div class="certificate-text" style="margin-top: 30px; font-style: italic;">
              This certificate validates that the herbal batch has undergone rigorous quality checks, 
              laboratory testing, and compliance verification as per AYUSH guidelines for medicinal plants.
            </div>
          </div>

          <div class="certificate-footer">
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Authorized Signatory</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">AYUSH Compliance Officer</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Digital Verification</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">Blockchain Verified</div>
              </div>
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; color: #666;">
              <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Valid until:</strong> ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}</p>
              <p style="margin-top: 15px; font-style: italic;">
                This is a digitally generated certificate. For verification, please visit ayurherb.gov.in
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download certificate
    const blob = new Blob([certificateContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AYUSH_Compliance_Certificate_${certificateData.batchId}_${certificateData.harvestDate.replace(/-/g, '')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('AYUSH Compliance Certificate generated successfully!', 'success');
  };

  return (
    <div className="space-y-8 p-6">
      {/* Modern Header with Glassmorphism */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-emerald-200 to-blue-300 bg-clip-text text-transparent mb-2">
                  Verification & Report
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Comprehensive verification and reporting system for supply chain integrity
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">Verification Active</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-2xl blur-lg"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Search className="w-6 h-6 text-emerald-400" />
            Batch Verification Search
          </h2>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Batch ID (e.g., BAT 2024 001)"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            
            {/* Batch Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-60"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <FileCheck className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-blue-300 bg-clip-text text-transparent">
                    {searchResults.id}
                  </h2>
                  <p className="text-gray-300 font-medium">{searchResults.herbType} - Batch Verification Details</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {searchResults.verificationStatus === 'BLOCKCHAIN_VERIFIED' ? (
                  <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">✅ Verified - {searchResults.id}</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <span className="text-emerald-300 text-sm font-medium">Ready for Verification</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Batch Information</h3>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Batch ID:</span>
                      <span className="text-white font-semibold">{searchResults.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Herb Type:</span>
                      <span className="text-white font-semibold">{searchResults.herbType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Location:</span>
                      <span className="text-white font-semibold">{searchResults.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quantity:</span>
                      <span className="text-white font-semibold">{searchResults.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quality:</span>
                      <span className="text-white font-semibold">{searchResults.quality}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Harvest Date:</span>
                      <span className="text-white font-semibold">{searchResults.harvestDate}</span>
                    </div>
                  </div>
                </div>

                {/* Processing Details */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Thermometer className="w-5 h-5 text-orange-400" />
                    <h4 className="text-lg font-bold text-white">{searchResults.processingSteps.type}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-orange-300 text-sm mb-1">Temperature</div>
                      <div className="text-white font-bold">{searchResults.processingSteps.temperature}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-300 text-sm mb-1">Duration</div>
                      <div className="text-white font-bold">{searchResults.processingSteps.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-300 text-sm mb-1">Progress</div>
                      <div className="text-white font-bold">{searchResults.processingSteps.progress}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Lab Testing Results</h3>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Test Type:</span>
                      <span className="text-white font-semibold">{searchResults.labResults.testType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Result:</span>
                      <span className="text-white font-semibold">{searchResults.labResults.result}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Status:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {searchResults.labResults.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Test Date:</span>
                      <span className="text-white font-semibold">{searchResults.labResults.date}</span>
                    </div>
                  </div>

                  {/* Blockchain Verification */}
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 font-medium">Verified on Blockchain</span>
                      </div>
                      <span className="text-sm font-mono text-gray-400">{searchResults.labResults.blockchainTx}</span>
                    </div>
                  </div>
                </div>

                {/* Verification Checkpoints */}
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Verification Checkpoints
                  </h4>
                  
                  <div className="space-y-3 mb-6">
                    {/* Batch Information Checkpoint */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
                      <input
                        type="checkbox"
                        id="batchInfo"
                        checked={verificationCheckpoints.batchInfoVerified}
                        onChange={() => handleCheckpointChange('batchInfoVerified')}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <label htmlFor="batchInfo" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Batch information accuracy verified (ID, herb type, location, quantity, quality)
                      </label>
                      {verificationCheckpoints.batchInfoVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    {/* Processing Steps Checkpoint */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
                      <input
                        type="checkbox"
                        id="processingSteps"
                        checked={verificationCheckpoints.processingStepsVerified}
                        onChange={() => handleCheckpointChange('processingStepsVerified')}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <label htmlFor="processingSteps" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Processing steps completed and documented (temperature, duration, progress)
                      </label>
                      {verificationCheckpoints.processingStepsVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    {/* Lab Results Checkpoint */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
                      <input
                        type="checkbox"
                        id="labResults"
                        checked={verificationCheckpoints.labResultsVerified}
                        onChange={() => handleCheckpointChange('labResultsVerified')}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <label htmlFor="labResults" className="text-white text-sm font-medium cursor-pointer flex-1">
                        Lab test results reviewed and approved (pesticide screening passed)
                      </label>
                      {verificationCheckpoints.labResultsVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    {/* Blockchain Ready Checkpoint */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
                      <input
                        type="checkbox"
                        id="blockchainReady"
                        checked={verificationCheckpoints.blockchainReadyVerified}
                        onChange={() => handleCheckpointChange('blockchainReadyVerified')}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <label htmlFor="blockchainReady" className="text-white text-sm font-medium cursor-pointer flex-1">
                        All data verified and ready for blockchain immutable record
                      </label>
                      {verificationCheckpoints.blockchainReadyVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Verify Button */}
                <div className="mt-6">
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || !areAllCheckpointsCompleted()}
                    className={`w-full px-6 py-4 ${
                      isVerifying 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed' 
                        : !areAllCheckpointsCompleted()
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
                    } text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying on Blockchain...
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6" />
                        {areAllCheckpointsCompleted() ? 'Verify Batch' : 'Complete All Checkpoints'}
                      </>
                    )}
                  </button>
                </div>

                {/* Environmental Impact Report Button */}
                <div className="mt-4">
                  <button
                    onClick={generateEnvironmentalReport}
                    disabled={!searchResults || searchResults.verificationStatus !== 'BLOCKCHAIN_VERIFIED'}
                    className={`w-full px-6 py-4 ${
                      searchResults && searchResults.verificationStatus === 'BLOCKCHAIN_VERIFIED'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
                    } text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                  >
                    <FileText className="w-6 h-6" />
                    <span>Generate Environmental Impact Report</span>
                    <Download className="w-5 h-5" />
                  </button>
                  {(!searchResults || searchResults.verificationStatus !== 'BLOCKCHAIN_VERIFIED') && (
                    <p className="text-gray-400 text-sm text-center mt-2">
                      ⚠️ Batch must be verified before generating environmental report
                    </p>
                  )}
                </div>

                {/* AYUSH Compliance Certificate Button */}
                <div className="mt-4">
                  <button
                    onClick={generateAYUSHCertificate}
                    disabled={!searchResults || searchResults.verificationStatus !== 'BLOCKCHAIN_VERIFIED'}
                    className={`w-full px-6 py-4 ${
                      searchResults && searchResults.verificationStatus === 'BLOCKCHAIN_VERIFIED'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
                    } text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                  >
                    <Medal className="w-6 h-6" />
                    <span>Generate AYUSH Compliance Certificate</span>
                    <Award className="w-5 h-5" />
                  </button>
                  {(!searchResults || searchResults.verificationStatus !== 'BLOCKCHAIN_VERIFIED') && (
                    <p className="text-gray-400 text-sm text-center mt-2">
                      ⚠️ Batch must be verified before generating AYUSH certificate
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State (when no search results) */}
      {!searchResults && !isSearching && (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Search for Batch Verification</h3>
            <p className="text-gray-400 text-lg">Enter a batch ID above to view verification details</p>
          </div>
        </div>
      )}

      {/* Verification Success Modal */}
      {showVerificationModal && verificationDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-green-500/30 to-blue-500/30 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              
              {/* Success Icon */}
              <div className="text-center mb-6">
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur opacity-60"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verification Complete!</h2>
                <p className="text-emerald-300 text-lg font-semibold">✅ Batch {verificationDetails.batchId} Verified</p>
              </div>

              {/* Verification Details */}
              <div className="space-y-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Batch ID:</span>
                      <span className="text-white font-semibold">{verificationDetails.batchId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Transaction Hash:</span>
                      <span className="text-emerald-400 font-mono text-xs">{verificationDetails.transactionHash.substring(0, 20)}...</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Block Number:</span>
                      <span className="text-white font-semibold">#{verificationDetails.blockNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Verified By:</span>
                      <span className="text-white font-semibold">{verificationDetails.verifiedBy}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Timestamp:</span>
                      <span className="text-white font-semibold text-xs">{verificationDetails.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Status */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 font-medium">Successfully recorded on blockchain</span>
                  </div>
                  <p className="text-emerald-200 text-sm mt-2">
                    This verification is now immutable and permanently stored on the blockchain network.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowVerificationModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <CheckCircle className="w-5 h-5" />
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationReport;
