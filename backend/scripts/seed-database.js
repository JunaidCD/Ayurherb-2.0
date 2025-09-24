const database = require('../models/database');

async function seedDatabase() {
    try {
        console.log('🌱 Seeding database with sample data...');

        // Wait for database to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Insert sample processors
        const processors = [
            {
                id: 'PROC001',
                name: 'Ayurvedic Processing Unit Kerala',
                location: 'Kochi, Kerala, India',
                certification: 'ISO 9001:2015, GMP',
                contact_info: 'contact@apukerala.com'
            },
            {
                id: 'PROC002', 
                name: 'Himalayan Herbs Processor',
                location: 'Dehradun, Uttarakhand, India',
                certification: 'AYUSH License, Organic Certified',
                contact_info: 'info@himalayanherbs.com'
            }
        ];

        // Insert sample batches (matching frontend farmer collections)
        const batches = [
            {
                id: 'BAT 2024 001',
                herb_type: 'Ashwagandha',
                farmer_id: 'FARM001',
                farmer_name: 'Rajesh Kumar',
                origin_location: 'Kerala, India',
                harvest_date: '2024-01-15',
                quantity: 5.0,
                quality_grade: 'Premium',
                status: 'verified'
            },
            {
                id: 'BAT 2024 002',
                herb_type: 'Turmeric', 
                farmer_id: 'FARM002',
                farmer_name: 'Priya Sharma',
                origin_location: 'Tamil Nadu, India',
                harvest_date: '2024-01-20',
                quantity: 7.0,
                quality_grade: 'Grade A',
                status: 'verified'
            },
            {
                id: 'BAT 2024 003',
                herb_type: 'Brahmi',
                farmer_id: 'FARM003', 
                farmer_name: 'Amit Patel',
                origin_location: 'Gujarat, India',
                harvest_date: '2024-01-25',
                quantity: 3.0,
                quality_grade: 'Premium',
                status: 'verified'
            }
        ];

        // Insert processors
        for (const processor of processors) {
            try {
                await database.addProcessor(processor);
                console.log(`✅ Added processor: ${processor.name}`);
            } catch (error) {
                if (!error.message.includes('UNIQUE constraint failed')) {
                    console.error(`❌ Error adding processor ${processor.id}:`, error.message);
                }
            }
        }

        // Insert batches
        for (const batch of batches) {
            try {
                await database.addBatch(batch);
                console.log(`✅ Added batch: ${batch.id} - ${batch.herb_type} from ${batch.farmer_name}`);
            } catch (error) {
                if (!error.message.includes('UNIQUE constraint failed')) {
                    console.error(`❌ Error adding batch ${batch.id}:`, error.message);
                }
            }
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Available batches for processing:');
        console.log('- BAT 2024 001: Ashwagandha (5kg) - Rajesh Kumar');
        console.log('- BAT 2024 002: Turmeric (7kg) - Priya Sharma'); 
        console.log('- BAT 2024 003: Brahmi (3kg) - Amit Patel');

        database.close();

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
}

// Run seeding if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
