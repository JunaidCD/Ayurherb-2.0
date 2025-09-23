const express = require('express');
const database = require('../models/database');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// Get all available batches for processing
router.get('/', async (req, res) => {
    try {
        const batches = await database.getBatches();
        
        // Add processing step count for each batch
        const batchesWithSteps = await Promise.all(
            batches.map(async (batch) => {
                const steps = await database.getProcessingSteps(batch.id);
                return {
                    ...batch,
                    stepCount: steps.length,
                    lastProcessed: steps.length > 0 ? steps[steps.length - 1].created_at : null
                };
            })
        );

        res.json({
            success: true,
            data: batchesWithSteps
        });

    } catch (error) {
        console.error('Error getting batches:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get a specific batch with all its processing steps
router.get('/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Get batch details
        const batch = await database.getBatchById(batchId);
        if (!batch) {
            return res.status(404).json({
                error: 'Batch not found'
            });
        }

        // Get processing steps
        const steps = await database.getProcessingSteps(batchId);

        // Add blockchain verification for each step
        const stepsWithBlockchain = await Promise.all(
            steps.map(async (step) => {
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
            data: {
                batch,
                steps: stepsWithBlockchain,
                stepCount: stepsWithBlockchain.length,
                verifiedSteps: stepsWithBlockchain.filter(step => step.verified).length
            }
        });

    } catch (error) {
        console.error('Error getting batch details:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get blockchain verification for entire batch
router.get('/:batchId/blockchain', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Verify batch exists
        const batch = await database.getBatchById(batchId);
        if (!batch) {
            return res.status(404).json({
                error: 'Batch not found'
            });
        }

        try {
            // Get all steps from blockchain
            const blockchainSteps = await blockchainService.getBatchStepsFromBlockchain(batchId);
            
            // Get corresponding database steps
            const dbSteps = await database.getProcessingSteps(batchId);

            // Compare and create verification report
            const verification = {
                batchId,
                totalStepsInDatabase: dbSteps.length,
                totalStepsOnBlockchain: blockchainSteps.length,
                verified: dbSteps.length === blockchainSteps.length,
                steps: blockchainSteps.map((blockchainStep, index) => {
                    const dbStep = dbSteps.find(db => db.blockchain_hash === blockchainStep.hash);
                    return {
                        hash: blockchainStep.hash,
                        blockchain: blockchainStep,
                        database: dbStep || null,
                        matches: !!dbStep
                    };
                })
            };

            res.json({
                success: true,
                data: verification
            });

        } catch (blockchainError) {
            // If blockchain is not available, return database info only
            const dbSteps = await database.getProcessingSteps(batchId);
            
            res.json({
                success: true,
                data: {
                    batchId,
                    totalStepsInDatabase: dbSteps.length,
                    totalStepsOnBlockchain: 0,
                    verified: false,
                    blockchainAvailable: false,
                    error: blockchainError.message,
                    steps: dbSteps.map(step => ({
                        database: step,
                        blockchain: null,
                        matches: false
                    }))
                }
            });
        }

    } catch (error) {
        console.error('Error getting batch blockchain verification:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get batch traceability report
router.get('/:batchId/traceability', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Get batch details
        const batch = await database.getBatchById(batchId);
        if (!batch) {
            return res.status(404).json({
                error: 'Batch not found'
            });
        }

        // Get all processing steps with full details
        const steps = await database.getProcessingSteps(batchId);

        // Create comprehensive traceability report
        const traceabilityReport = {
            batch: {
                id: batch.id,
                herbType: batch.herb_type,
                farmer: {
                    id: batch.farmer_id,
                    name: batch.farmer_name
                },
                origin: {
                    location: batch.origin_location,
                    harvestDate: batch.harvest_date
                },
                quantity: batch.quantity,
                qualityGrade: batch.quality_grade,
                status: batch.status,
                receivedAt: batch.created_at
            },
            processing: {
                totalSteps: steps.length,
                timeline: steps.map(step => ({
                    id: step.id,
                    type: step.step_type,
                    processor: {
                        id: step.processor_id,
                        name: step.processor_name,
                        location: step.processor_location
                    },
                    parameters: {
                        temperature: step.temperature,
                        duration: step.duration
                    },
                    notes: step.notes,
                    timestamp: step.created_at,
                    blockchain: {
                        hash: step.blockchain_hash,
                        transactionId: step.transaction_id,
                        blockNumber: step.block_number,
                        verified: !!step.blockchain_hash
                    },
                    files: step.file_path ? {
                        path: step.file_path,
                        hash: step.file_hash
                    } : null
                }))
            },
            verification: {
                totalSteps: steps.length,
                verifiedSteps: steps.filter(step => step.blockchain_hash).length,
                verificationRate: steps.length > 0 ? 
                    (steps.filter(step => step.blockchain_hash).length / steps.length * 100).toFixed(2) + '%' : '0%'
            }
        };

        res.json({
            success: true,
            data: traceabilityReport
        });

    } catch (error) {
        console.error('Error generating traceability report:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;
