const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

async function getContractAddress() {
    try {
        const web3 = new Web3('http://localhost:8545');
        
        // Get the latest block number
        const latestBlock = await web3.eth.getBlockNumber();
        console.log('Latest block:', latestBlock);
        
        // Search through recent blocks for contract deployment
        for (let i = latestBlock; i >= Math.max(0, latestBlock - 100); i--) {
            const block = await web3.eth.getBlock(i, true);
            
            if (block && block.transactions) {
                for (const tx of block.transactions) {
                    if (tx.to === null && tx.input && tx.input.length > 2) {
                        // This is a contract deployment transaction
                        const receipt = await web3.eth.getTransactionReceipt(tx.hash);
                        if (receipt && receipt.contractAddress) {
                            console.log('Found contract deployment:');
                            console.log('Transaction Hash:', tx.hash);
                            console.log('Contract Address:', receipt.contractAddress);
                            console.log('Block Number:', receipt.blockNumber);
                            
                            // Update the contract info file
                            const contractInfoPath = path.join(__dirname, '../contracts/ProcessingSteps.json');
                            let contractInfo = {};
                            
                            if (fs.existsSync(contractInfoPath)) {
                                contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, 'utf8'));
                            }
                            
                            contractInfo.address = receipt.contractAddress;
                            contractInfo.transactionHash = tx.hash;
                            contractInfo.blockNumber = receipt.blockNumber;
                            
                            fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));
                            console.log('Updated contract info file with full address');
                            
                            return receipt.contractAddress;
                        }
                    }
                }
            }
        }
        
        console.log('No contract deployment found in recent blocks');
        return null;
        
    } catch (error) {
        console.error('Error:', error);
    }
}

getContractAddress();
