const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

let nonce = 0;
let blockNumber = 1;
const contracts = {};
const transactions = {};

// Mock blockchain RPC server
app.post('/', (req, res) => {
    const { method, params, id } = req.body;
    
    console.log(`📡 RPC Call: ${method}`);
    
    switch (method) {
        case 'eth_blockNumber':
            res.json({
                jsonrpc: '2.0',
                id,
                result: `0x${blockNumber.toString(16)}`
            });
            break;
            
        case 'eth_getBalance':
            res.json({
                jsonrpc: '2.0',
                id,
                result: '0x21e19e0c9bab2400000' // 10000 ETH
            });
            break;
            
        case 'eth_estimateGas':
            res.json({
                jsonrpc: '2.0',
                id,
                result: '0x182b73' // ~1.5M gas
            });
            break;
            
        case 'eth_sendRawTransaction':
            const txHash = '0x' + crypto.randomBytes(32).toString('hex');
            const contractAddress = '0x' + crypto.randomBytes(20).toString('hex');
            
            // Store mock contract
            contracts[contractAddress] = {
                address: contractAddress,
                deployedAt: blockNumber,
                txHash
            };
            
            transactions[txHash] = {
                hash: txHash,
                blockNumber,
                contractAddress,
                gasUsed: '0x182b73',
                status: '0x1'
            };
            
            blockNumber++;
            
            console.log(`✅ Contract deployed at: ${contractAddress}`);
            console.log(`🔗 Transaction hash: ${txHash}`);
            
            res.json({
                jsonrpc: '2.0',
                id,
                result: txHash
            });
            break;
            
        case 'eth_getTransactionReceipt':
            const receipt = transactions[params[0]];
            if (receipt) {
                res.json({
                    jsonrpc: '2.0',
                    id,
                    result: {
                        transactionHash: receipt.hash,
                        blockNumber: `0x${receipt.blockNumber.toString(16)}`,
                        contractAddress: receipt.contractAddress,
                        gasUsed: receipt.gasUsed,
                        status: receipt.status
                    }
                });
            } else {
                res.json({
                    jsonrpc: '2.0',
                    id,
                    result: null
                });
            }
            break;
            
        case 'net_version':
            res.json({
                jsonrpc: '2.0',
                id,
                result: '1337'
            });
            break;
            
        default:
            res.json({
                jsonrpc: '2.0',
                id,
                result: '0x0'
            });
    }
});

const PORT = 8545;
app.listen(PORT, () => {
    console.log(`
🚀 Mock Blockchain Server Started
📍 Port: ${PORT}
🌐 RPC URL: http://localhost:${PORT}
💰 All accounts have 10000 ETH
⛽ Gas price: 0
🔗 Network ID: 1337

Ready for contract deployment! 🎉
    `);
});

module.exports = app;
