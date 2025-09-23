const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.API_URL || 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api/v1`;

class SystemTester {
    constructor() {
        this.testResults = [];
    }

    async runTest(name, testFn) {
        console.log(`\n🧪 Testing: ${name}`);
        try {
            const result = await testFn();
            console.log(`✅ PASS: ${name}`);
            this.testResults.push({ name, status: 'PASS', result });
            return result;
        } catch (error) {
            console.log(`❌ FAIL: ${name}`);
            console.log(`   Error: ${error.message}`);
            this.testResults.push({ name, status: 'FAIL', error: error.message });
            return null;
        }
    }

    async testHealthCheck() {
        const response = await axios.get(`${BASE_URL}/health`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        if (response.data.status !== 'healthy') {
            throw new Error(`Expected healthy status, got ${response.data.status}`);
        }
        return response.data;
    }

    async testBlockchainStatus() {
        const response = await axios.get(`${API_BASE}/blockchain/status`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        if (!response.data.data.connected) {
            throw new Error('Blockchain not connected');
        }
        return response.data;
    }

    async testGetBatches() {
        const response = await axios.get(`${API_BASE}/batches`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        if (!Array.isArray(response.data.data)) {
            throw new Error('Expected array of batches');
        }
        return response.data;
    }

    async testGetProcessors() {
        const response = await axios.get(`${API_BASE}/processors`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        if (!Array.isArray(response.data.data)) {
            throw new Error('Expected array of processors');
        }
        return response.data;
    }

    async testAddProcessingStep() {
        const stepData = {
            batchId: 'COL001',
            processorId: 'PROC001',
            stepType: 'drying',
            temperature: 60,
            duration: 480,
            notes: 'Test processing step - controlled drying'
        };

        const response = await axios.post(`${API_BASE}/processing-steps`, stepData);
        if (response.status !== 201) {
            throw new Error(`Expected status 201, got ${response.status}`);
        }
        if (!response.data.success) {
            throw new Error('Processing step creation failed');
        }
        return response.data;
    }

    async testGetProcessingSteps(batchId = 'COL001') {
        const response = await axios.get(`${API_BASE}/processing-steps/batch/${batchId}`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        if (!Array.isArray(response.data.data)) {
            throw new Error('Expected array of processing steps');
        }
        return response.data;
    }

    async testTraceabilityReport(batchId = 'COL001') {
        const response = await axios.get(`${API_BASE}/batches/${batchId}/traceability`);
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        if (!response.data.data.batch) {
            throw new Error('Expected batch information in traceability report');
        }
        return response.data;
    }

    async testHashVerification() {
        const testData = {
            batchId: 'COL001',
            processorId: 'PROC001',
            stepType: 'test',
            temperature: 25,
            duration: 60,
            notes: 'Test data for hash verification'
        };

        const response = await axios.post(`${API_BASE}/blockchain/verify-hash`, { data: testData });
        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }
        if (!response.data.data.hash) {
            throw new Error('Expected hash in response');
        }
        return response.data;
    }

    async runAllTests() {
        console.log('🚀 Starting Ayurherb Backend System Tests\n');
        console.log('=' .repeat(50));

        // Basic connectivity tests
        await this.runTest('Health Check', () => this.testHealthCheck());
        await this.runTest('Blockchain Status', () => this.testBlockchainStatus());

        // Data retrieval tests
        await this.runTest('Get Batches', () => this.testGetBatches());
        await this.runTest('Get Processors', () => this.testGetProcessors());

        // Processing step tests
        const stepResult = await this.runTest('Add Processing Step', () => this.testAddProcessingStep());
        await this.runTest('Get Processing Steps', () => this.testGetProcessingSteps());

        // Advanced features
        await this.runTest('Traceability Report', () => this.testTraceabilityReport());
        await this.runTest('Hash Verification', () => this.testHashVerification());

        // Test blockchain proof if we have a step
        if (stepResult && stepResult.data && stepResult.data.id) {
            await this.runTest('Get Blockchain Proof', async () => {
                const response = await axios.get(`${API_BASE}/processing-steps/${stepResult.data.id}/proof`);
                if (response.status !== 200) {
                    throw new Error(`Expected status 200, got ${response.status}`);
                }
                return response.data;
            });
        }

        this.printSummary();
    }

    printSummary() {
        console.log('\n' + '=' .repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('=' .repeat(50));

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const total = this.testResults.length;

        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(test => {
                    console.log(`   - ${test.name}: ${test.error}`);
                });
        }

        console.log('\n🎉 System test completed!');
        
        if (failed === 0) {
            console.log('✅ All tests passed! Your Ayurherb backend is working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Please check the errors above.');
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new SystemTester();
    tester.runAllTests().catch(error => {
        console.error('Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = SystemTester;
