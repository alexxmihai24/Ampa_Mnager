import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function initDb() {
    try {
        console.log('Connecting to PostgreSQL...');
        const client = await pool.connect();

        console.log('Reading schema...');
        const sqlPath = path.join(__dirname, 'db.sql');
        const sqlStatements = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing schema...');
        await client.query(sqlStatements);

        console.log('Tables created successfully!');

        // Seed initial admin user if not exists
        // Can't do bcrypt here easily without importing it, but let's assume registration handles it.
        // Or we could just verify connection.

        client.release();
        await pool.end();

    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDb();
