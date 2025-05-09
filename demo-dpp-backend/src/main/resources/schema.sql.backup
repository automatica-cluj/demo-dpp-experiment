CREATE TABLE IF NOT EXISTS digital_product_passport (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255),
    manufacturer VARCHAR(255),
    serial_number VARCHAR(100),
    manufacturing_date TIMESTAMP,
    product_type VARCHAR(100),
    model_number VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS repair_entry (
    id SERIAL PRIMARY KEY,
    passport_id BIGINT,
    repair_date TIMESTAMP,
    description TEXT,
    technician VARCHAR(255),
    FOREIGN KEY (passport_id) REFERENCES digital_product_passport(id)
);