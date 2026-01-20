import express from 'express';
import { query } from '../config/db.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get my payments (Family)
router.get('/my-payments', protect, async (req, res) => {
    try {
        const [payments] = await query(
            `SELECT p.*, a.title as activity_title 
             FROM payments p 
             LEFT JOIN enrollments e ON p.enrollment_id = e.id
             LEFT JOIN activities a ON e.activity_id = a.id
             WHERE p.user_id = $1 
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener pagos' });
    }
});

// Create a Payment (Simulate paying via Bizum/Transfer)
router.post('/', protect, async (req, res) => {
    const { enrollment_id, amount, concept, method } = req.body;
    // method: 'paid_bizum' or 'paid_transfer'

    try {
        const [result] = await query(
            'INSERT INTO payments (user_id, enrollment_id, concept, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [req.user.id, enrollment_id, concept, amount, method]
        );
        res.status(201).json({ message: 'Pago registrado correctamente', id: result[0]?.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el pago' });
    }
});

export default router;
