const fs = require('fs');
const path = require('path');
const solc = require('solc');
require('dotenv').config();

async function deployContractMock() {
    try {
        console.log('🚀 Starting mock smart contract deployment...');
        console.log('⚠️  This is a development mock - no actual blockchain deployment');

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

        // Generate mock deployment data
        const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
        const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);

        console.log('🎭 Creating mock deployment...');
        console.log('✅ Mock contract deployed successfully!');
        console.log('📍 Mock contract address:', mockAddress);
        console.log('🔗 Mock transaction hash:', mockTxHash);

        // Save contract information
        const contractInfo = {
            address: mockAddress,
            abi: abi,
            bytecode: bytecode,
            transactionHash: mockTxHash,
            deployedBy: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
            deployedAt: new Date().toISOString(),
            network: {
                rpcUrl: 'http://localhost:8545',
                networkId: 1337,
                mock: true
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
                `CONTRACT_ADDRESS=${mockAddress}`
            );
        } else {
            envContent += `\nCONTRACT_ADDRESS=${mockAddress}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('📝 Updated .env file with mock contract address');

        console.log('\n🎉 Mock deployment completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   Contract Address:', mockAddress);
        console.log('   Transaction Hash:', mockTxHash);
        console.log('   Mode: Development Mock');
        console.log('\n💡 Next steps:');
        console.log('   1. Start your backend server with: npm start');
        console.log('   2. Test the API endpoints (blockchain calls will be mocked)');
        console.log('   3. For production, deploy to actual Besu network');

    } catch (error) {
        console.error('❌ Mock deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment if called directly
if (require.main === module) {
    deployContractMock();
}

module.exports = deployContractMock;
