const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class BlockchainService {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.contractABI = null;
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.init();
    }

    async init() {
        try {
            // Initialize Web3 connection to Besu
            this.web3 = new Web3(process.env.BESU_RPC_URL || 'http://localhost:8545');
            
            // Set up account from private key
            if (process.env.PRIVATE_KEY) {
                this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
                this.web3.eth.accounts.wallet.add(this.account);
                this.web3.eth.defaultAccount = this.account.address;
            }

            // Load contract ABI
            await this.loadContractABI();

            // Initialize contract if address is provided and valid
            if (this.contractAddress && this.contractABI && this.isValidAddress(this.contractAddress)) {
                this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
                console.log('Smart contract initialized at:', this.contractAddress);
            } else {
                console.log('⚠️  Smart contract not initialized - missing or invalid contract address');
                console.log('   System will run without blockchain integration');
            }

            console.log('Blockchain service initialized successfully');
            console.log('Connected to Besu at:', process.env.BESU_RPC_URL);
            console.log('Using account:', this.account?.address);
        } catch (error) {
            console.error('Error initializing blockchain service:', error);
        }
    }

    // Check if address is valid Ethereum address
    isValidAddress(address) {
        if (!address) return false;
        // Ethereum addresses are 42 characters long (including 0x prefix)
        if (address.length !== 42) return false;
        // Must start with 0x
        if (!address.startsWith('0x')) return false;
        // Must be valid hex
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    async loadContractABI() {
        try {
            // Try to load compiled contract ABI
            const abiPath = path.join(__dirname, '../contracts/ProcessingSteps.json');
            if (fs.existsSync(abiPath)) {
                const contractData = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
                this.contractABI = contractData.abi;
            } else {
                // If compiled ABI doesn't exist, use the basic ABI
                this.contractABI = [
                    {
                        "inputs": [
                            {"internalType": "string", "name": "_batchId", "type": "string"},
                            {"internalType": "string", "name": "_processorId", "type": "string"},
                            {"internalType": "string", "name": "_stepType", "type": "string"},
                            {"internalType": "uint256", "name": "_temperature", "type": "uint256"},
                            {"internalType": "uint256", "name": "_duration", "type": "uint256"},
                            {"internalType": "string", "name": "_notes", "type": "string"},
                            {"internalType": "string", "name": "_fileHash", "type": "string"}
                        ],
                        "name": "addProcessingStep",
                        "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [{"internalType": "bytes32", "name": "_stepHash", "type": "bytes32"}],
                        "name": "getProcessingStep",
                        "outputs": [
                            {"internalType": "string", "name": "batchId", "type": "string"},
                            {"internalType": "string", "name": "processorId", "type": "string"},
                            {"internalType": "string", "name": "stepType", "type": "string"},
                            {"internalType": "uint256", "name": "temperature", "type": "uint256"},
                            {"internalType": "uint256", "name": "duration", "type": "uint256"},
                            {"internalType": "string", "name": "notes", "type": "string"},
                            {"internalType": "string", "name": "fileHash", "type": "string"},
                            {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                            {"internalType": "address", "name": "submittedBy", "type": "address"}
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [{"internalType": "string", "name": "_batchId", "type": "string"}],
                        "name": "getBatchSteps",
                        "outputs": [{"internalType": "bytes32[]", "name": "", "type": "bytes32[]"}],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [{"internalType": "bytes32", "name": "_stepHash", "type": "bytes32"}],
                        "name": "verifyProcessingStep",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {"indexed": true, "internalType": "bytes32", "name": "stepHash", "type": "bytes32"},
                            {"indexed": true, "internalType": "string", "name": "batchId", "type": "string"},
                            {"indexed": false, "internalType": "string", "name": "processorId", "type": "string"},
                            {"indexed": false, "internalType": "string", "name": "stepType", "type": "string"},
                            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
                        ],
                        "name": "ProcessingStepAdded",
                        "type": "event"
                    }
                ];
            }
        } catch (error) {
            console.error('Error loading contract ABI:', error);
        }
    }

    // Create hash of processing step data
    createDataHash(stepData) {
        const {
            batchId,
            processorId,
            stepType,
            temperature,
            duration,
            notes,
            fileHash
        } = stepData;

        const dataString = `${batchId}${processorId}${stepType}${temperature}${duration}${notes}${fileHash}`;
        return crypto.createHash('sha256').update(dataString).digest('hex');
    }

    // Create hash of file content
    createFileHash(fileBuffer) {
        return crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }

    // Add processing step to blockchain
    async addProcessingStepToBlockchain(stepData) {
        try {
            if (!this.contract) {
                console.log('⚠️  Blockchain integration not available - skipping blockchain storage');
                return {
                    transactionHash: null,
                    blockNumber: null,
                    blockHash: null,
                    gasUsed: null,
                    stepHash: this.createDataHash(stepData),
                    status: 'local_only'
                };
            }

            const {
                batchId,
                processorId,
                stepType,
                temperature,
                duration,
                notes,
                fileHash
            } = stepData;

            // Prepare transaction
            const gasLimit = process.env.GAS_LIMIT || 3000000;
            const gasPrice = process.env.GAS_PRICE || '20000000000';

            console.log('Sending transaction to blockchain...');
            console.log('Data:', { batchId, processorId, stepType, temperature, duration });

            // Send transaction
            const transaction = await this.contract.methods.addProcessingStep(
                batchId,
                processorId,
                stepType,
                temperature || 0,
                duration || 0,
                notes || '',
                fileHash || ''
            ).send({
                from: this.account.address,
                gas: gasLimit,
                gasPrice: gasPrice
            });

            console.log('Transaction successful:', transaction.transactionHash);

            // Get the step hash from the transaction logs
            const stepHash = transaction.events?.ProcessingStepAdded?.returnValues?.stepHash;

            return {
                transactionHash: transaction.transactionHash,
                blockNumber: transaction.blockNumber,
                blockHash: transaction.blockHash,
                gasUsed: transaction.gasUsed,
                stepHash: stepHash,
                status: 'confirmed'
            };

        } catch (error) {
            console.error('Error adding processing step to blockchain:', error);
            throw error;
        }
    }

    // Get processing step from blockchain
    async getProcessingStepFromBlockchain(stepHash) {
        try {
            if (!this.contract) {
                throw new Error('Smart contract not initialized');
            }

            const result = await this.contract.methods.getProcessingStep(stepHash).call();
            
            return {
                batchId: result.batchId,
                processorId: result.processorId,
                stepType: result.stepType,
                temperature: parseInt(result.temperature),
                duration: parseInt(result.duration),
                notes: result.notes,
                fileHash: result.fileHash,
                timestamp: parseInt(result.timestamp),
                submittedBy: result.submittedBy
            };

        } catch (error) {
            console.error('Error getting processing step from blockchain:', error);
            throw error;
        }
    }

    // Get all processing steps for a batch from blockchain
    async getBatchStepsFromBlockchain(batchId) {
        try {
            if (!this.contract) {
                throw new Error('Smart contract not initialized');
            }

            const stepHashes = await this.contract.methods.getBatchSteps(batchId).call();
            const steps = [];

            for (const hash of stepHashes) {
                const step = await this.getProcessingStepFromBlockchain(hash);
                steps.push({ hash, ...step });
            }

            return steps;

        } catch (error) {
            console.error('Error getting batch steps from blockchain:', error);
            throw error;
        }
    }

    // Verify processing step on blockchain
    async verifyProcessingStep(stepHash) {
        try {
            if (!this.contract) {
                throw new Error('Smart contract not initialized');
            }

            const gasLimit = process.env.GAS_LIMIT || 3000000;
            const gasPrice = process.env.GAS_PRICE || '20000000000';

            const transaction = await this.contract.methods.verifyProcessingStep(stepHash).send({
                from: this.account.address,
                gas: gasLimit,
                gasPrice: gasPrice
            });

            return {
                transactionHash: transaction.transactionHash,
                blockNumber: transaction.blockNumber,
                gasUsed: transaction.gasUsed,
                status: 'verified'
            };

        } catch (error) {
            console.error('Error verifying processing step:', error);
            throw error;
        }
    }

    // Get transaction receipt
    async getTransactionReceipt(transactionHash) {
        try {
            return await this.web3.eth.getTransactionReceipt(transactionHash);
        } catch (error) {
            console.error('Error getting transaction receipt:', error);
            throw error;
        }
    }

    // Check if connected to Besu
    async isConnected() {
        try {
            await this.web3.eth.getBlockNumber();
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get network info
    async getNetworkInfo() {
        try {
            const networkId = await this.web3.eth.net.getId();
            const blockNumber = await this.web3.eth.getBlockNumber();
            const gasPrice = await this.web3.eth.getGasPrice();

            return {
                networkId,
                blockNumber,
                gasPrice,
                account: this.account?.address,
                contractAddress: this.contractAddress
            };
        } catch (error) {
            console.error('Error getting network info:', error);
            throw error;
        }
    }
}

module.exports = new BlockchainService();
