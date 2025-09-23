const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = process.env.DB_PATH || './data/ayurherb.db';
        this.init();
    }

    init() {
        // Ensure data directory exists
        const dataDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Connect to database
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to SQLite database');
                this.createTables();
            }
        });
    }

    createTables() {
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        this.db.exec(schema, (err) => {
            if (err) {
                console.error('Error creating tables:', err.message);
            } else {
                console.log('Database tables created successfully');
            }
        });
    }

    // Processing Steps operations
    async addProcessingStep(stepData) {
        return new Promise((resolve, reject) => {
            const {
                batchId,
                processorId,
                stepType,
                temperature,
                duration,
                notes,
                filePath,
                fileHash
            } = stepData;

            const sql = `
                INSERT INTO processing_steps 
                (batch_id, processor_id, step_type, temperature, duration, notes, file_path, file_hash)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            this.db.run(sql, [batchId, processorId, stepType, temperature, duration, notes, filePath, fileHash], 
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, ...stepData });
                    }
                }
            );
        });
    }

    async updateProcessingStepBlockchain(stepId, blockchainData) {
        return new Promise((resolve, reject) => {
            const {
                blockchainHash,
                transactionId,
                blockNumber,
                gasUsed
            } = blockchainData;

            const sql = `
                UPDATE processing_steps 
                SET blockchain_hash = ?, transaction_id = ?, block_number = ?, gas_used = ?
                WHERE id = ?
            `;

            this.db.run(sql, [blockchainHash, transactionId, blockNumber, gasUsed, stepId], 
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ changes: this.changes });
                    }
                }
            );
        });
    }

    async getProcessingSteps(batchId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT ps.*, p.name as processor_name, p.location as processor_location
                FROM processing_steps ps
                LEFT JOIN processors p ON ps.processor_id = p.id
                WHERE ps.batch_id = ?
                ORDER BY ps.created_at ASC
            `;

            this.db.all(sql, [batchId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getProcessingStepById(stepId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT ps.*, p.name as processor_name, p.location as processor_location,
                       b.herb_type, b.farmer_name, b.origin_location
                FROM processing_steps ps
                LEFT JOIN processors p ON ps.processor_id = p.id
                LEFT JOIN batches b ON ps.batch_id = b.id
                WHERE ps.id = ?
            `;

            this.db.get(sql, [stepId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Batch operations
    async getBatches() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM batches 
                WHERE status = 'verified'
                ORDER BY created_at DESC
            `;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getBatchById(batchId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM batches WHERE id = ?`;

            this.db.get(sql, [batchId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Processor operations
    async getProcessors() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM processors ORDER BY name`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getProcessorById(processorId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM processors WHERE id = ?`;

            this.db.get(sql, [processorId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Blockchain transaction operations
    async addBlockchainTransaction(transactionData) {
        return new Promise((resolve, reject) => {
            const {
                transactionHash,
                blockNumber,
                blockHash,
                gasUsed,
                gasPrice,
                processingStepId
            } = transactionData;

            const sql = `
                INSERT INTO blockchain_transactions 
                (transaction_hash, block_number, block_hash, gas_used, gas_price, processing_step_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            this.db.run(sql, [transactionHash, blockNumber, blockHash, gasUsed, gasPrice, processingStepId], 
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, ...transactionData });
                    }
                }
            );
        });
    }

    async updateTransactionStatus(transactionHash, status) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE blockchain_transactions 
                SET status = ?, confirmed_at = CURRENT_TIMESTAMP
                WHERE transaction_hash = ?
            `;

            this.db.run(sql, [status, transactionHash], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
}

module.exports = new Database();
