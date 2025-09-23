-- Ayurherb Database Schema

-- Processors table
CREATE TABLE IF NOT EXISTS processors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    certification TEXT,
    contact_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY,
    herb_type TEXT NOT NULL,
    farmer_id TEXT,
    farmer_name TEXT,
    origin_location TEXT,
    harvest_date DATE,
    quantity REAL,
    quality_grade TEXT,
    status TEXT DEFAULT 'received',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Processing steps table
CREATE TABLE IF NOT EXISTS processing_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id TEXT NOT NULL,
    processor_id TEXT NOT NULL,
    step_type TEXT NOT NULL,
    temperature REAL,
    duration INTEGER,
    notes TEXT,
    file_path TEXT,
    file_hash TEXT,
    blockchain_hash TEXT,
    transaction_id TEXT,
    block_number INTEGER,
    gas_used INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (processor_id) REFERENCES processors(id)
);

-- Blockchain transactions table
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_hash TEXT UNIQUE NOT NULL,
    block_number INTEGER,
    block_hash TEXT,
    gas_used INTEGER,
    gas_price TEXT,
    status TEXT DEFAULT 'pending',
    processing_step_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    FOREIGN KEY (processing_step_id) REFERENCES processing_steps(id)
);

-- Insert sample processors
INSERT OR IGNORE INTO processors (id, name, location, certification, contact_info) VALUES
('PROC001', 'Ayurvedic Processing Unit Kerala', 'Kochi, Kerala, India', 'ISO 9001:2015, GMP', 'contact@apukerala.com'),
('PROC002', 'Himalayan Herbs Processor', 'Dehradun, Uttarakhand, India', 'AYUSH License, Organic Certified', 'info@himalayanherbs.com'),
('PROC003', 'Traditional Medicine Works', 'Bangalore, Karnataka, India', 'FDA Approved, HACCP', 'admin@tmworks.com');

-- Insert sample batches (from farmer collections)
INSERT OR IGNORE INTO batches (id, herb_type, farmer_id, farmer_name, origin_location, harvest_date, quantity, quality_grade, status) VALUES
('COL001', 'Ashwagandha', 'FARM001', 'Rajesh Kumar', 'Kerala, India', '2024-01-15', 500.0, 'Premium', 'verified'),
('COL002', 'Turmeric', 'FARM002', 'Priya Sharma', 'Tamil Nadu, India', '2024-01-20', 750.0, 'Grade A', 'verified'),
('COL003', 'Brahmi', 'FARM003', 'Amit Patel', 'Gujarat, India', '2024-01-25', 300.0, 'Premium', 'verified');
