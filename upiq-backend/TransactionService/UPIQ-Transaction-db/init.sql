-- Drop table if exists
DROP TABLE IF EXISTS transactions;

-- Create transactions table
CREATE TABLE transactions (
                              id SERIAL PRIMARY KEY,
                              user_id BIGINT NOT NULL,
                              amount NUMERIC(15,2) NOT NULL,
                              type VARCHAR(50) NOT NULL,       -- income/expense
                              category VARCHAR(255) NOT NULL,
                              description VARCHAR(255),
                              date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              payment_method VARCHAR(50)
);

-- Optional default data
INSERT INTO transactions (user_id, amount, type, category, description, payment_method) VALUES
                                                                                            (1, 500.00, 'EXPENSE', 'Food', 'Groceries purchase', 'UPI'),
                                                                                            (2, 1200.00, 'EXPENSE', 'Shopping', 'Clothes and accessories', 'Card'),
                                                                                            (3, 5000.00, 'INCOME', 'Salary', 'Monthly salary', 'Bank Transfer'),
                                                                                            (4, 300.00, 'EXPENSE', 'Transport', 'Taxi fare', 'Cash'),
                                                                                            (5, 200.00, 'EXPENSE', 'Medical', 'Medicines', 'UPI');