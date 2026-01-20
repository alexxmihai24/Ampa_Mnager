import { query } from '../config/db.js';

// Get all activities
export const getActivities = async (req, res) => {
    try {
        const [activities] = await query('SELECT * FROM activities ORDER BY date DESC');

        // If user is logged in, check their enrollment status for each activity
        let activitiesWithStatus = activities;

        if (req.user) {
            const [enrollments] = await query(
                'SELECT activity_id, status FROM enrollments WHERE user_id = $1',
                [req.user.id]
            );

            const enrollmentMap = {};
            enrollments.forEach(e => {
                enrollmentMap[e.activity_id] = e.status;
            });

            activitiesWithStatus = activities.map(act => ({
                ...act,
                isEnrolled: !!enrollmentMap[act.id],
                enrollmentStatus: enrollmentMap[act.id] || null
            }));
        }

        res.json(activitiesWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener actividades' });
    }
};

// Create activity (Admin only)
export const createActivity = async (req, res) => {
    const { title, description, price, date } = req.body;
    try {
        const [result] = await query(
            'INSERT INTO activities (title, description, price, date) VALUES ($1, $2, $3, $4) RETURNING id',
            [title, description, price, date]
        );
        res.status(201).json({ id: result[0]?.id, title, description, price, date });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la actividad' });
    }
};

// Enroll in an activity
export const enrollActivity = async (req, res) => {
    const { id } = req.params; // activity id
    const userId = req.user.id;

    try {
        // Check if already enrolled
        const [existing] = await query(
            'SELECT * FROM enrollments WHERE user_id = $1 AND activity_id = $2',
            [userId, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Ya estás inscrito en esta actividad' });
        }

        await query(
            'INSERT INTO enrollments (user_id, activity_id) VALUES ($1, $2)',
            [userId, id]
        );

        res.json({ message: 'Inscripción realizada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al inscribirse' });
    }
};
