# Ayurherb 2.0 Dashboard Setup Guide

## Overview
This guide explains how to populate the customer dashboard with comprehensive dummy data for demonstration purposes.

## Dashboard Features
The AdminDashboard includes:
- **Statistics Cards**: Total Collections, Verified Batches, Active Farmers, Quality Score
- **Supply Chain Flow Chart**: Harvest → Processing → Verification trends
- **Batch Status Distribution**: Pie chart showing batch statuses
- **Recent Activity Feed**: Latest supply chain events
- **Performance Metrics**: Key performance indicators with progress bars

## Dummy Data Included

### Farmer Collections (8 entries)
1. **COL001** - COL 2024 - Allovera (5kg) - West Bengal
2. **COL002** - Rajesh Kumar - Ashwagandha (500kg) - Kerala
3. **COL003** - Suresh Patel - Brahmi (300kg) - Gujarat
4. **COL004** - COL-102 - Ashwagandha (12kg) - Protected Forest
5. **COL005** - Priya Sharma - Turmeric (750kg) - Tamil Nadu
6. **COL006** - Amit Singh - Neem (400kg) - Rajasthan
7. **COL007** - Lakshmi Devi - Tulsi (200kg) - Karnataka
8. **COL008** - Ravi Kumar - Ginger (600kg) - Kerala

### Processing Steps (Sample Data)
- **BAT 2024 003**: Drying (60°C, 24hrs) + Grinding (25°C, 2hrs)
- **BAT-2025-012**: Cleaning (20°C, 1hr) + Drying (55°C, 18hrs)

### Dashboard Statistics
- **Total Collections**: 1,547
- **Verified Batches**: 1,089
- **Active Farmers**: 234
- **Quality Score**: 94.2%
- **Processing Efficiency**: 94%
- **Quality Compliance**: 98%
- **Supply Chain Speed**: 87%
- **Farmer Satisfaction**: 92%

## How to Populate Dashboard

### Method 1: Automatic Initialization
The dashboard will automatically populate with dummy data when you first load it. The `sharedStorage.js` utility initializes with comprehensive sample data.

### Method 2: Manual Reset (if needed)
If you need to reset the data:

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run the clear storage script:
   ```javascript
   // Copy and paste this in console
   localStorage.removeItem('ayurherb_collections');
   localStorage.removeItem('ayurherb_batches');
   localStorage.removeItem('ayurherb_processing_steps');
   localStorage.removeItem('ayurherb_last_update');
   console.log('Storage cleared! Refresh the page.');
   ```
4. Refresh the page

### Method 3: Using the Clear Script
1. Navigate to the frontend folder
2. Open `clear-storage.js` in a text editor
3. Copy the contents
4. Paste in browser console
5. Refresh the page

## Viewing the Dashboard

1. Start the development server:
   ```bash
   cd frontend
   npm start
   ```

2. Navigate to: `http://localhost:3173/dashboard`

3. Login with any credentials (demo mode)

4. The dashboard should now display:
   - Populated statistics cards with realistic numbers
   - Charts showing supply chain flow and batch distribution
   - Recent activity feed with farmer submissions
   - Performance metrics with progress indicators

## Data Flow

1. **Collections** → Farmer submissions with various statuses
2. **Batches** → Verified collections converted to processing batches
3. **Processing Steps** → Custom processing operations on batches
4. **Dashboard Stats** → Aggregated metrics from all data sources

## Troubleshooting

### Empty Dashboard Cards
- Check browser console for errors
- Ensure localStorage is cleared and page is refreshed
- Verify `sharedStorage.js` is properly initialized

### Missing Data
- Run the clear storage script
- Check that `api.js` is returning mock data properly
- Ensure `getDashboardStats()` is being called

### Charts Not Loading
- Verify Recharts library is installed
- Check that chart data arrays have proper structure
- Ensure component is not in loading state

## File Structure
```
frontend/
├── src/
│   ├── pages/Admin/AdminDashboard.jsx     # Main dashboard component
│   ├── utils/api.js                       # API functions with mock data
│   ├── utils/sharedStorage.js             # Data storage utility
│   └── components/UI/                     # UI components
├── clear-storage.js                       # Storage reset script
└── DASHBOARD_SETUP.md                     # This guide
```

## Next Steps
- Customize the dummy data to match your specific requirements
- Add more processing steps for different batches
- Modify statistics to reflect your business metrics
- Enhance charts with additional data points
