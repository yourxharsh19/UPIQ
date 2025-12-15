-- Drop table if it exists
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     username VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_ip VARCHAR(255),
    last_login_at TIMESTAMP
    );

-- Insert some default users
INSERT INTO users (username, email, password, role) VALUES
                                                        ('admin', 'admin@example.com', 'admin123', 'ADMIN'),
                                                        ('user1', 'user1@example.com', 'USER123', 'USER');
