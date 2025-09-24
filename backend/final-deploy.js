const { Web3 } = require('web3');
const fs = require('fs');
const solc = require('solc');

async function deployContract() {
    console.log('🔨 Final contract deployment...');
    
    const web3 = new Web3('http://localhost:8545');
    
    // Use different account to avoid nonce issues
    const privateKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    console.log('👤 Using account:', account.address);
    
    const balance = await web3.eth.getBalance(account.address);
    console.log('💰 Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
    
    // Read and compile contract
    const contractSource = fs.readFileSync('./contracts/ProcessingSteps.sol', 'utf8');
    
    const input = {
        language: 'Solidity',
        sources: { 'ProcessingSteps.sol': { content: contractSource } },
        settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
    };
    
    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
    const contract = compiled.contracts['ProcessingSteps.sol']['ProcessingSteps'];
    
    console.log('✅ Contract compiled successfully');
    
    // Get current nonce to avoid conflicts
    const nonce = await web3.eth.getTransactionCount(account.address);
    console.log('📊 Using nonce:', nonce);
    
    // Deploy contract
    const deployContract = new web3.eth.Contract(contract.abi);
    const deployTx = deployContract.deploy({
        data: '0x' + contract.evm.bytecode.object
    });
    
    const deployedContract = await deployTx.send({
        from: account.address,
        gas: 2500000,
        gasPrice: '25000000000', // Higher gas price
        nonce: nonce
    });
    
    const contractAddress = deployedContract.options.address;
    console.log('🎉 SUCCESS! Contract deployed!');
    console.log('📍 Contract Address:', contractAddress);
    console.log('🔗 Transaction Hash:', deployedContract.transactionHash);
    
    // Save contract info
    const contractInfo = {
        address: contractAddress,
        abi: contract.abi,
        transactionHash: deployedContract.transactionHash,
        deployedBy: account.address,
        deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('./contracts/ProcessingSteps.json', JSON.stringify(contractInfo, null, 2));
    console.log('💾 Contract info saved');
    
    console.log('\n🚀 NOW START YOUR SERVER:');
    console.log(`$env:BESU_RPC_URL="http://localhost:8545"; $env:CONTRACT_ADDRESS="${contractAddress}"; node server.js`);
}

deployContract().catch(console.error);
