import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                                                 id SERIAL PRIMARY KEY,
                                                 email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

            CREATE TABLE IF NOT EXISTS categories (
                                                      id SERIAL PRIMARY KEY,
                                                      name VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

            CREATE TABLE IF NOT EXISTS posts (
                                                 id SERIAL PRIMARY KEY,
                                                 title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

            CREATE TABLE IF NOT EXISTS post_categories (
                                                           post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
                PRIMARY KEY (post_id, category_id)
                );

            CREATE TABLE IF NOT EXISTS comments (
                                                    id SERIAL PRIMARY KEY,
                                                    content TEXT NOT NULL,
                                                    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

            CREATE TABLE IF NOT EXISTS likes (
                                                 id SERIAL PRIMARY KEY,
                                                 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CHECK (
            (post_id IS NOT NULL AND comment_id IS NULL) OR
            (post_id IS NULL AND comment_id IS NOT NULL)
                )
                );
        `);
        console.log('Database schema initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

export default pool;