-- Create Carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    status ENUM ('OPEN', 'ORDERED')
);

-- Create Cart Items table
CREATE TABLE cart_items (
    cart_id UUID REFERENCES carts (id),
    product_id UUID,
    count INTEGER
);

-- Insert test data into Carts table
INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES
    ('1c2e4998-5c2f-4f0d-8e7c-281730f1c550', 'a6d98b47-6517-4f8a-9b48-70253b32d3ae', '2023-05-28', '2023-05-28', 'OPEN'),
    ('e8041b54-88e2-4297-bd1a-457b7a13512d', 'f719a654-7e21-4b98-87e8-9d524f5e6d9c', '2023-05-27', '2023-05-27', 'ORDERED');

-- Insert test data into Cart Items table
INSERT INTO cart_items (cart_id, product_id, count)
VALUES
    ('1c2e4998-5c2f-4f0d-8e7c-281730f1c550', 'c561d41c-346d-42e7-9105-8a57c40f429f', 2),
    ('1c2e4998-5c2f-4f0d-8e7c-281730f1c550', '8c6be3f6-2911-4cb0-9152-c122206d800e', 3),
    ('e8041b54-88e2-4297-bd1a-457b7a13512d', 'f4152f8e-0237-4ad7-9e0b-ace5ff1e2ea3', 1);