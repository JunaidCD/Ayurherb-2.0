const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const database = require('../models/database');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
    },
    fileFilter: (req, file, cb) => {
        // Allow common document and image formats
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and documents are allowed'));
        }
    }
});

// Add a new processing step
router.post('/', upload.single('certificate'), async (req, res) => {
    try {
        const {
            batchId,
            processorId,
            stepType,
            temperature,
            duration,
            notes
        } = req.body;

        // Validate required fields
        if (!batchId || !stepType) {
            return res.status(400).json({
                error: 'Missing required fields: batchId, stepType'
            });
        }

        // ONLY check if batch exists - nothing else!
        const batch = await database.getBatchById(batchId);
        if (!batch) {
            return res.status(404).json({
                error: 'Batch not found'
            });
        }

        let filePath = null;
        let fileHash = null;

        // Handle file upload if present
        if (req.file) {
            filePath = req.file.path;
            const fileBuffer = fs.readFileSync(filePath);
            fileHash = blockchainService.createFileHash(fileBuffer);
        }

        // Prepare step data
        const stepData = {
            batchId,
            processorId: processorId || 'PROC001', // Use default processor
            stepType,
            temperature: temperature ? parseFloat(temperature) : null,
            duration: duration ? parseInt(duration) : null,
            notes,
            filePath,
            fileHash
        };

        // Save to database first
        const dbStep = await database.addProcessingStep(stepData);

        try {
            // Add to blockchain
            const blockchainResult = await blockchainService.addProcessingStepToBlockchain(stepData);

            // Update database with blockchain information
            await database.updateProcessingStepBlockchain(dbStep.id, {
                blockchainHash: blockchainResult.stepHash,
                transactionId: blockchainResult.transactionHash,
                blockNumber: blockchainResult.blockNumber,
                gasUsed: blockchainResult.gasUsed
            });

            // Save blockchain transaction record
            await database.addBlockchainTransaction({
                transactionHash: blockchainResult.transactionHash,
                blockNumber: blockchainResult.blockNumber,
                blockHash: blockchainResult.blockHash,
                gasUsed: blockchainResult.gasUsed,
                gasPrice: process.env.GAS_PRICE,
                processingStepId: dbStep.id
            });

            res.status(201).json({
                success: true,
                data: {
                    id: dbStep.id,
                    ...stepData,
                    blockchain: {
                        transactionHash: blockchainResult.transactionHash,
                        blockNumber: blockchainResult.blockNumber?.toString() || '0',
                        stepHash: blockchainResult.stepHash,
                        gasUsed: blockchainResult.gasUsed?.toString() || '0'
                    }
                },
                message: 'Processing step added successfully to database and blockchain'
            });

        } catch (blockchainError) {
            console.error('Blockchain error:', blockchainError);
            
            // Return success for database save, but note blockchain failure
            res.status(201).json({
                success: true,
                data: {
                    id: dbStep.id,
                    ...stepData
                },
                warning: 'Processing step saved to database but blockchain transaction failed',
                blockchainError: blockchainError.message
            });
        }

    } catch (error) {
        console.error('Error adding processing step:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get processing steps for a batch
router.get('/batch/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Get steps from database
        const dbSteps = await database.getProcessingSteps(batchId);

        // Try to get blockchain verification for each step
        const stepsWithBlockchain = await Promise.all(
            dbSteps.map(async (step) => {
                let blockchainData = null;
                
                if (step.blockchain_hash) {
                    try {
                        blockchainData = await blockchainService.getProcessingStepFromBlockchain(step.blockchain_hash);
                    } catch (error) {
                        console.warn('Could not fetch blockchain data for step:', step.id);
                    }
                }

                return {
                    ...step,
                    blockchain: blockchainData,
                    verified: !!blockchainData
                };
            })
        );

        res.json({
            success: true,
            data: stepsWithBlockchain
        });

    } catch (error) {
        console.error('Error getting processing steps:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get a specific processing step with full details
router.get('/:stepId', async (req, res) => {
    try {
        const { stepId } = req.params;

        // Get step from database
        const dbStep = await database.getProcessingStepById(stepId);
        if (!dbStep) {
            return res.status(404).json({
                error: 'Processing step not found'
            });
        }

        let blockchainData = null;
        let transactionReceipt = null;

        // Get blockchain verification if available
        if (dbStep.blockchain_hash) {
            try {
                blockchainData = await blockchainService.getProcessingStepFromBlockchain(dbStep.blockchain_hash);
            } catch (error) {
                console.warn('Could not fetch blockchain data:', error);
            }
        }

        // Get transaction receipt if available
        if (dbStep.transaction_id) {
            try {
                transactionReceipt = await blockchainService.getTransactionReceipt(dbStep.transaction_id);
            } catch (error) {
                console.warn('Could not fetch transaction receipt:', error);
            }
        }

        res.json({
            success: true,
            data: {
                ...dbStep,
                blockchain: blockchainData,
                transactionReceipt,
                verified: !!blockchainData
            }
        });

    } catch (error) {
        console.error('Error getting processing step:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Verify a processing step on blockchain
router.post('/:stepId/verify', async (req, res) => {
    try {
        const { stepId } = req.params;

        // Get step from database
        const dbStep = await database.getProcessingStepById(stepId);
        if (!dbStep) {
            return res.status(404).json({
                error: 'Processing step not found'
            });
        }

        if (!dbStep.blockchain_hash) {
            return res.status(400).json({
                error: 'Processing step not found on blockchain'
            });
        }

        // Verify on blockchain
        const verificationResult = await blockchainService.verifyProcessingStep(dbStep.blockchain_hash);

        res.json({
            success: true,
            data: {
                stepId: stepId,
                blockchainHash: dbStep.blockchain_hash,
                verification: verificationResult
            },
            message: 'Processing step verified on blockchain'
        });

    } catch (error) {
        console.error('Error verifying processing step:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get blockchain proof for a processing step
router.get('/:stepId/proof', async (req, res) => {
    try {
        const { stepId } = req.params;

        // Get step from database
        const dbStep = await database.getProcessingStepById(stepId);
        if (!dbStep) {
            return res.status(404).json({
                error: 'Processing step not found'
            });
        }

        if (!dbStep.blockchain_hash || !dbStep.transaction_id) {
            return res.status(404).json({
                error: 'No blockchain proof available for this step'
            });
        }

        // Get blockchain data and transaction receipt
        const [blockchainData, transactionReceipt] = await Promise.all([
            blockchainService.getProcessingStepFromBlockchain(dbStep.blockchain_hash),
            blockchainService.getTransactionReceipt(dbStep.transaction_id)
        ]);

        res.json({
            success: true,
            data: {
                stepId: stepId,
                blockchainHash: dbStep.blockchain_hash,
                transactionHash: dbStep.transaction_id,
                blockNumber: dbStep.block_number,
                proof: {
                    database: {
                        id: dbStep.id,
                        batchId: dbStep.batch_id,
                        processorId: dbStep.processor_id,
                        stepType: dbStep.step_type,
                        temperature: dbStep.temperature,
                        duration: dbStep.duration,
                        notes: dbStep.notes,
                        createdAt: dbStep.created_at
                    },
                    blockchain: blockchainData,
                    transaction: transactionReceipt,
                    verified: true
                }
            }
        });

    } catch (error) {
        console.error('Error getting blockchain proof:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;
