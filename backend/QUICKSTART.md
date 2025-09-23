# 🚀 Ayurherb Backend Quick Start

Get your Ayurherb backend running in 5 minutes!

## Option 1: Docker (Recommended)

### Prerequisites
- Docker Desktop installed

### Steps
```bash
# 1. Navigate to backend directory
cd backend

# 2. Start everything with Docker
docker-compose up -d

# 3. Wait 30 seconds for Besu to initialize, then deploy contract
docker-compose exec backend npm run deploy-contract

# 4. Test the system
curl http://localhost:3001/health
```

**That's it! Your backend is running with blockchain integration.**

---

## Option 2: Manual Setup

### Prerequisites
- Node.js 18+
- Git

### Steps
```bash
# 1. Install dependencies
cd backend
npm install

# 2. Setup environment
cp .env.example .env

# 3. Start Besu (in separate terminal)
# Download Besu from: https://github.com/hyperledger/besu/releases
besu --network=dev --miner-enabled --rpc-http-enabled --rpc-http-host=localhost --rpc-http-port=8545 --rpc-http-cors-origins="*" --data-path=./besu-data --genesis-file=./besu-genesis.json

# 4. Initialize database and deploy contract
npm run setup

# 5. Start backend server
npm start
```

---

## 🧪 Quick Test

### Add a Processing Step
```bash
curl -X POST http://localhost:3001/api/v1/processing-steps \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "COL001",
    "processorId": "PROC001",
    "stepType": "drying",
    "temperature": 60,
    "duration": 480,
    "notes": "Controlled drying at optimal temperature"
  }'
```

### Get Traceability Report
```bash
curl http://localhost:3001/api/v1/batches/COL001/traceability
```

### Run Full System Test
```bash
npm run test-system
```

---

## 📊 What You Get

✅ **Complete Backend API** - All endpoints for processing steps
✅ **Blockchain Integration** - Immutable records on Hyperledger Besu  
✅ **Database Storage** - SQLite with sample data
✅ **File Uploads** - Certificate and document support
✅ **Traceability** - Complete audit trails
✅ **Verification** - Blockchain proof generation

---

## 🔗 Key URLs

- **API Documentation**: http://localhost:3001/
- **Health Check**: http://localhost:3001/health
- **Blockchain Status**: http://localhost:3001/api/v1/blockchain/status
- **Sample Batches**: http://localhost:3001/api/v1/batches

---

## 🛠️ Troubleshooting

**Blockchain not connected?**
```bash
# Check Besu is running
curl http://localhost:8545 -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**Contract not deployed?**
```bash
npm run deploy-contract
```

**Need to reset everything?**
```bash
# Docker
docker-compose down -v && docker-compose up -d

# Manual
rm -rf data/ besu-data/ && npm run setup
```

---

## 📚 Next Steps

1. **Integrate with Frontend** - Update your React app to use these APIs
2. **Add More Processors** - Insert additional processor data
3. **Customize Processing Steps** - Add new step types as needed
4. **Production Deploy** - Follow SETUP.md for production guidelines

**Happy coding! 🎉**
