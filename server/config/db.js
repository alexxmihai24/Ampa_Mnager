import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

// Neon/Vercel Postgres requires SSL.
// specific handling: if URL contains neon.tech, enforce SSL
const isNeon = connectionString && connectionString.includes('neon.tech');
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: connectionString,
    ssl: (isNeon || isProduction) ? { rejectUnauthorized: false } : false
});

// Helper to run queries
export const query = async (text, params) => {
    const result = await pool.query(text, params);
    return [result.rows, result];
};

export default pool;
