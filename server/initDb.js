import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    try {
        // 1. Connect without database to create it
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Connected to MySQL server...');

        // Read SQL file
        const sqlPath = path.join(__dirname, 'db.sql');
        const sqlStatements = fs.readFileSync(sqlPath, 'utf8');

        // Split statements (simple split by semicolon might be defined but let's try)
        // Actually, mysql2 supports multiple statements if configured, but let's do it manually or enable it.
        // Better: Allow Update connection to enable multiple statements

        // Create DB first
        await connection.query('CREATE DATABASE IF NOT EXISTS ampa_manager');
        console.log('Database ampa_manager created or exists.');

        await connection.query('USE ampa_manager');

        // Execute the rest of the script
        // We'll read the file and split by ';' and execute non-empty lines
        // Removing Comments might be needed.
        // Simpler: Just define the tables here in code or use the file carefully.
        // Let's rely on the file content which I know (I wrote it). It uses ;

        const statements = sqlStatements
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            // Skip USE command since we did it
            if (statement.toLowerCase().startsWith('use')) continue;
            if (statement.toLowerCase().startsWith('create database')) continue;

            await connection.query(statement);
        }

        console.log('Tables created successfully.');

        // Add an Admin User if not exists
        // Pass: 123456 (hashed)
        // bcrypt hash of '123456' is '$2a$10$EpI/..something'
        // Let's import bcrypt? No, let's just insert one manually if needed or let user register.
        // But for "I want to see it", having data is good.
        // usage: insert ignore...

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDb();
