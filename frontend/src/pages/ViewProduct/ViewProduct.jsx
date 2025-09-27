import React, { useState, useEffect } from 'react';
import { Search, Package, Filter, SortAsc, Eye, Star, MapPin, Calendar, User, Activity, Shield } from 'lucide-react';
import Card from '../../components/UI/Card';
import { api } from '../../utils/api';

const ViewProduct = ({ user, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products, sortBy, filterBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Get batches as products
      const batches = await api.getBatches();
      const processedBatches = await api.getProcessedBatches();
      
      // Combine and format as products
      const allProducts = [...batches, ...processedBatches].map(batch => ({
        id: batch.id,
        name: batch.herb,
        batchId: batch.batchId,
        farmer: batch.farmer,
        location: batch.location,
        quantity: batch.quantity,
        qualityScore: batch.qualityScore,
        qualityGrade: batch.qualityGrade,
        harvestDate: batch.harvestDate,
        status: batch.status,
        moisture: batch.moisture,
        processingSteps: batch.processingSteps || [],
        image: getProductImage(batch.herb)
      }));

      // Remove duplicates based on batchId
      const uniqueProducts = allProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.batchId === product.batchId)
      );

      setProducts(uniqueProducts);
    } catch (error) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (herbName) => {
    const images = {
      'Ashwagandha': '🌿',
      'Turmeric': '🟡',
      'Brahmi': '🍃',
      'Neem': '🌱',
      'Tulsi': '🌿',
      'Ginger': '🫚',
      'Allovera': '🌵'
    };
    return images[herbName] || '🌿';
  };

  const filterProducts = () => {
    // If no search query, show empty results to display search message
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Search filter
    setSearchLoading(true);
    setTimeout(() => {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Status filter
      if (filterBy !== 'all') {
        filtered = filtered.filter(product => 
          product.status.toLowerCase() === filterBy.toLowerCase()
        );
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'quality':
            return (b.qualityScore || 0) - (a.qualityScore || 0);
          case 'date':
            return new Date(b.harvestDate) - new Date(a.harvestDate);
          case 'farmer':
            return a.farmer.localeCompare(b.farmer);
          default:
            return 0;
        }
      });

      setFilteredProducts(filtered);
      setSearchLoading(false);
    }, 500);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAloveraClick = () => {
    const aloveraData = {
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
    
    setQrData(aloveraData);
    setShowQRModal(true);
  };

  const generateQRCodeURL = (data) => {
    // Create formatted text data for QR code
    const qrText = `🌿 AYURHERB PRODUCT DETAILS 🌿

📦 BATCH INFORMATION:
Batch ID: ${data.batchInfo.batchId}
Herb Type: ${data.batchInfo.herbType}
Location: ${data.batchInfo.location}
Quantity: ${data.batchInfo.quantity}
Quality: ${data.batchInfo.quality}
Harvest Date: ${data.batchInfo.harvestDate}

🔥 DRYING PROCESS:
Temperature: ${data.dryingProcess.temperature}
Duration: ${data.dryingProcess.duration}
Progress: ${data.dryingProcess.progress}

🧪 LAB TESTING RESULTS:
Test Type: ${data.labTesting.testType}
Result: ${data.labTesting.result}
Status: ${data.labTesting.status}
Test Date: ${data.labTesting.testDate}

🔐 VERIFICATION:
${data.verification.status}
Blockchain Ref: ${data.verification.blockchainRef}
${data.verification.certification}

Authentic Ayurvedic Product
Quality Assured
Blockchain Verified`;
    
    const encodedData = encodeURIComponent(qrText);
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&ecc=M&data=${encodedData}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'verified': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'processing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'completed': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[status.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/3 mb-6"></div>
          <div className="h-16 bg-dark-700 rounded-xl mb-6"></div>
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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  View Products
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Search and explore our ayurvedic product catalog
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300 text-sm font-medium">{filteredProducts.length} Products Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 via-blue-500/10 to-emerald-500/10 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 ${searchLoading ? 'animate-spin' : ''} text-gray-400`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search product name, batch ID, farmer, or location..."
                className="w-full pl-12 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            {searchQuery && (
              <div className="mt-3 text-sm text-gray-400">
                {searchLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    Searching products...
                  </span>
                ) : (
                  <span>Found {filteredProducts.length} products matching "{searchQuery}"</span>
                )}
              </div>
            )}
          </div>

          {/* Advanced Filters and Sort */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Advanced Filter Dropdown */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-lg group-hover:border-blue-500/50 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/30 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <Filter className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                </div>
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="appearance-none bg-transparent text-white font-semibold text-sm cursor-pointer focus:outline-none pr-8 min-w-[120px]"
                  >
                    <option value="all" className="bg-slate-800 text-white py-2">🌟 All Status</option>
                    <option value="verified" className="bg-slate-800 text-white py-2">✅ Verified</option>
                    <option value="processing" className="bg-slate-800 text-white py-2">⚡ Processing</option>
                    <option value="pending" className="bg-slate-800 text-white py-2">⏳ Pending</option>
                    <option value="completed" className="bg-slate-800 text-white py-2">🎉 Completed</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md flex items-center justify-center border border-blue-500/30">
                      <svg className="w-3 h-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Sort Dropdown */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-lg group-hover:border-emerald-500/50 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-primary-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30 group-hover:from-emerald-500/30 group-hover:to-primary-500/30 transition-all duration-300">
                  <SortAsc className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent text-white font-semibold text-sm cursor-pointer focus:outline-none pr-8 min-w-[140px]"
                  >
                    <option value="name" className="bg-slate-800 text-white py-2">🔤 Sort by Name</option>
                    <option value="quality" className="bg-slate-800 text-white py-2">⭐ Sort by Quality</option>
                    <option value="date" className="bg-slate-800 text-white py-2">📅 Sort by Date</option>
                    <option value="farmer" className="bg-slate-800 text-white py-2">👨‍🌾 Sort by Farmer</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500/20 to-primary-500/20 rounded-md flex items-center justify-center border border-emerald-500/30">
                      <svg className="w-3 h-3 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Results Counter */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg border border-slate-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm font-medium">
                {searchQuery ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Product' : 'Products'}` : 'Start searching...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          {!searchQuery ? (
            // Search prompt when no search query
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white/5 via-white/2 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
                <div className="relative mb-8">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/30 to-emerald-500/30 rounded-3xl blur opacity-50 animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-primary-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto border border-primary-500/30 backdrop-blur-sm">
                    <Search className="w-16 h-16 text-primary-400" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-4">
                  Search for Products
                </h3>
                
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  Start typing in the search bar above to discover our premium ayurvedic products
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {['Ashwagandha', 'Turmeric', 'Brahmi', 'Neem', 'Allovera'].map((suggestion, index) => (
                    <div
                      key={suggestion}
                      onClick={suggestion === 'Allovera' ? handleAloveraClick : undefined}
                      className={`group px-4 py-2 bg-gradient-to-r from-primary-500/20 to-emerald-500/20 hover:from-primary-500/30 hover:to-emerald-500/30 border border-primary-500/30 hover:border-primary-500/50 rounded-full text-primary-300 hover:text-primary-200 font-medium transition-all duration-300 transform hover:scale-105 ${
                        suggestion === 'Allovera' ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="relative">Try "{suggestion}"</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Search by name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span>Search by farmer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span>Search by location</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // No results found for search query
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white/5 via-white/2 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
                  <Package className="w-12 h-12 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
                <p className="text-gray-300 mb-6">
                  No products match your search "<span className="text-primary-400 font-semibold">{searchQuery}</span>"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <div className="relative h-full overflow-hidden">
                {/* Enhanced Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400/20 via-blue-400/20 to-emerald-400/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                
                {/* Enhanced Product card */}
                <div className="relative h-full bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 backdrop-blur-2xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl group-hover:border-primary-500/30 transition-all duration-500">
                  
                  {/* Card Header with gradient background */}
                  <div className="relative bg-gradient-to-r from-primary-500/10 via-blue-500/10 to-emerald-500/10 p-6 border-b border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      {/* Enhanced Product Icon */}
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/30 to-emerald-500/30 rounded-2xl blur opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-primary-500/30 backdrop-blur-sm">
                          <span className="text-4xl filter drop-shadow-lg">{product.image}</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Status Badge */}
                      <div className={`relative px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-sm ${getStatusColor(product.status)} shadow-lg`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full"></div>
                        <span className="relative">{product.status}</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-2xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2 group-hover:from-primary-300 group-hover:to-emerald-400 transition-all duration-500">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">Batch: <span className="text-primary-400">{product.batchId}</span></p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Product Details with enhanced icons */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-700/50 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-slate-300 font-medium">{product.farmer}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-700/50 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-slate-300 font-medium">{product.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:bg-slate-700/50 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                          <Calendar className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-slate-300 font-medium">{new Date(product.harvestDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Enhanced Quality Metrics */}
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-slate-600/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400 font-medium">Quality Score</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-300 font-bold text-sm">{product.qualityScore || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400 font-medium">Quantity</span>
                        <span className="text-white font-bold bg-primary-500/20 px-3 py-1 rounded-lg border border-primary-500/30">{product.quantity}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400 font-medium">Grade</span>
                        <span className="text-emerald-300 font-bold bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/30">{product.qualityGrade || 'Pending'}</span>
                      </div>
                    </div>

                    {/* Enhanced Processing Steps */}
                    {product.processingSteps && product.processingSteps.length > 0 && (
                      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-primary-500/30">
                            <Activity className="w-3 h-3 text-primary-400" />
                          </div>
                          <p className="text-sm text-slate-300 font-semibold">Processing Steps: {product.processingSteps.length}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.processingSteps.slice(0, 3).map((step, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gradient-to-r from-primary-500/20 to-blue-500/20 text-primary-300 text-xs font-medium rounded-full border border-primary-500/30 hover:from-primary-500/30 hover:to-blue-500/30 transition-all duration-300">
                              {step.step || step.stepType}
                            </span>
                          ))}
                          {product.processingSteps.length > 3 && (
                            <span className="px-3 py-1 bg-gradient-to-r from-slate-600/50 to-slate-500/50 text-slate-300 text-xs font-medium rounded-full border border-slate-500/30">
                              +{product.processingSteps.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Action Button */}
                  <div className="p-6 pt-0">
                    <button className="group/btn w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-primary-500 via-blue-500 to-emerald-500 hover:from-primary-600 hover:via-blue-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-[1.02]">
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      
                      <div className="relative flex items-center gap-3">
                        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                          <Eye className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold tracking-wide">View Details</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              
              {/* Close Button */}
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200"
              >
                ✕
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Allovera Product Details
                </h3>
                <p className="text-gray-300 text-sm">Scan the QR code to see details</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white/20 rounded-2xl blur"></div>
                  <div className="relative bg-white p-4 rounded-2xl">
                    <img 
                      src={generateQRCodeURL(qrData)} 
                      alt="QR Code for Allovera Details"
                      className="w-80 h-80 object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* QR Instructions */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-emerald-300 font-medium text-sm">
                    Scan with any QR code reader
                  </p>
                </div>
                <p className="text-slate-400 text-xs">
                  The QR code contains complete product details and verification information
                </p>
              </div>

              {/* Product Details Preview */}
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-slate-600/30 mb-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  Batch Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch ID:</span>
                    <span className="text-white font-medium">{qrData.batchInfo.batchId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Herb Type:</span>
                    <span className="text-white font-medium">{qrData.batchInfo.herbType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quality:</span>
                    <span className="text-emerald-400 font-medium">{qrData.batchInfo.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quantity:</span>
                    <span className="text-white font-medium">{qrData.batchInfo.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-primary-500 hover:from-emerald-600 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105">
                  <Package className="w-4 h-4" />
                  Add Item to Cart
                </button>
                
                <button className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105">
                  <Star className="w-4 h-4" />
                  Buy Now
                </button>
              </div>

              {/* Verification Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium text-sm">Blockchain Verified • Ayush Certified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
