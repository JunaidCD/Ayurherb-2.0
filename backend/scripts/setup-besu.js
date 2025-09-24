const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Hyperledger Besu for Ayurherb 2.0...\n');

// Check if Docker is installed
function checkDocker() {
    return new Promise((resolve, reject) => {
        exec('docker --version', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Docker is not installed or not in PATH');
                console.log('Please install Docker Desktop from: https://www.docker.com/products/docker-desktop');
                reject(error);
            } else {
                console.log('✅ Docker found:', stdout.trim());
                resolve();
            }
        });
    });
}

// Create Besu network configuration
function createBesuConfig() {
    const configDir = path.join(__dirname, '..', 'besu-config');
    
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    // Genesis file for development network
    const genesisConfig = {
        "config": {
            "chainId": 1337,
            "berlinBlock": 0,
            "contractSizeLimit": 2147483647,
            "ethash": {}
        },
        "nonce": "0x42",
        "timestamp": "0x0",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "gasLimit": "0x1fffffffffffff",
        "difficulty": "0x10000",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": {
            "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {
                "privateKey": "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
                "comment": "private key and this comment are ignored.  In a real chain, the private key should not be stored",
                "balance": "0xad78ebc5ac6200000"
            },
            "0x627306090abaB3A6e1400e9345bC60c78a8BEf57": {
                "privateKey": "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
                "comment": "private key and this comment are ignored.  In a real chain, the private key should not be stored",
                "balance": "0xad78ebc5ac6200000"
            }
        }
    };

    fs.writeFileSync(path.join(configDir, 'genesis.json'), JSON.stringify(genesisConfig, null, 2));
    console.log('✅ Created Besu genesis configuration');

    // Docker compose file for Besu
    const dockerCompose = `version: '3.8'

services:
  besu:
    image: hyperledger/besu:latest
    container_name: ayurherb-besu
    ports:
      - "8545:8545"
      - "8546:8546"
      - "30303:30303"
    volumes:
      - ./besu-config:/config
      - besu-data:/opt/besu/data
    command: [
      "--genesis-file=/config/genesis.json",
      "--rpc-http-enabled",
      "--rpc-http-host=0.0.0.0",
      "--rpc-http-port=8545",
      "--rpc-http-cors-origins=*",
      "--rpc-ws-enabled",
      "--rpc-ws-host=0.0.0.0",
      "--rpc-ws-port=8546",
      "--network-id=1337",
      "--miner-enabled",
      "--miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "--min-gas-price=0",
      "--data-path=/opt/besu/data"
    ]
    networks:
      - ayurherb-network

networks:
  ayurherb-network:
    driver: bridge

volumes:
  besu-data:
`;

    fs.writeFileSync(path.join(__dirname, '..', 'docker-compose.yml'), dockerCompose);
    console.log('✅ Created Docker Compose configuration');
}

// Start Besu network
function startBesu() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Starting Hyperledger Besu network...');
        
        const process = exec('docker-compose up -d', { 
            cwd: path.join(__dirname, '..') 
        });

        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        process.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Besu network started successfully');
                console.log('🌐 RPC URL: http://localhost:8545');
                console.log('🔌 WebSocket URL: ws://localhost:8546');
                resolve();
            } else {
                reject(new Error(`Docker compose failed with code ${code}`));
            }
        });
    });
}

// Wait for Besu to be ready
function waitForBesu() {
    return new Promise((resolve) => {
        console.log('⏳ Waiting for Besu to be ready...');
        
        const checkConnection = () => {
            exec('curl -s -X POST -H "Content-Type: application/json" --data \'{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}\' http://localhost:8545', (error, stdout) => {
                if (error || !stdout.includes('result')) {
                    setTimeout(checkConnection, 2000);
                } else {
                    console.log('✅ Besu is ready and responding');
                    resolve();
                }
            });
        };
        
        setTimeout(checkConnection, 5000);
    });
}

// Create environment file
function createEnvFile() {
    const envContent = `# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_PATH=./data/ayurherb.db

# Hyperledger Besu Configuration
BESU_RPC_URL=http://localhost:8545
BESU_NETWORK_ID=1337
PRIVATE_KEY=0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63

# Smart Contract Configuration (will be updated after deployment)
CONTRACT_ADDRESS=
GAS_LIMIT=3000000
GAS_PRICE=0

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# API Configuration
API_PREFIX=/api/v1
`;

    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Created .env file with Besu configuration');
    } else {
        console.log('ℹ️  .env file already exists');
    }
}

// Main setup function
async function setup() {
    try {
        await checkDocker();
        createBesuConfig();
        createEnvFile();
        await startBesu();
        await waitForBesu();
        
        console.log('\n🎉 Hyperledger Besu setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Run: npm run deploy-contract');
        console.log('2. Run: npm run dev');
        console.log('3. Test the API: http://localhost:3001/health');
        console.log('\n🔧 Useful commands:');
        console.log('- Stop Besu: docker-compose down');
        console.log('- View logs: docker-compose logs -f besu');
        console.log('- Restart: docker-compose restart');
        
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure Docker Desktop is running');
        console.log('2. Check if ports 8545, 8546 are available');
        console.log('3. Try: docker-compose down && docker-compose up -d');
        process.exit(1);
    }
}

// Run setup
setup();
