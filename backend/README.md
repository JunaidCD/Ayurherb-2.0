# Ayurherb 2.0 Backend

A robust backend API for the Ayurherb 2.0 application with Hyperledger Besu blockchain integration for processing step verification and traceability.

## Features

- **Processing Step Management**: Add, track, and verify herb processing steps
- **Blockchain Integration**: Immutable storage on Hyperledger Besu
- **File Upload Support**: Certificate and document attachments
- **Traceability Reports**: Complete batch processing history
- **Database Storage**: SQLite for local data management
- **RESTful API**: Clean and documented endpoints

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │ Hyperledger     │
│   (React)       │◄──►│   (Express.js)  │◄──►│ Besu Network    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │   (Local Data)  │
                       └─────────────────┘
```

## Prerequisites

- Node.js 16+ 
- Hyperledger Besu network running
- SQLite (included with Node.js)

## Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   BESU_RPC_URL=http://localhost:8545
   PRIVATE_KEY=your_private_key_here
   DB_PATH=./data/ayurherb.db
   ```

4. **Initialize database**
   ```bash
   npm run migrate
   ```

5. **Deploy smart contract** (requires Besu running)
   ```bash
   npm run deploy-contract
   ```

6. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Processing Steps
- `POST /api/v1/processing-steps` - Add new processing step
- `GET /api/v1/processing-steps/batch/:batchId` - Get steps for batch
- `GET /api/v1/processing-steps/:stepId` - Get specific step details
- `POST /api/v1/processing-steps/:stepId/verify` - Verify step on blockchain
- `GET /api/v1/processing-steps/:stepId/proof` - Get blockchain proof

### Batches
- `GET /api/v1/batches` - Get all available batches
- `GET /api/v1/batches/:batchId` - Get batch with processing steps
- `GET /api/v1/batches/:batchId/blockchain` - Get blockchain verification
- `GET /api/v1/batches/:batchId/traceability` - Get full traceability report

### Processors
- `GET /api/v1/processors` - Get all processors
- `GET /api/v1/processors/:processorId` - Get specific processor

### Blockchain
- `GET /api/v1/blockchain/status` - Network status
- `GET /api/v1/blockchain/transaction/:txHash` - Transaction details
- `POST /api/v1/blockchain/verify-hash` - Verify data hash

## Usage Examples

### Adding a Processing Step

```bash
curl -X POST http://localhost:3001/api/v1/processing-steps \
  -H "Content-Type: multipart/form-data" \
  -F "batchId=COL001" \
  -F "processorId=PROC001" \
  -F "stepType=drying" \
  -F "temperature=60" \
  -F "duration=480" \
  -F "notes=Controlled drying at optimal temperature" \
  -F "certificate=@certificate.pdf"
```

### Getting Batch Traceability

```bash
curl http://localhost:3001/api/v1/batches/COL001/traceability
```

## Data Flow

1. **Processor adds processing step**:
   - Data saved to SQLite database
   - Hash created from step data
   - Transaction sent to Besu blockchain
   - Blockchain transaction ID stored in database

2. **Verification process**:
   - Database record retrieved
   - Blockchain data fetched using stored hash
   - Data integrity verified by comparing hashes
   - Complete audit trail provided

## Smart Contract

The `ProcessingSteps.sol` contract stores:
- Batch ID and processor information
- Processing step details (type, temperature, duration)
- File hashes for certificates
- Timestamps and submitter addresses
- Immutable audit trail

## File Structure

```
backend/
├── contracts/           # Solidity smart contracts
├── database/           # Database schema and migrations
├── models/             # Database models and operations
├── routes/             # API route handlers
├── scripts/            # Deployment and utility scripts
├── services/           # Business logic and blockchain service
├── uploads/            # File upload storage
├── server.js           # Main server file
└── package.json        # Dependencies and scripts
```

## Development

### Running Tests
```bash
npm test
```

### Database Reset
```bash
rm -rf data/
npm run migrate
```

### Contract Redeployment
```bash
npm run deploy-contract
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DB_PATH` | Database file path | ./data/ayurherb.db |
| `BESU_RPC_URL` | Besu RPC endpoint | http://localhost:8545 |
| `PRIVATE_KEY` | Ethereum private key | Required |
| `CONTRACT_ADDRESS` | Deployed contract address | Auto-set |
| `GAS_LIMIT` | Transaction gas limit | 3000000 |
| `GAS_PRICE` | Gas price in wei | 20000000000 |
| `UPLOAD_DIR` | File upload directory | ./uploads |
| `MAX_FILE_SIZE` | Max upload size in bytes | 10485760 |

## Security Considerations

- Private keys should be kept secure and never committed to version control
- File uploads are validated for type and size
- Database queries use parameterized statements
- CORS is configured for frontend access
- Error messages don't expose sensitive information

## Troubleshooting

### Common Issues

1. **Contract deployment fails**
   - Ensure Besu is running and accessible
   - Check private key format (must start with 0x)
   - Verify sufficient ETH balance for gas

2. **Database connection errors**
   - Check file permissions in data directory
   - Ensure SQLite is available

3. **Blockchain connection issues**
   - Verify Besu RPC URL is correct
   - Check network connectivity
   - Ensure Besu is synced and running

### Logs

Server logs include:
- Database operations
- Blockchain transactions
- API request/response details
- Error stack traces (in development)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use secure private key management
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use process manager (PM2)
6. Configure log rotation
7. Set up monitoring and alerts

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Ensure blockchain integration works
5. Test with actual Besu network

## License

MIT License - see LICENSE file for details
