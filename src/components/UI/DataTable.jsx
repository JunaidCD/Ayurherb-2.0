import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
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

  const renderCellValue = (value, column) => {
    if (column.type === 'status') {
      return <StatusBadge status={value} />;
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
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
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
      {/* Header with search and filters */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-dark-700 flex flex-wrap gap-4">
          {searchable && (
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}
          
          {filterable && (
            <div className="flex gap-2">
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Filter by...</option>
                {columns.map(col => (
                  <option key={col.key} value={col.key}>{col.label}</option>
                ))}
              </select>
              
              {filterColumn && (
                <input
                  type="text"
                  placeholder="Filter value..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          sortColumn === column.key && sortDirection === 'desc' ? 'rotate-180' : ''
                        }`} 
                      />
                    )}
                  </div>
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {sortedData.map((row, index) => (
              <tr
                key={row.id || index}
                className={`hover:bg-dark-700/50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-300">
                    {renderCellValue(row[column.key], column)}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className="p-1 text-gray-400 hover:text-primary-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
