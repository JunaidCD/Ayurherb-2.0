# Ayurherb 2.0 Backend Setup Guide

This guide will help you set up the complete Ayurherb backend system with Hyperledger Besu blockchain integration.

## Quick Start (Recommended)

### Option 1: Docker Setup (Easiest)

1. **Prerequisites**
   ```bash
   # Install Docker and Docker Compose
   # Windows: Download Docker Desktop
   # macOS: Download Docker Desktop  
   # Linux: Install docker and docker-compose
   ```

2. **Start the system**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Deploy smart contract**
   ```bash
   # Wait for Besu to start (about 30 seconds)
   docker-compose exec backend npm run deploy-contract
   ```

4. **Test the system**
   ```bash
   curl http://localhost:3001/health
   ```

### Option 2: Manual Setup

1. **Install Node.js 18+**
   ```bash
   # Download from https://nodejs.org/
   node --version  # Should be 18+
   ```

2. **Install Hyperledger Besu**
   ```bash
   # Download from https://github.com/hyperledger/besu/releases
   # Or use package manager:
   
   # macOS with Homebrew
   brew install hyperledger/besu/besu
   
   # Or download binary and add to PATH
   ```

3. **Start Besu Network**
   ```bash
   # Create a new terminal and run:
   besu --network=dev \
        --miner-enabled \
        --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 \
        --rpc-http-enabled \
        --rpc-http-host=localhost \
        --rpc-http-port=8545 \
        --rpc-http-cors-origins="*" \
        --rpc-ws-enabled \
        --data-path=./besu-data \
        --genesis-file=./besu-genesis.json
   ```

4. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

5. **Configure Environment**
   Edit `.env` file:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_PATH=./data/ayurherb.db
   BESU_RPC_URL=http://localhost:8545
   BESU_NETWORK_ID=1337
   PRIVATE_KEY=0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63
   GAS_LIMIT=3000000
   GAS_PRICE=20000000000
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=10485760
   API_PREFIX=/api/v1
   ```

6. **Initialize Database**
   ```bash
   npm run migrate
   ```

7. **Deploy Smart Contract**
   ```bash
   npm run deploy-contract
   ```

8. **Start Backend Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Verification

### 1. Check Health Status
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-23T10:30:00.000Z",
  "services": {
    "database": "connected",
    "blockchain": "connected"
  },
  "version": "1.0.0"
}
```

### 2. Check Blockchain Status
```bash
curl http://localhost:3001/api/v1/blockchain/status
```

### 3. Get Available Batches
```bash
curl http://localhost:3001/api/v1/batches
```

### 4. Get Processors
```bash
curl http://localhost:3001/api/v1/processors
```

## Testing the System

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

### Add Processing Step with File

```bash
curl -X POST http://localhost:3001/api/v1/processing-steps \
  -F "batchId=COL001" \
  -F "processorId=PROC001" \
  -F "stepType=grinding" \
  -F "temperature=25" \
  -F "duration=120" \
  -F "notes=Fine grinding to powder form" \
  -F "certificate=@test-certificate.pdf"
```

### Get Processing Steps for Batch

```bash
curl http://localhost:3001/api/v1/processing-steps/batch/COL001
```

### Get Traceability Report

```bash
curl http://localhost:3001/api/v1/batches/COL001/traceability
```

### Get Blockchain Proof

```bash
# First add a step and get the step ID from response
curl http://localhost:3001/api/v1/processing-steps/1/proof
```

## API Documentation

Once running, visit: http://localhost:3001/

This provides complete API documentation with all available endpoints.

## Troubleshooting

### Common Issues

1. **"Error connecting to Besu"**
   ```bash
   # Check if Besu is running
   curl http://localhost:8545 -X POST -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   
   # Should return current block number
   ```

2. **"Contract not deployed"**
   ```bash
   # Redeploy the contract
   npm run deploy-contract
   ```

3. **"Database connection failed"**
   ```bash
   # Reset database
   rm -rf data/
   npm run migrate
   ```

4. **"Permission denied" on uploads**
   ```bash
   # Fix permissions
   mkdir -p uploads
   chmod 755 uploads
   ```

### Docker Issues

1. **Besu not starting**
   ```bash
   # Check logs
   docker-compose logs besu
   
   # Restart services
   docker-compose down
   docker-compose up -d
   ```

2. **Backend can't connect to Besu**
   ```bash
   # Check network connectivity
   docker-compose exec backend curl http://besu:8545
   ```

### Development Tips

1. **Watch logs in real-time**
   ```bash
   # Docker
   docker-compose logs -f backend
   
   # Manual setup
   npm run dev
   ```

2. **Reset everything**
   ```bash
   # Docker
   docker-compose down -v
   docker-compose up -d
   
   # Manual
   rm -rf data/ uploads/ besu-data/
   npm run migrate
   npm run deploy-contract
   ```

3. **Test with different accounts**
   
   Update `.env` with different private keys from `besu-genesis.json`:
   ```env
   # Account 1
   PRIVATE_KEY=0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63
   
   # Account 2  
   PRIVATE_KEY=0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
   
   # Account 3
   PRIVATE_KEY=0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
   ```

## Production Deployment

1. **Security Checklist**
   - [ ] Change default private keys
   - [ ] Use secure RPC endpoints
   - [ ] Enable HTTPS/SSL
   - [ ] Configure proper CORS
   - [ ] Set up monitoring
   - [ ] Use environment-specific configs

2. **Performance Optimization**
   - [ ] Use PostgreSQL instead of SQLite
   - [ ] Configure connection pooling
   - [ ] Set up caching (Redis)
   - [ ] Enable compression
   - [ ] Configure load balancing

3. **Monitoring**
   - [ ] Set up health checks
   - [ ] Monitor blockchain connectivity
   - [ ] Track transaction failures
   - [ ] Log aggregation
   - [ ] Alert configuration

## Support

For issues and questions:
1. Check this setup guide
2. Review API documentation at http://localhost:3001/
3. Check application logs
4. Verify Besu network status

## Next Steps

1. **Frontend Integration**: Update frontend to use these API endpoints
2. **Additional Features**: Add more processing step types
3. **Reporting**: Create detailed analytics dashboards
4. **Mobile App**: Build mobile interface for processors
5. **Multi-chain**: Support multiple blockchain networks
