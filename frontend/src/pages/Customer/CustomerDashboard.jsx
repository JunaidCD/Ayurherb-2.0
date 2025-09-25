import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, TrendingUp, History, Package, Heart, Star, 
  Calendar, DollarSign, Award, Leaf, Activity, Bell, 
  ArrowUpRight, ArrowDownRight, Eye, Plus, Minus,
  Clock, MapPin, User, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Card from '../../components/UI/Card';
import { api } from '../../utils/api';

const CustomerDashboard = ({ user, showToast }) => {
  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState(null);
  const [marketTrends, setMarketTrends] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [itemsInBox, setItemsInBox] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    loadDashboardData();
    // Staggered animations
    const timer = setTimeout(() => setAnimationStep(1), 300);
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock customer purchase data
      const mockPurchaseData = {
        totalSpent: 15420,
        totalOrders: 23,
        averageOrderValue: 670,
        loyaltyPoints: 1250,
        monthlySpending: [
          { month: 'Jan', amount: 1200 },
          { month: 'Feb', amount: 1800 },
          { month: 'Mar', amount: 2100 },
          { month: 'Apr', amount: 1650 },
          { month: 'May', amount: 2300 },
          { month: 'Jun', amount: 1950 }
        ]
      };

      // Mock market trends
      const mockMarketTrends = [
        { name: 'Ashwagandha', price: 450, change: +12.5, trend: [420, 435, 440, 450, 465, 450] },
        { name: 'Turmeric', price: 280, change: -5.2, trend: [295, 290, 285, 280, 275, 280] },
        { name: 'Brahmi', price: 380, change: +8.7, trend: [350, 360, 370, 375, 380, 385] },
        { name: 'Neem', price: 220, change: +3.1, trend: [215, 218, 220, 222, 220, 220] },
        { name: 'Tulsi', price: 320, change: -2.8, trend: [330, 325, 322, 320, 318, 320] }
      ];

      // Mock purchase history
      const mockPurchaseHistory = [
        {
          id: 'ORD001',
          date: '2025-09-20',
          items: ['Ashwagandha Powder 500g', 'Turmeric Capsules'],
          total: 1250,
          status: 'Delivered',
          trackingId: 'TRK123456'
        },
        {
          id: 'ORD002',
          date: '2025-09-15',
          items: ['Brahmi Oil 100ml', 'Neem Tablets'],
          total: 890,
          status: 'Delivered',
          trackingId: 'TRK123457'
        },
        {
          id: 'ORD003',
          date: '2025-09-10',
          items: ['Tulsi Tea 250g'],
          total: 450,
          status: 'In Transit',
          trackingId: 'TRK123458'
        },
        {
          id: 'ORD004',
          date: '2025-09-05',
          items: ['Ayurvedic Immunity Kit'],
          total: 2100,
          status: 'Processing',
          trackingId: 'TRK123459'
        }
      ];

      // Mock items in box (current inventory)
      const mockItemsInBox = [
        {
          id: 'ITM001',
          name: 'Ashwagandha Powder',
          quantity: 2,
          unit: '500g bottles',
          expiryDate: '2026-03-15',
          batchId: 'BAT 2024 003',
          status: 'Fresh',
          image: '🌿'
        },
        {
          id: 'ITM002',
          name: 'Turmeric Capsules',
          quantity: 1,
          unit: '60 capsules',
          expiryDate: '2025-12-20',
          batchId: 'BAT-2025-012',
          status: 'Fresh',
          image: '🟡'
        },
        {
          id: 'ITM003',
          name: 'Brahmi Oil',
          quantity: 1,
          unit: '100ml bottle',
          expiryDate: '2025-11-10',
          batchId: 'BAT 2024 004',
          status: 'Expiring Soon',
          image: '🍃'
        },
        {
          id: 'ITM004',
          name: 'Neem Tablets',
          quantity: 3,
          unit: '30 tablets each',
          expiryDate: '2026-01-25',
          batchId: 'BAT-2025-013',
          status: 'Fresh',
          image: '🌱'
        }
      ];

      // Mock recommendations
      const mockRecommendations = [
        {
          id: 'REC001',
          title: 'Immunity Booster Combo',
          description: 'Based on your purchase history, this combo can enhance your immunity',
          products: ['Giloy Tablets', 'Chyawanprash', 'Tulsi Drops'],
          discount: 15,
          image: '🛡️'
        },
        {
          id: 'REC002',
          title: 'Digestive Health Kit',
          description: 'Perfect for maintaining digestive wellness',
          products: ['Triphala Powder', 'Ajwain Tablets', 'Hing Capsules'],
          discount: 20,
          image: '🌿'
        }
      ];

      setPurchaseData(mockPurchaseData);
      setMarketTrends(mockMarketTrends);
      setPurchaseHistory(mockPurchaseHistory);
      setItemsInBox(mockItemsInBox);
      setRecommendations(mockRecommendations);

    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'In Transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Processing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Fresh': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Expiring Soon': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTrendColor = (change) => {
    return change > 0 ? 'text-emerald-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-dark-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-dark-700 rounded-xl"></div>
            <div className="h-80 bg-dark-700 rounded-xl"></div>
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
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.name || 'Customer'}!
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Your wellness journey continues with Ayurherb
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 text-sm font-medium">{purchaseData?.loyaltyPoints} Loyalty Points</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Member since January 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Purchase',
            value: `₹${purchaseData?.totalSpent?.toLocaleString()}`,
            icon: ShoppingCart,
            gradient: 'from-blue-500 to-cyan-500',
            change: '+12.5%',
            changeType: 'positive'
          },
          {
            title: 'Total Orders',
            value: purchaseData?.totalOrders,
            icon: Package,
            gradient: 'from-emerald-500 to-primary-500',
            change: '+8.2%',
            changeType: 'positive'
          },
          {
            title: 'Average Order',
            value: `₹${purchaseData?.averageOrderValue}`,
            icon: DollarSign,
            gradient: 'from-purple-500 to-pink-500',
            change: '+5.3%',
            changeType: 'positive'
          },
          {
            title: 'Loyalty Points',
            value: purchaseData?.loyaltyPoints,
            icon: Award,
            gradient: 'from-yellow-500 to-orange-500',
            change: '+15.7%',
            changeType: 'positive'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`group transform transition-all duration-700 ${
                animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-emerald-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{stat.value}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-semibold text-emerald-400">{stat.change}</span>
                      <span className="text-gray-500 text-xs">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Market Trends */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Recent Market Trends</h3>
                  <p className="text-gray-400 text-sm">Price movements of your favorite herbs</p>
                </div>
                <TrendingUp className="w-6 h-6 text-primary-400" />
              </div>
              
              <div className="space-y-4">
                {marketTrends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-gray-400 text-sm">₹{item.price}/kg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={item.trend.map((value, i) => ({ value, index: i }))}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={item.change > 0 ? "#22c55e" : "#ef4444"}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 ${getTrendColor(item.change)}`}>
                          {item.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          <span className="font-semibold">{Math.abs(item.change)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Spending Chart */}
        <div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Monthly Spending</h3>
                <p className="text-gray-400 text-sm">Your spending pattern</p>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={purchaseData?.monthlySpending}>
                    <defs>
                      <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)'
                      }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fill="url(#spendingGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History & Items in Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Purchase History */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary-500/20 to-blue-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Purchase History</h3>
                <p className="text-gray-400 text-sm">Your recent orders</p>
              </div>
              <History className="w-6 h-6 text-primary-400" />
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {purchaseHistory.map((order, index) => (
                <div key={order.id} className="group flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{order.id}</p>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{order.items.join(', ')}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-xs">{new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-white font-semibold">₹{order.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Items in Box */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Items in Box</h3>
                <p className="text-gray-400 text-sm">Your current inventory</p>
              </div>
              <Package className="w-6 h-6 text-primary-400" />
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {itemsInBox.map((item, index) => (
                <div key={item.id} className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10">
                  <div className="text-3xl">{item.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{item.name}</p>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Qty: {item.quantity} {item.unit}</p>
                    <p className="text-gray-500 text-xs">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <button className="p-2 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg transition-all duration-200">
                      <Eye className="w-4 h-4 text-primary-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 via-blue-500/10 to-emerald-500/10 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Recommended for You</h3>
              <p className="text-gray-400 text-sm">Personalized suggestions based on your wellness journey</p>
            </div>
            <Star className="w-6 h-6 text-primary-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={rec.id} className="group p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{rec.image}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{rec.title}</h4>
                    <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {rec.products.map((product, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">{rec.discount}% OFF</span>
                    <span className="text-gray-400 text-sm">Limited time</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
