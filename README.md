# Ayurherb 2.0 - Blockchain-Powered Herbal Supply Chain Management

![Ayurherb Logo](https://img.shields.io/badge/Ayurherb-2.0-green?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![Blockchain](https://img.shields.io/badge/Blockchain-Hyperledger%20Besu-orange?style=flat-square&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## 🌿 Overview

Ayurherb 2.0 is a comprehensive blockchain-powered supply chain management system specifically designed for the herbal and Ayurvedic medicine industry. The platform provides complete traceability from farm to consumer, ensuring authenticity, quality, and transparency throughout the entire supply chain.

### 🎯 Key Features

- **🔗 Blockchain Integration**: Hyperledger Besu network for immutable record keeping
- **👥 Multi-Role Dashboard**: Farmer, Processor, Lab, Admin, and Customer portals
- **📊 Real-time Analytics**: Comprehensive dashboards with interactive charts
- **🔍 Complete Traceability**: Track products from harvest to consumer
- **📱 QR Code Integration**: Easy product verification for end consumers
- **🧪 Lab Testing Integration**: Quality assurance and compliance tracking
- **💾 Smart Data Management**: Cross-application data sharing with real-time sync
- **🎨 Modern UI/UX**: Glassmorphism design with responsive layouts

## 🏗️ Architecture

### Frontend
- **Framework**: React 18.2.0 with Vite
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Routing**: React Router DOM v6
- **Charts**: Recharts for data visualization
- **QR Codes**: React QR Code generation
- **Icons**: Lucide React icon library

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite for local data storage
- **Blockchain**: Hyperledger Besu with Web3.js integration
- **Smart Contracts**: Solidity contracts for processing steps
- **File Upload**: Multer for certificate and document handling
- **API**: RESTful API with comprehensive endpoints

### Blockchain Layer
- **Network**: Hyperledger Besu (Ethereum-compatible)
- **Smart Contracts**: ProcessingSteps.sol for immutable record keeping
- **Consensus**: IBFT 2.0 (Istanbul Byzantine Fault Tolerance)
- **Gas Management**: Automated transaction handling

## 📁 Project Structure

```
Ayurherb-2.0/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/        # Layout components (Sidebar, Topbar)
│   │   │   └── UI/            # UI components (Cards, Modals, Toast)
│   │   ├── pages/             # Page components
│   │   │   ├── Admin/         # Admin dashboard
│   │   │   ├── Customer/      # Customer portal and dashboard
│   │   │   ├── Lab/           # Lab testing interface
│   │   │   ├── Processor/     # Processor dashboard
│   │   │   └── ...           # Other role-specific pages
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx           # Main application component
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
│
├── backend/                     # Node.js backend API
│   ├── contracts/              # Solidity smart contracts
│   ├── models/                 # Database models and schemas
│   ├── routes/                 # API route handlers
│   ├── services/               # Business logic services
│   ├── scripts/                # Setup and deployment scripts
│   ├── data/                   # SQLite database files
│   ├── uploads/                # File upload directory
│   └── server.js              # Main server file
│
├── DASHBOARD_SETUP.md          # Dashboard setup guide
├── START_BLOCKCHAIN.md         # Blockchain setup instructions
├── START_LOCAL.md             # Local development guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **Docker** (optional, for Besu network)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ayurherb-2.0
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

#### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# The .env file contains:
# - Server configuration (PORT=3001)
# - Database path
# - Blockchain network settings
# - Smart contract configuration
```

#### 4. Initialize Blockchain & Database
```bash
# Start mock blockchain network
npm run mock-blockchain

# Deploy smart contracts (if deployment fails, ensure .env file exists)
npm run deploy-contract

# Clean setup and initialize database
npm run clean-setup

# Start the backend server
npm run dev
```

#### 5. Test Backend System
```bash
# Run system tests
node scripts/test-simple.js

# Keep backend running
npm run dev
```

#### 6. Frontend Setup
```bash
# Open new terminal
cd frontend
npm install

# Start frontend development server
npm run dev
```

### 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Blockchain RPC**: http://localhost:8545 (if using real Besu network)

## 👥 User Roles & Features

### 🌾 Farmer Portal
- Submit herb collections with GPS coordinates
- Track collection status (Queued → Synced → Verified)
- View harvest history and quality metrics
- Generate collection certificates

### 🏭 Processor Dashboard
- View verified collections as processing batches
- Add processing steps (Drying, Grinding, Storage, etc.)
- Blockchain integration for immutable step recording
- Track processing progress and efficiency metrics
- Generate processing certificates

### 🧪 Lab Testing Interface
- Conduct quality tests on processed batches
- Record test results and compliance data
- Generate lab certificates and reports
- Track testing history and trends

### 👑 Admin Dashboard
- System-wide analytics and reporting
- User management and role assignments
- Supply chain monitoring and optimization
- Compliance and audit trail management

### 🛒 Customer Portal
- **Dashboard**: Personal purchase analytics, loyalty points, spending trends
- **Product Search**: Advanced search with filters (name, batch ID, farmer, location)
- **Purchase History**: Order tracking with status updates
- **Market Trends**: Real-time herb price tracking with trend charts
- **Inventory Management**: Personal herb inventory with expiry tracking
- **QR Code Verification**: Scan products for authenticity and traceability

## 🔧 API Endpoints

### Processing Steps
- `POST /api/v1/processing-steps` - Add new processing step
- `GET /api/v1/processing-steps/batch/:batchId` - Get steps for batch
- `GET /api/v1/processing-steps/:stepId/proof` - Get blockchain proof

### Batches & Collections
- `GET /api/v1/batches` - Get all batches
- `GET /api/v1/batches/:batchId` - Get specific batch
- `GET /api/v1/batches/:batchId/traceability` - Full traceability report

### Blockchain
- `GET /api/v1/blockchain/status` - Network status
- `POST /api/v1/blockchain/verify` - Verify transaction

## 🔐 Blockchain Integration

### Smart Contract Features
- **ProcessingSteps.sol**: Immutable processing step storage
- **Hash Verification**: SHA-256 hashing for data integrity
- **Event Logging**: Blockchain events for audit trails
- **Gas Optimization**: Efficient transaction handling

### Transaction Flow
1. User submits processing step data
2. Backend validates and stores in SQLite
3. Generates SHA-256 hash of step data
4. Submits hash + batch ID to smart contract
5. Returns transaction hash for verification
6. Frontend displays blockchain confirmation

## 🎨 UI/UX Features

### Design System
- **Glassmorphism Effects**: Modern blur and transparency effects
- **Gradient Backgrounds**: Dynamic color schemes
- **Interactive Charts**: Recharts with hover animations
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Real-time feedback system

### Animation & Interactions
- **Staggered Loading**: Sequential component animations
- **Hover Effects**: Scale and glow transformations
- **Progress Indicators**: Visual progress tracking
- **Status Color Coding**: Intuitive status representation

## 📊 Data Management

### Local Storage Integration
- **Cross-Application Sync**: Real-time data sharing between roles
- **Event Listeners**: Storage event handling for live updates
- **Data Persistence**: Maintains state across browser sessions
- **Mock Data**: Comprehensive dummy data for demonstration

### Database Schema
- **Collections**: Farmer submission data
- **Batches**: Processing batch information
- **Processing Steps**: Detailed processing records
- **Lab Results**: Quality test data
- **Blockchain Records**: Transaction hashes and proofs

## 🧪 Testing

### Backend Testing
```bash
# Run system tests
npm run test-system

# Test API endpoints
node scripts/test-api.js

# Simple functionality test
node scripts/test-simple.js
```

### Frontend Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run start

# Frontend
cd frontend
npm run build
npm run preview
```

### Docker Deployment (Optional)
```bash
# Start Hyperledger Besu network
docker-compose up -d

# Deploy contracts to network
npm run deploy-contract
```

## 🔧 Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Ensure `.env` file exists (copy from `.env.example`)
   - Check blockchain network is running
   - Verify private key and RPC URL

2. **Frontend Not Loading Data**
   - Ensure backend is running on port 3001
   - Check browser localStorage for data
   - Run `npm run clean-setup` to reset data

3. **Database Issues**
   - Delete `data/ayurherb.db` and run `npm run migrate`
   - Check file permissions in data directory

4. **Port Conflicts**
   - Backend: Change PORT in `.env` file
   - Frontend: Modify `vite.config.js`

## 📚 Documentation

- **[Dashboard Setup Guide](DASHBOARD_SETUP.md)**: Comprehensive dashboard configuration
- **[Blockchain Setup](START_BLOCKCHAIN.md)**: Detailed blockchain network setup
- **[Local Development](START_LOCAL.md)**: Local development environment guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development Team

- **Frontend**: React.js, Tailwind CSS, Modern UI/UX
- **Backend**: Node.js, Express.js, SQLite
- **Blockchain**: Hyperledger Besu, Solidity Smart Contracts
- **Integration**: Web3.js, Real-time Data Sync

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

## 🔄 Version History

- **v2.0.0**: Complete blockchain integration with Hyperledger Besu
- **v1.5.0**: Multi-role dashboard implementation
- **v1.0.0**: Initial release with basic supply chain tracking

---

**Built with ❤️ for the Ayurvedic and Herbal Medicine Industry**

*Ensuring authenticity, quality, and transparency from farm to consumer through blockchain technology.*
