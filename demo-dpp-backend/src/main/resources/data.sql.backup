-- Insert initial data if tables are empty
INSERT INTO digital_product_passport (product_name, manufacturer, serial_number, manufacturing_date, product_type, model_number)
SELECT 'Example Product', 'Example Manufacturer', 'SN12345', '2023-01-01 00:00:00', 'Electronics', 'M-2023'
WHERE NOT EXISTS (SELECT 1 FROM digital_product_passport LIMIT 1);