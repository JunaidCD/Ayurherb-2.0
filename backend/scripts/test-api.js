const axios = require('axios');

async function testAPI() {
    try {
        console.log('🧪 Testing API endpoints...');

        // Test 1: Health check
        console.log('\n1. Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:3001/health');
        console.log('✅ Health check:', healthResponse.data);

        // Test 2: Get batches
        console.log('\n2. Testing batches endpoint...');
        const batchesResponse = await axios.get('http://localhost:3001/api/v1/batches');
        console.log('✅ Batches response:', batchesResponse.data);
        
        if (batchesResponse.data.success && batchesResponse.data.data) {
            console.log('✅ Batches found:', batchesResponse.data.data.length);
            batchesResponse.data.data.forEach(batch => {
                console.log(`   - ${batch.id}: ${batch.herb_type} (${batch.quantity}kg)`);
            });
        } else {
            console.log('❌ No batches found or invalid response format');
        }

        // Test 3: Test specific batch
        console.log('\n3. Testing specific batch (BAT 2024 001)...');
        const batchResponse = await axios.get('http://localhost:3001/api/v1/batches/BAT%202024%20001');
        console.log('✅ Batch BAT 2024 001:', batchResponse.data);

        // Test 4: Test processing step submission
        console.log('\n4. Testing processing step submission...');
        const processingStepData = {
            batchId: 'BAT 2024 001',
            processorId: 'PROC001',
            stepType: 'Drying',
            temperature: 60,
            duration: 120,
            notes: 'Test processing step'
        };

        const stepResponse = await axios.post('http://localhost:3001/api/v1/processing-steps', processingStepData);
        console.log('✅ Processing step saved:', stepResponse.data);

        if (stepResponse.data.success && stepResponse.data.data.blockchain) {
            console.log('🎉 Blockchain integration working!');
            console.log('   Transaction Hash:', stepResponse.data.data.blockchain.transactionHash);
            console.log('   Block Number:', stepResponse.data.data.blockchain.blockNumber);
        }

    } catch (error) {
        console.error('❌ API Test failed:', error.response?.data || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Solutions:');
            console.log('1. Make sure backend server is running: npm run dev');
            console.log('2. Make sure mock blockchain is running: npm run mock-blockchain');
            console.log('3. Check if port 3001 is available');
        }
    }
}

testAPI();
