const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

console.log('🔨 Starting contract deployment...');

const web3 = new Web3('http://localhost:8545');
const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

console.log('👤 Using account:', account.address);

// Read contract
const contractSource = fs.readFileSync('./contracts/ProcessingSteps.sol', 'utf8');

// Compile
const input = {
    language: 'Solidity',
    sources: { 'ProcessingSteps.sol': { content: contractSource } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = compiled.contracts['ProcessingSteps.sol']['ProcessingSteps'];

console.log('✅ Contract compiled');

// Deploy
web3.eth.getBalance(account.address)
    .then(balance => {
        console.log('💰 Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
        
        const deployContract = new web3.eth.Contract(contract.abi);
        const deployTx = deployContract.deploy({ data: '0x' + contract.evm.bytecode.object });
        
        return deployTx.send({
            from: account.address,
            gas: 2000000,
            gasPrice: '20000000000'
        });
    })
    .then(deployedContract => {
        const address = deployedContract.options.address;
        console.log('🎉 Contract deployed!');
        console.log('📍 Address:', address);
        
        // Save to file
        fs.writeFileSync('./contracts/ProcessingSteps.json', JSON.stringify({
            address: address,
            abi: contract.abi
        }, null, 2));
        
        console.log('\n🚀 Start server with:');
        console.log(`$env:CONTRACT_ADDRESS="${address}"; node server.js`);
    })
    .catch(error => {
        console.error('❌ Error:', error.message);
    });
