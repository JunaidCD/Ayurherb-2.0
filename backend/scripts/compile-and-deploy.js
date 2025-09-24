const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

async function compileAndDeploy() {
    try {
        console.log('🔨 Starting contract compilation and deployment...');

        // Initialize Web3 connection to Besu
        const web3 = new Web3('http://localhost:8545');
        
        // Test connection
        try {
            const blockNumber = await web3.eth.getBlockNumber();
            console.log('✅ Connected to Besu. Current block:', blockNumber);
        } catch (error) {
            console.error('❌ Cannot connect to Besu. Make sure it\'s running on http://localhost:8545');
            return;
        }

        // Use pre-funded account from genesis
        const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        console.log('👤 Using account:', account.address);
        
        // Check balance
        const balance = await web3.eth.getBalance(account.address);
        console.log('💰 Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');

        // Read the smart contract source code
        const contractPath = path.join(__dirname, '../contracts/ProcessingSteps.sol');
        const contractSource = fs.readFileSync(contractPath, 'utf8');

        console.log('📄 Compiling ProcessingSteps.sol...');

        // Prepare compilation input
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
                        '*': ['abi', 'evm.bytecode', 'evm.gasEstimates']
                    }
                }
            }
        };

        // Compile the contract
        const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

        // Check for compilation errors
        if (compiled.errors) {
            const errors = compiled.errors.filter(error => error.severity === 'error');
            if (errors.length > 0) {
                console.error('❌ Compilation errors:');
                errors.forEach(error => console.error(error.formattedMessage));
                return;
            }
            
            // Show warnings
            const warnings = compiled.errors.filter(error => error.severity === 'warning');
            if (warnings.length > 0) {
                console.log('⚠️  Compilation warnings:');
                warnings.forEach(warning => console.log(warning.formattedMessage));
            }
        }

        const contract = compiled.contracts['ProcessingSteps.sol']['ProcessingSteps'];
        const abi = contract.abi;
        const bytecode = contract.evm.bytecode.object;

        console.log('✅ Contract compiled successfully');
        console.log('📊 Bytecode size:', bytecode.length / 2, 'bytes');

        // Deploy the contract
        console.log('🚀 Deploying contract to Besu network...');

        const deployContract = new web3.eth.Contract(abi);
        const deployTx = deployContract.deploy({
            data: '0x' + bytecode
        });

        // Estimate gas
        let gasEstimate;
        try {
            gasEstimate = await deployTx.estimateGas({ from: account.address });
            console.log('⛽ Estimated gas:', gasEstimate);
        } catch (error) {
            console.log('⚠️  Gas estimation failed, using default gas limit');
            gasEstimate = 2000000; // 2M gas as fallback
        }

        // Deploy with some buffer on gas
        const gasLimit = Math.floor(gasEstimate * 1.2);
        const gasPrice = '20000000000'; // 20 Gwei

        console.log('📤 Sending deployment transaction...');
        console.log('   Gas Limit:', gasLimit);
        console.log('   Gas Price:', gasPrice, 'wei (20 Gwei)');

        const deployedContract = await deployTx.send({
            from: account.address,
            gas: gasLimit,
            gasPrice: gasPrice
        });

        const contractAddress = deployedContract.options.address;
        const txHash = deployedContract.transactionHash;

        console.log('🎉 Contract deployed successfully!');
        console.log('📍 Contract Address:', contractAddress);
        console.log('🔗 Transaction Hash:', txHash);

        // Get deployment receipt for more details
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        console.log('⛽ Gas Used:', receipt.gasUsed);
        console.log('📦 Block Number:', receipt.blockNumber);

        // Save contract information to file
        const contractInfo = {
            address: contractAddress,
            abi: abi,
            bytecode: bytecode,
            transactionHash: txHash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed,
            deployedBy: account.address,
            deployedAt: new Date().toISOString(),
            network: {
                rpcUrl: 'http://localhost:8545',
                networkId: await web3.eth.net.getId(),
                chainId: await web3.eth.getChainId()
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
                `CONTRACT_ADDRESS=${contractAddress}`
            );
        } else {
            envContent += `\nCONTRACT_ADDRESS=${contractAddress}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('📝 Updated .env file with contract address');

        console.log('\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
        console.log('\n📋 Summary:');
        console.log('   Contract Address:', contractAddress);
        console.log('   Transaction Hash:', txHash);
        console.log('   Gas Used:', receipt.gasUsed);
        console.log('   Block Number:', receipt.blockNumber);
        console.log('   Deployed By:', account.address);
        
        console.log('\n🚀 Next Steps:');
        console.log('   1. Contract is now deployed and ready to use');
        console.log('   2. Start your backend server with:');
        console.log(`   $env:BESU_RPC_URL="http://localhost:8545"; $env:CONTRACT_ADDRESS="${contractAddress}"; node server.js`);
        console.log('   3. Your backend will now have full blockchain integration!');

        return contractAddress;

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    compileAndDeploy();
}

module.exports = compileAndDeploy;
