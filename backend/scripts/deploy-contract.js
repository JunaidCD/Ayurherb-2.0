const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');
require('dotenv').config();

async function deployContract() {
    try {
        console.log('🚀 Starting smart contract deployment...');

        // Initialize Web3
        const web3 = new Web3(process.env.BESU_RPC_URL || 'http://localhost:8545');
        
        // Set up account
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        console.log('📍 Connected to Besu at:', process.env.BESU_RPC_URL);
        console.log('👤 Using account:', account.address);

        // Read and compile the contract
        const contractPath = path.join(__dirname, '../contracts/ProcessingSteps.sol');
        const contractSource = fs.readFileSync(contractPath, 'utf8');

        console.log('📄 Compiling contract...');

        const input = {
            language: 'Solidity',
            sources: {
                'ProcessingSteps.sol': {
                    content: contractSource
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode']
                    }
                }
            }
        };

        const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

        if (compiled.errors) {
            const errors = compiled.errors.filter(error => error.severity === 'error');
            if (errors.length > 0) {
                console.error('❌ Compilation errors:');
                errors.forEach(error => console.error(error.formattedMessage));
                return;
            }
        }

        const contract = compiled.contracts['ProcessingSteps.sol']['ProcessingSteps'];
        const abi = contract.abi;
        const bytecode = contract.evm.bytecode.object;

        console.log('✅ Contract compiled successfully');

        // Deploy the contract
        console.log('🚀 Deploying contract...');

        const deployContract = new web3.eth.Contract(abi);
        const deployTx = deployContract.deploy({
            data: '0x' + bytecode
        });

        const gas = await deployTx.estimateGas();
        console.log('⛽ Estimated gas:', gas);

        const deployedContract = await deployTx.send({
            from: account.address,
            gas: gas,
            gasPrice: '0'
        });

        console.log('✅ Contract deployed successfully!');
        console.log('📍 Contract address:', deployedContract.options.address);
        console.log('🔗 Transaction hash:', deployedContract.transactionHash);

        // Save contract information (convert BigInt to string)
        const networkId = await web3.eth.net.getId();
        const contractInfo = {
            address: deployedContract.options.address,
            abi: abi,
            bytecode: bytecode,
            transactionHash: deployedContract.transactionHash,
            deployedBy: account.address,
            deployedAt: new Date().toISOString(),
            network: {
                rpcUrl: process.env.BESU_RPC_URL,
                networkId: networkId.toString()
            }
        };

        const contractInfoPath = path.join(__dirname, '../contracts/ProcessingSteps.json');
        fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));

        console.log('💾 Contract information saved to:', contractInfoPath);

        // Update .env file with contract address
        const envPath = path.join(__dirname, '../.env');
        let envContent = '';
        
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        // Update or add CONTRACT_ADDRESS
        if (envContent.includes('CONTRACT_ADDRESS=')) {
            envContent = envContent.replace(
                /CONTRACT_ADDRESS=.*/,
                `CONTRACT_ADDRESS=${deployedContract.options.address}`
            );
        } else {
            envContent += `\nCONTRACT_ADDRESS=${deployedContract.options.address}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('📝 Updated .env file with contract address');

        console.log('\n🎉 Deployment completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   Contract Address:', deployedContract.options.address);
        console.log('   Transaction Hash:', deployedContract.transactionHash);
        console.log('   Gas Used:', deployedContract.gasUsed);
        console.log('   Deployed By:', account.address);
        console.log('\n💡 Next steps:');
        console.log('   1. Update your .env file with the contract address (already done)');
        console.log('   2. Restart your backend server');
        console.log('   3. Test the API endpoints');

    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment if called directly
if (require.main === module) {
    deployContract();
}

module.exports = deployContract;
