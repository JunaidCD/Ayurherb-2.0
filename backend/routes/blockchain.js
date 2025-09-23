const express = require('express');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// Get blockchain network status
router.get('/status', async (req, res) => {
    try {
        const isConnected = await blockchainService.isConnected();
        
        if (isConnected) {
            const networkInfo = await blockchainService.getNetworkInfo();
            res.json({
                success: true,
                data: {
                    connected: true,
                    ...networkInfo
                }
            });
        } else {
            res.json({
                success: false,
                data: {
                    connected: false,
                    error: 'Not connected to Besu network'
                }
            });
        }

    } catch (error) {
        console.error('Error getting blockchain status:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get transaction receipt
router.get('/transaction/:txHash', async (req, res) => {
    try {
        const { txHash } = req.params;

        const receipt = await blockchainService.getTransactionReceipt(txHash);
        
        if (!receipt) {
            return res.status(404).json({
                error: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            data: receipt
        });

    } catch (error) {
        console.error('Error getting transaction receipt:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Verify data integrity by comparing hash
router.post('/verify-hash', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({
                error: 'Data is required for hash verification'
            });
        }

        const hash = blockchainService.createDataHash(data);

        res.json({
            success: true,
            data: {
                originalData: data,
                hash: hash,
                algorithm: 'SHA-256'
            }
        });

    } catch (error) {
        console.error('Error verifying hash:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;
