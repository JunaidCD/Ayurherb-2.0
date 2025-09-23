import React, { useState } from 'react';
import { 
  Search, Filter, ChevronDown, Eye, Edit, Trash2, ArrowUpDown,
  ArrowUp, ArrowDown, MoreHorizontal, Calendar, MapPin, User, Package
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const DataTable = ({ 
  data = [], 
  columns = [], 
  searchable = true, 
  filterable = true,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Filter and search data
  const filteredData = data.filter(row => {
    const matchesSearch = !searchTerm || 
      Object.values(row).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilter = !filterValue || !filterColumn ||
      row[filterColumn]?.toString().toLowerCase().includes(filterValue.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderCellValue = (value, column, row) => {
    if (column.render) {
      return column.render(value, row);
    }
    
    if (column.type === 'status') {
      return <StatusBadge status={value} />;
    }
    
    if (column.type === 'date') {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      );
    }
    
    if (column.type === 'number') {
      return typeof value === 'number' ? value.toLocaleString() : value;
    }
    
    return value;
  };

  if (loading) {
    return (
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-dark-600 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-dark-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Modern Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Enhanced Header */}
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-300 ${
                    column.sortable ? 'cursor-pointer hover:text-white group' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-4 h-4 text-primary-400" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-primary-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Enhanced Body */}
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={row.id || index}
                className={`group border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    <div className="flex items-center">
                      {column.key === 'id' && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-primary-500/30">
                            <Package className="w-5 h-5 text-primary-400" />
                          </div>
                          <div>
                            <span className="font-mono text-primary-400 font-semibold">{row[column.key]}</span>
                          </div>
                        </div>
                      )}
                      
                      {column.key === 'herb' && (
                        <div>
                          <span className="font-semibold text-white text-lg">{row[column.key]}</span>
                        </div>
                      )}
                      
                      {column.key === 'farmer' && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300 font-medium">{row[column.key]}</span>
                        </div>
                      )}
                      
                      {column.key === 'location' && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span className="text-gray-300">{row[column.key]}</span>
                        </div>
                      )}
                      
                      {column.key === 'harvestDate' && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300">{new Date(row[column.key]).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {column.key === 'quantity' && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-white font-semibold">{row[column.key]}</span>
                        </div>
                      )}
                      
                      {column.key === 'status' && (
                        <div>
                          {renderCellValue(row[column.key], column, row)}
                        </div>
                      )}
                      
                      {column.key === 'qualityScore' && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-400">Quality</span>
                              <span className="text-sm font-semibold text-white">{row[column.key]}%</span>
                            </div>
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  row[column.key] >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 
                                  row[column.key] >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
                                  'bg-gradient-to-r from-red-500 to-red-400'
                                }`}
                                style={{ width: `${row[column.key]}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {column.key === 'actions' && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onView && onView(row);
                              }}
                              className="p-2 bg-white/10 hover:bg-primary-500/20 border border-white/20 hover:border-primary-500/30 rounded-lg transition-all duration-200 group/btn"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-primary-400 transition-colors" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add more actions
                              }}
                              className="p-2 bg-white/10 hover:bg-blue-500/20 border border-white/20 hover:border-blue-500/30 rounded-lg transition-all duration-200 group/btn"
                              title="More Actions"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-400 transition-colors" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {!['id', 'herb', 'farmer', 'location', 'harvestDate', 'quantity', 'status', 'qualityScore', 'actions'].includes(column.key) && (
                        renderCellValue(row[column.key], column, row)
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No batches found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
