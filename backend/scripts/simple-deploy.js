const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

async function deployContract() {
    try {
        console.log('🚀 Starting simple contract deployment...');

        // Initialize Web3
        const web3 = new Web3('http://localhost:8545');
        
        // Use pre-funded account from genesis
        const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        console.log('👤 Using account:', account.address);
        
        // Check balance
        const balance = await web3.eth.getBalance(account.address);
        console.log('💰 Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');

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

        // Deploy the contract with fixed gas
        console.log('🚀 Deploying contract...');

        const deployContract = new web3.eth.Contract(abi);
        const deployTx = deployContract.deploy({
            data: '0x' + bytecode
        });

        // Use fixed gas instead of estimation
        const gasLimit = 3000000; // 3M gas should be enough
        const gasPrice = '20000000000'; // 20 Gwei

        console.log('⛽ Using gas limit:', gasLimit);
        console.log('💸 Using gas price:', gasPrice);

        const deployedContract = await deployTx.send({
            from: account.address,
            gas: gasLimit,
            gasPrice: gasPrice
        });

        console.log('✅ Contract deployed successfully!');
        console.log('📍 Contract address:', deployedContract.options.address);
        console.log('🔗 Transaction hash:', deployedContract.transactionHash);

        // Save contract information
        const contractInfo = {
            address: deployedContract.options.address,
            abi: abi,
            bytecode: bytecode,
            transactionHash: deployedContract.transactionHash,
            deployedBy: account.address,
            deployedAt: new Date().toISOString(),
            network: {
                rpcUrl: 'http://localhost:8545',
                networkId: await web3.eth.net.getId()
            }
        };

        const contractInfoPath = path.join(__dirname, '../contracts/ProcessingSteps.json');
        fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));

        console.log('💾 Contract information saved to:', contractInfoPath);

        console.log('\n🎉 Deployment completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   Contract Address:', deployedContract.options.address);
        console.log('   Transaction Hash:', deployedContract.transactionHash);
        console.log('   Deployed By:', account.address);

    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}

deployContract();
