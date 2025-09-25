import React, { useState, useEffect } from 'react';
import { Search, Package, Filter, SortAsc, Eye, Star, MapPin, Calendar, User } from 'lucide-react';
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
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      setSearchLoading(true);
      setTimeout(() => {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchLoading(false);
      }, 500);
    }

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
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="name">Sort by Name</option>
                <option value="quality">Sort by Quality</option>
                <option value="date">Sort by Date</option>
                <option value="farmer">Sort by Farmer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
          <p className="text-gray-400">
            {searchQuery 
              ? `No products match your search "${searchQuery}"`
              : "No products available at the moment"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group transform transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-full">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Product card */}
                <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  
                  {/* Product Image/Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{product.image}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {product.status}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">Batch: {product.batchId}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <User className="w-4 h-4" />
                      <span>{product.farmer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Quality and Quantity */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Quality Score</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">{product.qualityScore || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Quantity</span>
                      <span className="text-white font-semibold">{product.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Grade</span>
                      <span className="text-white font-semibold">{product.qualityGrade || 'Pending'}</span>
                    </div>
                  </div>

                  {/* Processing Steps */}
                  {product.processingSteps && product.processingSteps.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Processing Steps: {product.processingSteps.length}</p>
                      <div className="flex flex-wrap gap-1">
                        {product.processingSteps.slice(0, 3).map((step, idx) => (
                          <span key={idx} className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                            {step.step || step.stepType}
                          </span>
                        ))}
                        {product.processingSteps.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                            +{product.processingSteps.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Button */}
                  <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
