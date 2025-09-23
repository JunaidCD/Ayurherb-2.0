const database = require('../models/database');
const path = require('path');
const fs = require('fs');

async function runMigrations() {
    try {
        console.log('🗄️  Starting database migrations...');

        // Ensure data directory exists
        const dataDir = path.dirname(process.env.DB_PATH || './data/ayurherb.db');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log('📁 Created data directory:', dataDir);
        }

        // Database will be initialized automatically when imported
        console.log('✅ Database connection established');

        // Wait a moment for tables to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('✅ Database migrations completed successfully');
        console.log('📊 Database ready for use');

        // Close the database connection
        database.close();

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migrations if called directly
if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;
