import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        const [existingUsers] = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, hashedPassword, role || 'family']
        );

        const insertId = result[0]?.id;

        // Create Token
        const token = jwt.sign(
            { id: insertId, role: role || 'family' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'Usuario registrado con éxito',
            token,
            user: {
                id: insertId,
                name,
                email,
                role: role || 'family'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check user
        const [users] = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Create Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getMe = async (req, res) => {
    try {
        const [users] = await query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
}
