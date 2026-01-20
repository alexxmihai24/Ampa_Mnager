import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper to run queries (similar interface to mysql2)
export const query = async (text, params) => {
    const result = await pool.query(text, params);
    return [result.rows, result];
};

export default pool;
