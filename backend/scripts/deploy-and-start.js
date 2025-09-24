const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { spawn } = require('child_process');

async function deployAndStart() {
    try {
        console.log('🚀 Deploying fresh contract and starting server...');

        const web3 = new Web3('http://localhost:8545');
        
        // Use third pre-funded account to avoid conflicts
        const privateKey = '0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f';
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

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

        const nonce = await web3.eth.getTransactionCount(account.address);
        
        const deployedContract = await deployTx.send({
            from: account.address,
            gas: 3000000,
            gasPrice: '20000000000',
            nonce: nonce
        });

        const contractAddress = deployedContract.options.address;
        console.log('✅ Contract deployed successfully!');
        console.log('📍 Full Contract Address:', contractAddress);

        // Save contract information
        const contractInfo = {
            address: contractAddress,
            abi: abi,
            bytecode: bytecode,
            transactionHash: deployedContract.transactionHash,
            deployedBy: account.address,
            deployedAt: new Date().toISOString()
        };

        const contractInfoPath = path.join(__dirname, '../contracts/ProcessingSteps.json');
        fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));

        console.log('💾 Contract information saved');
        console.log('\n🎉 SUCCESS! Use this command to start your server:');
        console.log(`\n$env:BESU_RPC_URL="http://localhost:8545"; $env:CONTRACT_ADDRESS="${contractAddress}"; node server.js\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

deployAndStart();
