const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const blockchainService = require('../services/blockchainService');
const database = require('../models/database');

// Initialize lab_tests table
const initLabTestsTable = () => {
  const db = database.db;
  
  db.run(`
    CREATE TABLE IF NOT EXISTS lab_tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id TEXT NOT NULL,
      test_type TEXT NOT NULL,
      result_value TEXT NOT NULL,
      unit TEXT,
      full_result TEXT NOT NULL,
      status TEXT NOT NULL,
      technician TEXT NOT NULL,
      notes TEXT,
      test_date TEXT NOT NULL,
      certificate_hash TEXT,
      blockchain_hash TEXT,
      transaction_id TEXT,
      block_number INTEGER,
      gas_used INTEGER,
      verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Initialize table on module load
initLabTestsTable();

/**
 * POST /api/v1/lab-tests
 * Add a new lab test result and save to blockchain
 */
router.post('/', async (req, res) => {
  try {
    const {
      batchId,
      testType,
      resultValue,
      unit,
      status,
      technician,
      notes,
      certificateHash
    } = req.body;

    // Validation
    if (!batchId || !testType || !resultValue || !status || !technician) {
      return res.status(400).json({
        error: 'Missing required fields: batchId, testType, resultValue, status, technician'
      });
    }

    // Check if batch exists in database using the database model
    const batches = await database.getBatches();
    const batch = batches.find(b => b.id === batchId || b.batch_id === batchId);

    if (!batch) {
      return res.status(404).json({
        error: 'Batch not found in database',
        message: `Batch ${batchId} does not exist in the system`
      });
    }

    const fullResult = `${resultValue}${unit || ''}`;
    const testDate = new Date().toISOString();

    // Prepare data for blockchain
    const blockchainData = {
      batchId,
      testType,
      resultValue,
      unit: unit || '',
      fullResult,
      status,
      technician,
      notes: notes || '',
      testDate,
      timestamp: Date.now()
    };

    // Generate hash for blockchain
    const dataHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(blockchainData))
      .digest('hex');

    console.log('Submitting lab test to blockchain:', blockchainData);

    // Submit to blockchain
    const blockchainResult = await blockchainService.addLabTest(
      batchId,
      dataHash,
      blockchainData
    );

    console.log('Blockchain submission result:', blockchainResult);

    // Insert into database using the database model
    const db = database.db;
    const insertQuery = `
      INSERT INTO lab_tests (
        batch_id, test_type, result_value, unit, full_result, 
        status, technician, notes, test_date, certificate_hash,
        blockchain_hash, transaction_id, block_number, gas_used, verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [
      batchId,
      testType,
      resultValue,
      unit || '',
      fullResult,
      status,
      technician,
      notes || '',
      testDate,
      certificateHash || null,
      dataHash,
      blockchainResult.transactionHash,
      blockchainResult.blockNumber,
      blockchainResult.gasUsed,
      1
    ], function(err) {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({
          error: 'Failed to save lab test to database',
          details: err.message
        });
      }

      const labTestId = this.lastID;

      res.status(201).json({
        success: true,
        data: {
          id: labTestId,
          batchId,
          testType,
          resultValue,
          unit: unit || '',
          fullResult,
          status,
          technician,
          notes: notes || '',
          testDate,
          batch: {
            id: batch.id,
            herbType: batch.herb_type,
            farmer: batch.farmer_name,
            quantity: batch.quantity
          },
          blockchain: {
            transactionHash: blockchainResult.transactionHash,
            blockNumber: blockchainResult.blockNumber,
            gasUsed: blockchainResult.gasUsed,
            network: 'Hyperledger Besu',
            contractAddress: blockchainResult.contractAddress,
            hash: dataHash,
            verified: true
          }
        },
        message: 'Lab test saved successfully to database and blockchain'
      });
    });

  } catch (error) {
    console.error('Lab test submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/v1/lab-tests/batch/:batchId
 * Get all lab tests for a specific batch
 */
router.get('/batch/:batchId', (req, res) => {
  const { batchId } = req.params;
  const db = database.db;

  const query = `
    SELECT * FROM lab_tests 
    WHERE batch_id = ? 
    ORDER BY created_at DESC
  `;

  db.all(query, [batchId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Database error',
        details: err.message
      });
    }

    res.json({
      success: true,
      data: rows
    });
  });
});

/**
 * GET /api/v1/lab-tests/:testId/proof
 * Get blockchain proof for a lab test
 */
router.get('/:testId/proof', async (req, res) => {
  try {
    const { testId } = req.params;
    const db = database.db;

    const query = `SELECT * FROM lab_tests WHERE id = ?`;

    db.get(query, [testId], async (err, test) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          details: err.message
        });
      }

      if (!test) {
        return res.status(404).json({
          error: 'Lab test not found'
        });
      }

      try {
        // Get blockchain proof
        const blockchainProof = await blockchainService.getTransactionReceipt(test.transaction_id);

        res.json({
          success: true,
          data: {
            testId: test.id,
            batchId: test.batch_id,
            blockchainHash: test.blockchain_hash,
            transactionHash: test.transaction_id,
            blockNumber: test.block_number,
            proof: {
              database: {
                id: test.id,
                batchId: test.batch_id,
                testType: test.test_type,
                result: test.full_result,
                status: test.status,
                technician: test.technician,
                testDate: test.test_date
              },
              blockchain: blockchainProof,
              verified: test.verified
            }
          }
        });
      } catch (blockchainError) {
        res.status(500).json({
          error: 'Failed to get blockchain proof',
          details: blockchainError.message
        });
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
