-- Drop table if it exists (optional, useful for fresh start)
DROP TABLE IF EXISTS categories;

-- Create table
CREATE TABLE IF NOT EXISTS categories (
                                          id SERIAL PRIMARY KEY,
                                          user_id BIGINT NOT NULL,
                                          name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Insert default categories with description
INSERT INTO categories (user_id, name, type, description) VALUES
                                                              (1, 'Food', 'EXPENSE', 'Expenses for food and groceries'),
                                                              (2, 'Shopping', 'EXPENSE', 'Expenses for shopping and personal items'),
                                                              (3, 'Bills', 'EXPENSE', 'Utility bills and subscriptions'),
                                                              (4, 'Transport', 'EXPENSE', 'Travel and transport expenses'),
                                                              (5, 'Medical', 'EXPENSE', 'Medical and healthcare expenses'),
                                                              (6, 'Entertainment', 'EXPENSE', 'Movies, games, and leisure'),
                                                              (7, 'Salary', 'INCOME', 'Monthly salary received'),
                                                              (8, 'Interest', 'INCOME', 'Bank interest or investment returns'),
                                                              (9, 'Business', 'INCOME', 'Business-related income'),
                                                              (10, 'Other', 'EXPENSE', 'Other miscellaneous expenses');
