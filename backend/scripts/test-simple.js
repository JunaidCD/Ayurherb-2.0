const axios = require('axios');

async function testSimpleSystem() {
    try {
        console.log('🧪 Testing Simple Batch System...\n');

        // Test 1: Valid batch BAT 2024 001
        console.log('1. Testing BAT 2024 001 (should work)...');
        try {
            const response1 = await axios.post('http://localhost:3001/api/v1/processing-steps', {
                batchId: 'BAT 2024 001',
                processorId: 'PROC001',
                stepType: 'Drying',
                temperature: 60,
                duration: 120,
                notes: 'Test processing for Ashwagandha'
            });
            
            if (response1.data.success && response1.data.data.blockchain) {
                console.log('✅ BAT 2024 001 - SUCCESS');
                console.log('   Transaction Hash:', response1.data.data.blockchain.transactionHash);
                console.log('   Block Number:', response1.data.data.blockchain.blockNumber);
            } else {
                console.log('❌ BAT 2024 001 - Failed to save to blockchain');
            }
        } catch (error) {
            console.log('❌ BAT 2024 001 - Error:', error.response?.data?.message || error.message);
        }

        // Test 2: Valid batch BAT 2024 002
        console.log('\n2. Testing BAT 2024 002 (should work)...');
        try {
            const response2 = await axios.post('http://localhost:3001/api/v1/processing-steps', {
                batchId: 'BAT 2024 002',
                processorId: 'PROC001',
                stepType: 'Grinding',
                temperature: 25,
                duration: 60,
                notes: 'Test processing for Turmeric'
            });
            
            if (response2.data.success && response2.data.data.blockchain) {
                console.log('✅ BAT 2024 002 - SUCCESS');
                console.log('   Transaction Hash:', response2.data.data.blockchain.transactionHash);
                console.log('   Block Number:', response2.data.data.blockchain.blockNumber);
            } else {
                console.log('❌ BAT 2024 002 - Failed to save to blockchain');
            }
        } catch (error) {
            console.log('❌ BAT 2024 002 - Error:', error.response?.data?.message || error.message);
        }

        // Test 3: Invalid batch (should fail)
        console.log('\n3. Testing BAT 2024 003 (should fail)...');
        try {
            const response3 = await axios.post('http://localhost:3001/api/v1/processing-steps', {
                batchId: 'BAT 2024 003',
                processorId: 'PROC001',
                stepType: 'Drying',
                temperature: 50,
                duration: 90,
                notes: 'Test invalid batch'
            });
            
            console.log('❌ BAT 2024 003 - Should have failed but succeeded');
        } catch (error) {
            console.log('✅ BAT 2024 003 - Correctly failed:', error.response?.data?.message || error.message);
        }

        console.log('\n🎯 Test Summary:');
        console.log('- BAT 2024 001 (Ashwagandha): Should save to blockchain ✅');
        console.log('- BAT 2024 002 (Turmeric): Should save to blockchain ✅');
        console.log('- BAT 2024 003 (Invalid): Should show error message ✅');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testSimpleSystem();
