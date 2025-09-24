const axios = require('axios');

async function testProcessingStep() {
    try {
        console.log('🧪 Testing processing step creation...');
        
        const response = await axios.post('http://localhost:3001/api/v1/processing-steps', {
            batchId: 'COL001',
            stepType: 'drying',
            description: 'Initial drying process',
            processorId: 'PROC001',
            temperature: '45',
            duration: '24',
            notes: 'Standard drying protocol'
        });
        
        console.log('✅ Processing step created successfully!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.blockchainTxId) {
            console.log('🔗 Blockchain transaction ID:', response.data.blockchainTxId);
        }
        
    } catch (error) {
        console.error('❌ Error creating processing step:', error.response?.data || error.message);
    }
}

testProcessingStep();
