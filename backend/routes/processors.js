const express = require('express');
const database = require('../models/database');

const router = express.Router();

// Get all processors
router.get('/', async (req, res) => {
    try {
        const processors = await database.getProcessors();
        
        res.json({
            success: true,
            data: processors
        });

    } catch (error) {
        console.error('Error getting processors:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Get a specific processor
router.get('/:processorId', async (req, res) => {
    try {
        const { processorId } = req.params;

        const processor = await database.getProcessorById(processorId);
        if (!processor) {
            return res.status(404).json({
                error: 'Processor not found'
            });
        }

        res.json({
            success: true,
            data: processor
        });

    } catch (error) {
        console.error('Error getting processor:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;
