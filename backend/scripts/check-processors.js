const database = require('../models/database');

async function checkProcessors() {
    try {
        console.log('🔍 Checking processors in database...');

        const processors = await database.getProcessors();
        console.log('✅ Processors found:', processors.length);
        
        processors.forEach(processor => {
            console.log(`   - ${processor.id}: ${processor.name}`);
        });

        // Check specific processor
        const proc001 = await database.getProcessorById('PROC001');
        if (proc001) {
            console.log('\n✅ PROC001 exists:', proc001);
        } else {
            console.log('\n❌ PROC001 not found in database');
        }

        database.close();

    } catch (error) {
        console.error('❌ Error checking processors:', error);
    }
}

checkProcessors();
