const database = require('../models/database');
const fs = require('fs');
const path = require('path');

async function cleanSetup() {
    try {
        console.log('🧹 Clean setup - Creating fresh database...');

        // Clear existing data instead of deleting database file
        console.log('🗑️  Clearing existing data...');
        
        // Clear all tables
        try {
            await new Promise((resolve, reject) => {
                database.db.run('DELETE FROM processing_steps', (err) => {
                    if (err && !err.message.includes('no such table')) reject(err);
                    else resolve();
                });
            });
            await new Promise((resolve, reject) => {
                database.db.run('DELETE FROM blockchain_transactions', (err) => {
                    if (err && !err.message.includes('no such table')) reject(err);
                    else resolve();
                });
            });
            await new Promise((resolve, reject) => {
                database.db.run('DELETE FROM batches', (err) => {
                    if (err && !err.message.includes('no such table')) reject(err);
                    else resolve();
                });
            });
            await new Promise((resolve, reject) => {
                database.db.run('DELETE FROM processors', (err) => {
                    if (err && !err.message.includes('no such table')) reject(err);
                    else resolve();
                });
            });
            console.log('✅ Cleared all existing data');
        } catch (error) {
            console.log('ℹ️  Database tables cleared (or didn\'t exist)');
        }

        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add only the required processor
        console.log('👤 Adding processor PROC001...');
        await database.addProcessor({
            id: 'PROC001',
            name: 'Ayurvedic Processing Unit Kerala',
            location: 'Kochi, Kerala, India',
            certification: 'ISO 9001:2015, GMP',
            contact_info: 'contact@apukerala.com'
        });

        // Add only the 2 required batches
        console.log('📦 Adding BAT 2024 001...');
        await database.addBatch({
            id: 'BAT 2024 001',
            herb_type: 'Ashwagandha',
            farmer_id: 'FARM001',
            farmer_name: 'Rajesh Kumar',
            origin_location: 'Kerala, India',
            harvest_date: '2024-01-15',
            quantity: 5.0,
            quality_grade: 'Premium',
            status: 'verified'
        });

        console.log('📦 Adding BAT 2024 002...');
        await database.addBatch({
            id: 'BAT 2024 002',
            herb_type: 'Turmeric',
            farmer_id: 'FARM002',
            farmer_name: 'Priya Sharma',
            origin_location: 'Tamil Nadu, India',
            harvest_date: '2024-01-20',
            quantity: 7.0,
            quality_grade: 'Grade A',
            status: 'verified'
        });

        console.log('✅ Clean setup completed successfully!');
        console.log('\n📋 Available batches:');
        console.log('- BAT 2024 001: Ashwagandha (5kg) - Rajesh Kumar');
        console.log('- BAT 2024 002: Turmeric (7kg) - Priya Sharma');
        console.log('\n🎯 System ready for blockchain processing!');

        database.close();

    } catch (error) {
        console.error('❌ Clean setup failed:', error);
        process.exit(1);
    }
}

// Run clean setup if called directly
if (require.main === module) {
    cleanSetup();
}

module.exports = cleanSetup;
