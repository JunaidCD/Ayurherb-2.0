# Ayurherb 2.0 - Ayurvedic Supply Chain Management

A modern, professional frontend application for managing ayurvedic herb supply chain operations with role-based dashboards and comprehensive tracking capabilities.

## 🌿 Features

### Multi-Role Dashboard System
- **Admin Dashboard**: Complete system overview with analytics, batch management, and reporting
- **Processor Dashboard**: Processing workflow management with step tracking
- **Lab Tester Dashboard**: Quality testing interface with file uploads and compliance tracking  
- **Customer Portal**: Product provenance tracking with QR code scanning

### Key Capabilities
- **Batch Tracking**: End-to-end traceability from farm to consumer
- **Quality Management**: Lab testing, AYUSH compliance, and certification tracking
- **Processing Workflows**: Step-by-step processing management with status updates
- **Environmental Reporting**: Carbon footprint, water usage, and sustainability metrics
- **Collections Management**: Farmer submission tracking and verification
- **Real-time Analytics**: Interactive charts and data visualization

### Modern UI/UX
- **Dark Theme**: Professional dark mode with green accent colors
- **Glassmorphism Effects**: Modern glass-like components with backdrop blur
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Modals, toasts, status badges, and data tables
- **Role-based Navigation**: Dynamic sidebar and topbar based on user role

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom dark theme
- **Routing**: React Router DOM v6
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Language**: JavaScript only (no TypeScript)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone or navigate to the project directory**
   ```bash
   cd "C:\Users\ASUS\OneDrive\Desktop\Ayurherb 2.0"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The application will automatically open at `http://localhost:3000`
   - If it doesn't open automatically, navigate to the URL manually
   - Alternative: Double-click `start.bat` for automated setup

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **Port already in use**
   - If port 3000 is busy, Vite will automatically use the next available port (3001, 3002, etc.)
   - Check the terminal output for the actual port number

2. **Module resolution errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Clear npm cache: `npm cache clean --force`

3. **React Router warnings**
   - These are typically warnings, not errors
   - The application should still function normally

4. **CSS/Tailwind issues**
   - Ensure PostCSS and Tailwind are properly configured
   - Check that `@tailwind` directives are in `src/index.css`

5. **Build errors**
   - Run `npm run build` to check for production build issues
   - Use `npm run preview` to test the production build locally

## 🔐 Login Credentials

The application uses mock authentication. You can login with any username/password combination after selecting a role:

### Available Roles:
1. **Admin** - Full system access and analytics
2. **Processor** - Manage processing workflows  
3. **Lab Tester** - Quality testing and validation
4. **Customer** - Track product provenance

**Example Login:**
- Username: `admin` (or any text)
- Password: `password` (or any text)
- Role: Select any role from the cards

## 📱 Application Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Role-based navigation sidebar
│   │   └── Topbar.jsx          # Top navigation bar
│   └── UI/
│       ├── Card.jsx            # Reusable card component
│       ├── DataTable.jsx       # Interactive data table
│       ├── Modal.jsx           # Modal dialog component
│       ├── QRViewer.jsx        # QR code display component
│       ├── StatusBadge.jsx     # Status indicator badges
│       └── Toast.jsx           # Notification toasts
├── pages/
│   ├── Admin/
│   │   └── AdminDashboard.jsx  # Admin dashboard with analytics
│   ├── Collections/
│   │   └── Collections.jsx     # Farmer collections management
│   ├── Customer/
│   │   └── CustomerPortal.jsx  # Product provenance portal
│   ├── Lab/
│   │   └── LabDashboard.jsx    # Lab testing interface
│   ├── Login/
│   │   └── Login.jsx           # Role-based login page
│   ├── Processor/
│   │   └── ProcessorDashboard.jsx # Processing workflow management
│   └── Reports/
│       └── Reports.jsx         # Analytics and reporting
├── utils/
│   ├── api.js                  # Mock API functions
│   └── strings.js              # UI text constants
├── App.jsx                     # Main app component with routing
├── main.jsx                    # Application entry point
└── index.css                   # Global styles and Tailwind imports
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#22c55e` (Tailwind green-500)
- **Dark Background**: `#0f172a` (Tailwind slate-900)
- **Card Background**: `#1e293b` (Tailwind slate-800)
- **Border Color**: `#334155` (Tailwind slate-700)

### Component Patterns
- **Glass Effects**: Backdrop blur with transparency
- **Hover Animations**: Scale and shadow transitions
- **Status Colors**: Color-coded badges for different states
- **Gradient Accents**: Subtle gradients for visual depth

## 🔌 API Integration

The application currently uses mock data from `src/utils/api.js`. To connect to a real backend:

1. **Replace mock functions** in `api.js` with actual API calls
2. **Update endpoints** to match your backend URLs
3. **Add authentication** headers and error handling
4. **Configure environment** variables for API base URLs

### Mock Data Includes:
- Batch information with processing steps
- Lab test results and compliance data
- Environmental impact metrics
- Farmer collection submissions
- Dashboard statistics and charts

## 📊 Features by Role

### Admin Dashboard
- System overview with key metrics
- Harvest trends visualization
- Batch management table
- Recent activity feed
- Export capabilities

### Processor Dashboard  
- Batch cards with processing status
- Add processing steps modal
- Step-by-step workflow tracking
- Status indicators and progress

### Lab Tester Dashboard
- Quality testing interface
- File upload for certificates
- Test result forms (moisture, pesticide, DNA)
- AYUSH compliance tracking

### Customer Portal
- Product provenance display
- QR code scanning simulation
- Farmer profile information
- Processing history timeline
- Quality test results
- Certification badges
- Recall alerts

### Reports & Analytics
- Environmental impact charts
- AYUSH compliance metrics
- Sustainability distribution
- Export functionality
- Multiple report formats

### Collections Management
- Farmer submission tracking
- Status management (Queued → Synced → Verified)
- Bulk operations
- Grid and table views

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist/` folder can be deployed to:
- Netlify
- Vercel  
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use JavaScript only (no TypeScript)
3. Maintain the dark theme design system
4. Add proper error handling and loading states
5. Update mock data in `api.js` as needed
6. Test across different roles and screen sizes

## 📄 License

This project is part of the Ayurherb 2.0 supply chain management system.

## 🆘 Support

For technical support or questions about the application:
1. Check the browser console for any errors
2. Ensure all dependencies are properly installed
3. Verify Node.js version compatibility
4. Check network connectivity for any external resources

---

**Built with ❤️ for sustainable ayurvedic supply chain management**
