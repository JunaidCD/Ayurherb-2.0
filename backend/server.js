const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// Import routes
const processingStepsRoutes = require('./routes/processingSteps');
const batchesRoutes = require('./routes/batches');
const processorsRoutes = require('./routes/processors');
const blockchainRoutes = require('./routes/blockchain');

// Import services
const database = require('./models/database');
const blockchainService = require('./services/blockchainService');

const app = express();
const PORT = process.env.PORT || 3001;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const blockchainConnected = await blockchainService.isConnected();
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                blockchain: blockchainConnected ? 'connected' : 'disconnected'
            },
            version: '1.0.0'
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// API Routes
app.use(`${API_PREFIX}/processing-steps`, processingStepsRoutes);
app.use(`${API_PREFIX}/batches`, batchesRoutes);
app.use(`${API_PREFIX}/processors`, processorsRoutes);
app.use(`${API_PREFIX}/blockchain`, blockchainRoutes);

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        name: 'Ayurherb Backend API',
        version: '1.0.0',
        description: 'Backend API for Ayurherb 2.0 with Hyperledger Besu integration',
        endpoints: {
            health: 'GET /health',
            processingSteps: {
                add: 'POST /api/v1/processing-steps',
                getByBatch: 'GET /api/v1/processing-steps/batch/:batchId',
                getById: 'GET /api/v1/processing-steps/:stepId',
                verify: 'POST /api/v1/processing-steps/:stepId/verify',
                proof: 'GET /api/v1/processing-steps/:stepId/proof'
            },
            batches: {
                getAll: 'GET /api/v1/batches',
                getById: 'GET /api/v1/batches/:batchId',
                blockchain: 'GET /api/v1/batches/:batchId/blockchain',
                traceability: 'GET /api/v1/batches/:batchId/traceability'
            },
            processors: {
                getAll: 'GET /api/v1/processors',
                getById: 'GET /api/v1/processors/:processorId'
            },
            blockchain: {
                status: 'GET /api/v1/blockchain/status',
                transaction: 'GET /api/v1/blockchain/transaction/:txHash',
                verifyHash: 'POST /api/v1/blockchain/verify-hash'
            }
        },
        blockchain: {
            network: 'Hyperledger Besu',
            rpcUrl: process.env.BESU_RPC_URL,
            contractAddress: process.env.CONTRACT_ADDRESS || 'Not deployed'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                details: 'Maximum file size is 10MB'
            });
        }
    }
    
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    database.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    database.close();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Ayurherb Backend Server Started
📍 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📊 API Base: ${API_PREFIX}
🔗 Blockchain: ${process.env.BESU_RPC_URL || 'http://localhost:8545'}
📁 Upload Directory: ${uploadDir}
⚡ Health Check: http://localhost:${PORT}/health
📖 API Docs: http://localhost:${PORT}/
    `);
});

module.exports = app;
