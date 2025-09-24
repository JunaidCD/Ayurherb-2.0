# 🚀 Ayurherb 2.0 - Blockchain Integration Setup

This guide will help you set up the complete Ayurherb 2.0 system with **real Hyperledger Besu blockchain integration**.

## ✅ What's Implemented

- **Real Backend API** with Express.js
- **SQLite Database** for processing steps
- **Hyperledger Besu** blockchain network
- **Smart Contract** for immutable processing step storage
- **Automatic Transaction Handling** (no wallet required)
- **Hash Computation** and blockchain verification
- **Transaction ID Display** in processor dashboard

## 🏗️ Architecture

```
Processor Form → Backend API → Database + Blockchain → Dashboard
     ↓              ↓              ↓                    ↓
  Fill Form    Compute Hash    Store in DB         Show TxID
  Click Save   Send to Besu    Save TxHash        "Verified ✅"
```

## 📋 Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start (Automated)

```bash
# 1. Navigate to backend directory
cd "C:\Users\ASUS\OneDrive\Desktop\Ayurherb 2.0\backend"

# 2. Install dependencies
npm install

# 3. Setup Hyperledger Besu (automated)
npm run setup-besu

# 4. Deploy smart contract
npm run deploy-contract

# 5. Start backend server
npm run dev
```

Then in another terminal:
```bash
# 6. Start frontend
cd "C:\Users\ASUS\OneDrive\Desktop\Ayurherb 2.0\frontend"
npm run dev
```

## 🔧 Manual Setup (Step by Step)

### Step 1: Backend Setup
```bash
cd backend
npm install
```

### Step 2: Create Environment File
```bash
# Copy example environment
cp .env.example .env

# The .env file should contain:
PORT=3001
BESU_RPC_URL=http://localhost:8545
PRIVATE_KEY=0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63
CONTRACT_ADDRESS=  # Will be filled after deployment
```

### Step 3: Start Hyperledger Besu
```bash
# Start Besu blockchain network
docker-compose up -d

# Wait for Besu to start (check logs)
docker-compose logs -f besu
```

### Step 4: Deploy Smart Contract
```bash
# Deploy ProcessingSteps.sol to Besu
npm run deploy-contract

# This will:
# - Compile the smart contract
# - Deploy to Besu network
# - Update .env with contract address
# - Save contract ABI
```

### Step 5: Initialize Database
```bash
# Create SQLite database and tables
npm run migrate
```

### Step 6: Start Backend Server
```bash
# Start the API server
npm run dev

# Should show:
# 🚀 Ayurherb Backend Server Started
# 📍 Port: 3001
# 🔗 Blockchain: http://localhost:8545
```

### Step 7: Start Frontend
```bash
cd ../frontend
npm run dev

# Frontend will run on http://localhost:5173
```

## 🧪 Testing the Integration

### 1. Check System Health
```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "blockchain": "connected"
  }
}
```

### 2. Test Processing Step Submission

1. **Open Frontend**: http://localhost:5173
2. **Navigate to**: Add Processing Step page
3. **Search for Batch**: Enter "COL001" 
4. **Fill Form**:
   - Select processing step (e.g., "Drying")
   - Enter temperature: 60
   - Enter duration: 120
   - Add notes: "Test processing step"
5. **Click**: "Save on Blockchain"
6. **Observe**:
   - "Submitting to blockchain..." message
   - Real transaction hash displayed
   - Success modal with blockchain details

### 3. Verify on Processor Dashboard

1. **Navigate to**: Processor Dashboard
2. **Check Recent Steps**: Should show "Verified on Blockchain ✅"
3. **Transaction Hash**: Real blockchain transaction ID

## 🔍 What Happens Behind the Scenes

### When You Click "Save on Blockchain":

1. **Frontend** → Sends data to `POST /api/v1/processing-steps`
2. **Backend** → Validates and saves to SQLite database
3. **Hash Computation** → SHA-256 hash of processing step data
4. **Blockchain Submission** → Calls smart contract `addProcessingStep()`
5. **Transaction Mining** → Besu mines the transaction
6. **Database Update** → Stores transaction hash and block number
7. **Response** → Returns real transaction hash to frontend
8. **Dashboard Update** → Shows "Verified on Blockchain ✅"

### Data Flow:
```
Processing Step Data
       ↓
   Compute Hash (SHA-256)
       ↓
Smart Contract Storage
       ↓
Transaction Hash
       ↓
Database Storage
       ↓
Frontend Display
```

## 📊 Monitoring & Debugging

### Backend Logs
```bash
# View backend server logs
npm run dev
```

### Blockchain Logs
```bash
# View Besu blockchain logs
docker-compose logs -f besu
```

### Database Inspection
```bash
# View SQLite database
sqlite3 ./data/ayurherb.db
.tables
SELECT * FROM processing_steps;
```

### API Testing
```bash
# Test processing step creation
curl -X POST http://localhost:3001/api/v1/processing-steps \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "COL001",
    "processorId": "PROC001",
    "stepType": "Drying",
    "temperature": 60,
    "duration": 120,
    "notes": "Test step"
  }'
```

## 🔧 Troubleshooting

### Issue: "Blockchain not connected"
```bash
# Check if Besu is running
docker ps

# Restart Besu
docker-compose restart besu

# Check Besu logs
docker-compose logs besu
```

### Issue: "Contract not deployed"
```bash
# Redeploy contract
npm run deploy-contract

# Check contract address in .env
cat .env | grep CONTRACT_ADDRESS
```

### Issue: "Database locked"
```bash
# Reset database
rm ./data/ayurherb.db
npm run migrate
```

### Issue: "Port already in use"
```bash
# Check what's using port 3001
netstat -ano | findstr :3001

# Kill process or change port in .env
```

## 🎯 Key Features Implemented

### ✅ Real Blockchain Integration
- Hyperledger Besu network running locally
- Smart contract deployed and functional
- Real transaction hashes and block numbers

### ✅ Automatic Transaction Handling
- Backend relayer account signs all transactions
- No wallet connection required from users
- Gas fees handled automatically

### ✅ Data Integrity
- SHA-256 hash computation of processing step data
- Immutable storage on blockchain
- Database stores transaction references

### ✅ User Experience
- Real-time blockchain submission feedback
- Transaction hash display in modal
- Verification status on processor dashboard
- "Verified on Blockchain ✅" indicators

## 🚀 Production Deployment

For production deployment:

1. **Use Production Besu Network** or connect to existing Ethereum network
2. **Secure Private Keys** using environment variables or key management
3. **Database Migration** to PostgreSQL or MySQL
4. **Load Balancing** for high availability
5. **Monitoring** with Prometheus/Grafana
6. **Backup Strategy** for database and blockchain data

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs for error messages
3. Verify Besu blockchain is running and accessible
4. Ensure all dependencies are installed correctly
5. Check that ports 3001, 8545, 8546 are available

---

**🎉 You now have a fully functional blockchain-integrated Ayurherb 2.0 system!**

The processor feature now saves real data to Hyperledger Besu blockchain and displays actual transaction hashes with verification status.
