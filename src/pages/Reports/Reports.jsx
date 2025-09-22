import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, FileText, TrendingUp, Leaf, Droplets, Award, Shield } from 'lucide-react';
import Card from '../../components/UI/Card';
import { strings } from '../../utils/strings';
import { api } from '../../utils/api';

const Reports = ({ user, showToast }) => {
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      const [envData, compData] = await Promise.all([
        api.getEnvironmentalReport(),
        api.getAyushCompliance()
      ]);
      
      setEnvironmentalData(envData);
      setComplianceData(compData);
    } catch (error) {
      showToast('Failed to load reports data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type) => {
    showToast(`Exporting ${type} report...`, 'info');
    // Simulate export functionality
  };

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

  const sustainabilityData = [
    { name: 'Excellent', value: 45, color: '#22C55E' },
    { name: 'Good', value: 35, color: '#3B82F6' },
    { name: 'Fair', value: 15, color: '#F59E0B' },
    { name: 'Poor', value: 5, color: '#EF4444' }
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{strings.reports.title}</h1>
          <p className="text-gray-400">Environmental impact and compliance analytics</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleExportReport('Environmental')}
            className="btn-secondary"
          >
            <Download className="w-4 h-4" />
            {strings.reports.exportData}
          </button>
          <button 
            onClick={() => handleExportReport('PDF')}
            className="btn-primary"
          >
            <FileText className="w-4 h-4" />
            {strings.reports.downloadPDF}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{strings.reports.carbonFootprint}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {environmentalData?.carbonFootprint || 0} kg CO₂
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-primary-400" />
                <span className="text-primary-400 text-sm font-medium">-12%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{strings.reports.waterUsage}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {environmentalData?.waterUsage || 0}L
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">-8%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{strings.reports.sustainabilityScore}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {environmentalData?.sustainabilityScore || 0}%
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-primary-400" />
                <span className="text-primary-400 text-sm font-medium">+5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{strings.reports.complianceScore}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {complianceData?.overallCompliance || 0}%
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">+3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Impact Trends */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{strings.reports.environmentalImpact}</h3>
            <button 
              onClick={() => handleExportReport('Environmental Trends')}
              className="text-primary-400 text-sm hover:text-primary-300 transition-colors"
            >
              Export Data
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={environmentalData?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="carbon" 
                  stackId="1" 
                  stroke="#22C55E" 
                  fill="#22C55E" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="water" 
                  stackId="2" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sustainability Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Sustainability Distribution</h3>
            <button 
              onClick={() => handleExportReport('Sustainability')}
              className="text-primary-400 text-sm hover:text-primary-300 transition-colors"
            >
              Export Data
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sustainabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sustainabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {sustainabilityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-300 text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AYUSH Compliance */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{strings.reports.ayushCompliance}</h3>
          <button 
            onClick={() => handleExportReport('AYUSH Compliance')}
            className="btn-primary"
          >
            <Download className="w-4 h-4" />
            {strings.reports.generateReport}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {complianceData?.categories?.map((category, index) => (
            <div key={index} className="p-4 bg-dark-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">{category.name}</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-white">{category.score}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  category.status === 'Excellent' ? 'bg-primary-500/20 text-primary-400' :
                  category.status === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {category.status}
                </span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceData?.categories || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="score" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Report Actions */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Report Generation</h3>
            <p className="text-gray-400">Generate comprehensive reports for stakeholders</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleExportReport('Monthly')}
              className="btn-secondary"
            >
              Monthly Report
            </button>
            <button 
              onClick={() => handleExportReport('Quarterly')}
              className="btn-secondary"
            >
              Quarterly Report
            </button>
            <button 
              onClick={() => handleExportReport('Annual')}
              className="btn-primary"
            >
              Annual Report
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
