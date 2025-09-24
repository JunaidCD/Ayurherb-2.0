# 🚀 Ayurherb 2.0 - Local Development Setup

## Quick Start Guide

### Terminal 1: Backend + Blockchain
```bash
# Navigate to backend
cd "c:\Users\ASUS\OneDrive\Desktop\Ayurherb 2.0\backend"

# Start Besu blockchain
docker-compose up -d besu

# Wait 30 seconds for Besu to initialize, then start backend
$env:BESU_RPC_URL="http://localhost:8545"; $env:CONTRACT_ADDRESS="0x2e14504f2969e"; node server.js
```

### Terminal 2: Frontend
```bash
# Navigate to frontend
cd "c:\Users\ASUS\OneDrive\Desktop\Ayurherb 2.0\frontend"

# Install dependencies (first time only)
npm install

# Start frontend
npm run dev
```

## 🌐 Access Points

- **Frontend (React App):** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/
- **Health Check:** http://localhost:3001/health
- **Besu Blockchain RPC:** http://localhost:8545

## 🔧 System Status

### ✅ What's Working:
- ✅ Smart Contract Deployed: `0x2e14504f2969e`
- ✅ Besu Blockchain Network
- ✅ Backend API with SQLite Database
- ✅ Blockchain Integration
- ✅ Processing Steps API
- ✅ Traceability System

### 📋 Available API Endpoints:

#### Processing Steps
- `POST /api/v1/processing-steps` - Add new processing step
- `GET /api/v1/processing-steps/batch/:batchId` - Get steps for batch
- `GET /api/v1/processing-steps/:stepId/proof` - Get blockchain proof

#### Batches
- `GET /api/v1/batches` - Get all batches
- `GET /api/v1/batches/:batchId` - Get specific batch
- `GET /api/v1/batches/:batchId/traceability` - Full traceability report

#### Blockchain
- `GET /api/v1/blockchain/status` - Network status
- `GET /api/v1/blockchain/transaction/:txHash` - Transaction details

## 🛠️ Troubleshooting

### If Besu fails to start:
```bash
docker-compose down
docker-compose up -d besu
```

### If backend fails:
- Check if Besu is running: `docker ps`
- Verify blockchain connection: `curl http://localhost:8545`

### If frontend fails:
```bash
cd frontend
npm install
npm run dev
```

## 🔄 Stop Everything:
```bash
# Stop backend: Ctrl+C in Terminal 1
# Stop frontend: Ctrl+C in Terminal 2
# Stop Besu: 
docker-compose down
```

## 📊 Data Flow

1. **Farmer Submissions** → Frontend Collections Page
2. **Status Updates** (Queued → Synced → Verified) → Shared Storage
3. **Verified Collections** → Processor Dashboard as Batches
4. **Processing Steps** → Backend API → Blockchain → Immutable Records
5. **Traceability Reports** → Complete audit trail with blockchain proofs

## 🎯 Next Steps

1. Open http://localhost:5173 in your browser
2. Navigate to Collections page to see farmer submissions
3. Update collection status to "Verified"
4. Check Processor Dashboard for new batches
5. Add processing steps and get blockchain verification
