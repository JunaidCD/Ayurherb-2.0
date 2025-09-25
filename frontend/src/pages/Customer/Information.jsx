import React, { useState } from 'react';
import { 
  MapPin, CreditCard, MessageSquare, RotateCcw, FileText, 
  User, Phone, Mail, Home, Star, Calendar, Package,
  CheckCircle, AlertCircle, Info, Shield, Clock, Truck
} from 'lucide-react';

const Information = ({ user, showToast }) => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('credit-card');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnProduct, setReturnProduct] = useState('');

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }
    showToast('Feedback submitted successfully!', 'success');
    setFeedbackRating(0);
    setFeedbackText('');
  };

  const handleReturnRequest = () => {
    if (!returnProduct || !returnReason) {
      showToast('Please fill all return details', 'error');
      return;
    }
    showToast('Return request submitted successfully!', 'success');
    setReturnProduct('');
    setReturnReason('');
  };

  const paymentModes = [
    { id: 'credit-card', name: 'Credit Card', icon: CreditCard, description: 'Visa, MasterCard, American Express' },
    { id: 'debit-card', name: 'Debit Card', icon: CreditCard, description: 'All major debit cards accepted' },
    { id: 'upi', name: 'UPI', icon: Phone, description: 'PhonePe, Google Pay, Paytm' },
    { id: 'net-banking', name: 'Net Banking', icon: Home, description: 'All major banks supported' },
    { id: 'cod', name: 'Cash on Delivery', icon: Package, description: 'Pay when you receive' }
  ];

  const returnPolicies = [
    {
      title: 'Return Window',
      description: 'Products can be returned within 30 days of delivery',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      title: 'Product Condition',
      description: 'Items must be unopened, unused, and in original packaging',
      icon: Package,
      color: 'text-emerald-400'
    },
    {
      title: 'Quality Issues',
      description: 'Damaged or defective products are eligible for immediate return',
      icon: Shield,
      color: 'text-orange-400'
    },
    {
      title: 'Refund Process',
      description: 'Refunds are processed within 5-7 business days after return approval',
      icon: CreditCard,
      color: 'text-purple-400'
    },
    {
      title: 'Return Shipping',
      description: 'Free return shipping for quality issues, customer pays for other returns',
      icon: Truck,
      color: 'text-cyan-400'
    },
    {
      title: 'Prescription Products',
      description: 'Ayurvedic medicines cannot be returned once opened for safety reasons',
      icon: AlertCircle,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Info className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-primary-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                Account Information
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Manage your account details, preferences, and policies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Your Address Section */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Your Address</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl border border-slate-600/30">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold mb-1">Primary Address</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Kaikhali, Kolkata, India<br />
                      PIN: 700052<br />
                      West Bengal
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{user?.name || 'Junaid'}</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">+91 98765 43210</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">junaid@ayurherb.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Default Payment Mode */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Default Payment Mode</h3>
            </div>
            
            <div className="space-y-3">
              {paymentModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setSelectedPaymentMode(mode.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedPaymentMode === mode.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50'
                        : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-700/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedPaymentMode === mode.id
                          ? 'bg-purple-500/30 border border-purple-500/50'
                          : 'bg-slate-700/50'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          selectedPaymentMode === mode.id ? 'text-purple-300' : 'text-slate-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          selectedPaymentMode === mode.id ? 'text-white' : 'text-slate-300'
                        }`}>
                          {mode.name}
                        </p>
                        <p className="text-slate-400 text-xs">{mode.description}</p>
                      </div>
                      {selectedPaymentMode === mode.id && (
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary-500/20 to-blue-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-primary-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Product Feedback</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rate Your Experience</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        star <= feedbackRating
                          ? 'bg-yellow-500/20 border border-yellow-500/50'
                          : 'bg-slate-700/50 border border-slate-600/30 hover:bg-slate-600/50'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${
                        star <= feedbackRating ? 'text-yellow-400 fill-current' : 'text-slate-400'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your experience with our products..."
                  className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
                />
              </div>
              
              <button
                onClick={handleFeedbackSubmit}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-primary-500 hover:from-emerald-600 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-slate-600/30">
              <h4 className="text-white font-semibold mb-3">Recent Feedback</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">2 days ago</span>
                  </div>
                  <p className="text-slate-300 text-sm">Excellent quality Ashwagandha powder. Very satisfied!</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                      <Star className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-xs text-slate-400">1 week ago</span>
                  </div>
                  <p className="text-slate-300 text-sm">Good packaging and fast delivery. Product quality is good.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Product Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
              <RotateCcw className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Return Product</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-400" />
                  Select Product to Return
                </label>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative flex items-center gap-4 px-5 py-5 bg-gradient-to-br from-slate-800/95 via-slate-900/90 to-slate-800/95 backdrop-blur-2xl border border-slate-600/40 rounded-2xl shadow-2xl group-hover:border-orange-500/60 group-hover:shadow-orange-500/10 transition-all duration-500 transform group-hover:scale-[1.01]">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/40 to-red-500/40 rounded-xl blur opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500/25 to-red-500/25 rounded-xl flex items-center justify-center border border-orange-500/40 backdrop-blur-sm group-hover:from-orange-500/35 group-hover:to-red-500/35 transition-all duration-300">
                        <Package className="w-6 h-6 text-orange-300 group-hover:text-orange-200 drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <select
                        value={returnProduct}
                        onChange={(e) => setReturnProduct(e.target.value)}
                        className="appearance-none bg-transparent text-white font-semibold text-base cursor-pointer focus:outline-none pr-12 w-full min-h-[28px] tracking-wide"
                      >
                        <option value="" className="bg-slate-900 text-slate-400 py-4 px-6 font-medium">Choose a product...</option>
                        <option value="ashwagandha-powder" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Ashwagandha Powder 500g - Order #ORD001</option>
                        <option value="turmeric-capsules" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Turmeric Capsules 60ct - Order #ORD002</option>
                        <option value="brahmi-oil" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Brahmi Oil 100ml - Order #ORD003</option>
                        <option value="neem-tablets" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Neem Tablets 30ct - Order #ORD004</option>
                      </select>
                      {/* Enhanced Custom dropdown arrow */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg blur opacity-50"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500/25 to-red-500/25 rounded-lg flex items-center justify-center border border-orange-500/40 backdrop-blur-sm group-hover:from-orange-500/35 group-hover:to-red-500/35 transition-all duration-300">
                            <svg className="w-5 h-5 text-orange-300 group-hover:text-orange-200 transition-all duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Reason for Return
                </label>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 via-pink-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative flex items-center gap-4 px-5 py-5 bg-gradient-to-br from-slate-800/95 via-slate-900/90 to-slate-800/95 backdrop-blur-2xl border border-slate-600/40 rounded-2xl shadow-2xl group-hover:border-red-500/60 group-hover:shadow-red-500/10 transition-all duration-500 transform group-hover:scale-[1.01]">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-red-500/40 to-pink-500/40 rounded-xl blur opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-red-500/25 to-pink-500/25 rounded-xl flex items-center justify-center border border-red-500/40 backdrop-blur-sm group-hover:from-red-500/35 group-hover:to-pink-500/35 transition-all duration-300">
                        <AlertCircle className="w-6 h-6 text-red-300 group-hover:text-red-200 drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="appearance-none bg-transparent text-white font-semibold text-base cursor-pointer focus:outline-none pr-12 w-full min-h-[28px] tracking-wide"
                      >
                        <option value="" className="bg-slate-900 text-slate-400 py-4 px-6 font-medium">Select reason...</option>
                        <option value="damaged" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Product arrived damaged</option>
                        <option value="defective" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Product is defective</option>
                        <option value="wrong-item" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Wrong item received</option>
                        <option value="not-as-described" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Not as described</option>
                        <option value="quality-issues" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Quality issues</option>
                        <option value="other" className="bg-slate-900 text-white py-4 px-6 hover:bg-slate-800 font-medium">Other</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-lg blur opacity-50"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-br from-red-500/25 to-pink-500/25 rounded-lg flex items-center justify-center border border-red-500/40 backdrop-blur-sm group-hover:from-red-500/35 group-hover:to-pink-500/35 transition-all duration-300">
                            <svg className="w-5 h-5 text-red-300 group-hover:text-red-200 transition-all duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleReturnRequest}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Submit Return Request
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-slate-600/30">
              <h4 className="text-white font-semibold mb-3">Return Status</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-emerald-300 font-medium text-sm">Return Approved</p>
                    <p className="text-slate-400 text-xs">Brahmi Oil - Refund processed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-yellow-300 font-medium text-sm">Under Review</p>
                    <p className="text-slate-400 text-xs">Neem Tablets - Processing return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Return Policy</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {returnPolicies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600/30">
                      <Icon className={`w-5 h-5 ${policy.color}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-2">{policy.title}</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">{policy.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-300 font-semibold text-sm mb-1">Important Note</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  For any questions regarding returns or refunds, please contact our customer support team at support@ayurherb.com or call +91 98765 43210. 
                  Our team is available Monday to Friday, 9 AM to 6 PM IST.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
