# Ayurherb Backend API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
Currently, no authentication is required. In production, implement JWT or API key authentication.

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "error": "Error description",
  "details": "Additional error details"
}
```

## Endpoints

### Health Check

#### GET /health
Check server health and service status.

**Response:**
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

---

## Processing Steps

### POST /api/v1/processing-steps
Add a new processing step to a batch.

**Content-Type:** `multipart/form-data` or `application/json`

**Parameters:**
- `batchId` (string, required): Batch identifier
- `processorId` (string, required): Processor identifier  
- `stepType` (string, required): Type of processing step
- `temperature` (number, optional): Temperature in Celsius
- `duration` (number, optional): Duration in minutes
- `notes` (string, optional): Additional notes
- `certificate` (file, optional): Certificate or document file

**Example Request:**
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

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "batchId": "COL001",
    "processorId": "PROC001",
    "stepType": "drying",
    "temperature": 60,
    "duration": 480,
    "notes": "Controlled drying at optimal temperature",
    "blockchain": {
      "transactionHash": "0x1234...",
      "blockNumber": 12345,
      "stepHash": "0xabcd...",
      "gasUsed": 150000
    }
  },
  "message": "Processing step added successfully to database and blockchain"
}
```

### GET /api/v1/processing-steps/batch/:batchId
Get all processing steps for a specific batch.

**Parameters:**
- `batchId` (string): Batch identifier

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "batch_id": "COL001",
      "processor_id": "PROC001",
      "step_type": "drying",
      "temperature": 60,
      "duration": 480,
      "notes": "Controlled drying",
      "created_at": "2024-01-23T10:30:00.000Z",
      "processor_name": "Ayurvedic Processing Unit Kerala",
      "blockchain_hash": "0xabcd...",
      "transaction_id": "0x1234...",
      "verified": true
    }
  ]
}
```

### GET /api/v1/processing-steps/:stepId
Get detailed information about a specific processing step.

**Parameters:**
- `stepId` (number): Processing step ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "batch_id": "COL001",
    "processor_id": "PROC001",
    "step_type": "drying",
    "temperature": 60,
    "duration": 480,
    "notes": "Controlled drying",
    "created_at": "2024-01-23T10:30:00.000Z",
    "processor_name": "Ayurvedic Processing Unit Kerala",
    "herb_type": "Ashwagandha",
    "farmer_name": "Rajesh Kumar",
    "blockchain": {
      "batchId": "COL001",
      "processorId": "PROC001",
      "stepType": "drying",
      "temperature": 60,
      "duration": 480,
      "timestamp": 1706012200,
      "submittedBy": "0xfe3b..."
    },
    "verified": true
  }
}
```

### POST /api/v1/processing-steps/:stepId/verify
Verify a processing step on the blockchain.

**Parameters:**
- `stepId` (number): Processing step ID

**Response:**
```json
{
  "success": true,
  "data": {
    "stepId": 1,
    "blockchainHash": "0xabcd...",
    "verification": {
      "transactionHash": "0x5678...",
      "blockNumber": 12346,
      "gasUsed": 50000,
      "status": "verified"
    }
  },
  "message": "Processing step verified on blockchain"
}
```

### GET /api/v1/processing-steps/:stepId/proof
Get blockchain proof for a processing step.

**Parameters:**
- `stepId` (number): Processing step ID

**Response:**
```json
{
  "success": true,
  "data": {
    "stepId": 1,
    "blockchainHash": "0xabcd...",
    "transactionHash": "0x1234...",
    "blockNumber": 12345,
    "proof": {
      "database": {
        "id": 1,
        "batchId": "COL001",
        "processorId": "PROC001",
        "stepType": "drying",
        "temperature": 60,
        "duration": 480,
        "createdAt": "2024-01-23T10:30:00.000Z"
      },
      "blockchain": {
        "batchId": "COL001",
        "processorId": "PROC001",
        "stepType": "drying",
        "temperature": 60,
        "duration": 480,
        "timestamp": 1706012200,
        "submittedBy": "0xfe3b..."
      },
      "transaction": {
        "blockHash": "0x9abc...",
        "blockNumber": 12345,
        "gasUsed": 150000,
        "status": "0x1"
      },
      "verified": true
    }
  }
}
```

---

## Batches

### GET /api/v1/batches
Get all available batches for processing.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "COL001",
      "herb_type": "Ashwagandha",
      "farmer_id": "FARM001",
      "farmer_name": "Rajesh Kumar",
      "origin_location": "Kerala, India",
      "harvest_date": "2024-01-15",
      "quantity": 500.0,
      "quality_grade": "Premium",
      "status": "verified",
      "created_at": "2024-01-23T08:00:00.000Z",
      "stepCount": 2,
      "lastProcessed": "2024-01-23T10:30:00.000Z"
    }
  ]
}
```

### GET /api/v1/batches/:batchId
Get detailed information about a specific batch including all processing steps.

**Parameters:**
- `batchId` (string): Batch identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "batch": {
      "id": "COL001",
      "herb_type": "Ashwagandha",
      "farmer_name": "Rajesh Kumar",
      "origin_location": "Kerala, India",
      "quantity": 500.0,
      "quality_grade": "Premium"
    },
    "steps": [
      {
        "id": 1,
        "step_type": "drying",
        "processor_name": "Ayurvedic Processing Unit Kerala",
        "temperature": 60,
        "duration": 480,
        "verified": true
      }
    ],
    "stepCount": 1,
    "verifiedSteps": 1
  }
}
```

### GET /api/v1/batches/:batchId/blockchain
Get blockchain verification status for all steps in a batch.

**Parameters:**
- `batchId` (string): Batch identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "batchId": "COL001",
    "totalStepsInDatabase": 2,
    "totalStepsOnBlockchain": 2,
    "verified": true,
    "steps": [
      {
        "hash": "0xabcd...",
        "blockchain": {
          "batchId": "COL001",
          "stepType": "drying",
          "timestamp": 1706012200
        },
        "database": {
          "id": 1,
          "step_type": "drying"
        },
        "matches": true
      }
    ]
  }
}
```

### GET /api/v1/batches/:batchId/traceability
Get complete traceability report for a batch.

**Parameters:**
- `batchId` (string): Batch identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "batch": {
      "id": "COL001",
      "herbType": "Ashwagandha",
      "farmer": {
        "id": "FARM001",
        "name": "Rajesh Kumar"
      },
      "origin": {
        "location": "Kerala, India",
        "harvestDate": "2024-01-15"
      },
      "quantity": 500.0,
      "qualityGrade": "Premium",
      "receivedAt": "2024-01-23T08:00:00.000Z"
    },
    "processing": {
      "totalSteps": 2,
      "timeline": [
        {
          "id": 1,
          "type": "drying",
          "processor": {
            "id": "PROC001",
            "name": "Ayurvedic Processing Unit Kerala",
            "location": "Kochi, Kerala, India"
          },
          "parameters": {
            "temperature": 60,
            "duration": 480
          },
          "notes": "Controlled drying at optimal temperature",
          "timestamp": "2024-01-23T10:30:00.000Z",
          "blockchain": {
            "hash": "0xabcd...",
            "transactionId": "0x1234...",
            "blockNumber": 12345,
            "verified": true
          }
        }
      ]
    },
    "verification": {
      "totalSteps": 2,
      "verifiedSteps": 2,
      "verificationRate": "100%"
    }
  }
}
```

---

## Processors

### GET /api/v1/processors
Get all registered processors.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "PROC001",
      "name": "Ayurvedic Processing Unit Kerala",
      "location": "Kochi, Kerala, India",
      "certification": "ISO 9001:2015, GMP",
      "contact_info": "contact@apukerala.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/v1/processors/:processorId
Get information about a specific processor.

**Parameters:**
- `processorId` (string): Processor identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "PROC001",
    "name": "Ayurvedic Processing Unit Kerala",
    "location": "Kochi, Kerala, India",
    "certification": "ISO 9001:2015, GMP",
    "contact_info": "contact@apukerala.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Blockchain

### GET /api/v1/blockchain/status
Get blockchain network status and connection information.

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "networkId": 1337,
    "blockNumber": 12345,
    "gasPrice": "20000000000",
    "account": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
    "contractAddress": "0x1234567890abcdef..."
  }
}
```

### GET /api/v1/blockchain/transaction/:txHash
Get transaction receipt and details.

**Parameters:**
- `txHash` (string): Transaction hash

**Response:**
```json
{
  "success": true,
  "data": {
    "blockHash": "0x9abc...",
    "blockNumber": 12345,
    "gasUsed": 150000,
    "status": "0x1",
    "transactionHash": "0x1234...",
    "from": "0xfe3b...",
    "to": "0x1234..."
  }
}
```

### POST /api/v1/blockchain/verify-hash
Verify data integrity by generating hash.

**Request Body:**
```json
{
  "data": {
    "batchId": "COL001",
    "processorId": "PROC001",
    "stepType": "drying",
    "temperature": 60,
    "duration": 480,
    "notes": "Test data"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalData": { ... },
    "hash": "0xabcdef1234567890...",
    "algorithm": "SHA-256"
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Common Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: batchId, processorId, stepType"
}
```

### 404 Not Found
```json
{
  "error": "Batch not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

## Rate Limiting
Currently no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## File Uploads
- Maximum file size: 10MB
- Allowed formats: JPEG, PNG, PDF, DOC, DOCX, TXT
- Files are stored in `/uploads` directory
- File hashes are calculated and stored for integrity verification

## Blockchain Integration
- All processing steps are stored on Hyperledger Besu
- Smart contract address is configured in environment variables
- Transaction hashes and block numbers are stored in database
- Data integrity is verified through hash comparison

## Development Notes
- Database uses SQLite for development (consider PostgreSQL for production)
- Blockchain connection is required for full functionality
- File uploads require proper directory permissions
- Environment variables must be configured before starting
