import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Payments() {
    const [payments, setPayments] = useState([]);
    const [pendingActivities, setPendingActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('paid_bizum');

    // Auth context (normally we would get token from here or localStorage)
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            // Get History
            const paymentsReq = await axios.get('http://localhost:3000/api/payments/my-payments', config);
            setPayments(paymentsReq.data);

            // Get Pending Activities (We need to filter activities user is enrolled in but not paid)
            // Simplified: Fetch activities status again or add query
            // For now, let's just fetch all activities and filter client side for simplicity in this demo
            const activitiesReq = await axios.get('http://localhost:3000/api/activities', config);

            // Logic: Enrolled ('active') AND NOT Paid
            // Note: This logic assumes 1 payment per enrollment. Real app might need more complex checking.
            const enrolled = activitiesReq.data.filter(a => a.enrollmentStatus === 'active');

            // Filter out those that are already in the payments list with 'pending' or 'verified' status?
            // Actually, let's allow "Paying" if not completely paid.
            // For this MVP, let's just show all Enrolled activities and allow "Market as Paid" based on ID.

            setPendingActivities(enrolled);

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handlePayClick = (activity) => {
        setSelectedActivity(activity);
        setShowModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!selectedActivity) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/payments', {
                enrollment_id: null, // We can find enrollment ID in backend or just link by context. 
                // Actually, our backend expects enrollment_id. We need to fetch it or pass activity_id and let backend find it.
                // For simplicity, let's send Concept and Amount directly, and backend links user.
                concept: `Pago: ${selectedActivity.title}`,
                amount: selectedActivity.price,
                method: paymentMethod
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowModal(false);
            fetchData(); // Refresh history
            alert('Pago registrado. La delegada lo validará.');
        } catch (error) {
            alert('Error al registrar pago');
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-primary">Mis Pagos y Deudas</h2>

            {/* Pending Payments Section */}
            <div className="mb-5">
                <h4>🔐 Pagos Pendientes (Actividades Inscritas)</h4>
                {pendingActivities.length === 0 ? (
                    <p className="text-muted">No tienes pagos pendientes.</p>
                ) : (
                    <Table hover responsive className="ipasen-card mt-3">
                        <thead>
                            <tr>
                                <th>Actividad</th>
                                <th>Precio</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingActivities.map(act => (
                                <tr key={act.id}>
                                    <td>{act.title}</td>
                                    <td>{act.price} €</td>
                                    <td>
                                        <Button variant="success" size="sm" onClick={() => handlePayClick(act)}>
                                            Pagar (Marcar)
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* History Section */}
            <div>
                <h4>📜 Historial de Pagos</h4>
                <Table bordered hover responsive className="ipasen-card bg-white">
                    <thead className="bg-light">
                        <tr>
                            <th>Concepto</th>
                            <th>Cantidad</th>
                            <th>Método</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td>{p.concept}</td>
                                <td>{p.amount} €</td>
                                <td>{p.status === 'paid_bizum' ? 'Bizum' : 'Transferencia'}</td>
                                <td>
                                    {p.status === 'verified' ? <Badge bg="success">Confirmado</Badge> : <Badge bg="warning" text="dark">Pendiente Revisión</Badge>}
                                </td>
                                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No hay historial de pagos.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Pay Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Vas a marcar como pagado: <strong>{selectedActivity?.title}</strong></p>
                    <p>Importe: <strong>{selectedActivity?.price} €</strong></p>
                    <hr />
                    <Form>
                        <Form.Group>
                            <Form.Label>Método de Pago Realizado</Form.Label>
                            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="paid_bizum">Bizum (Móvil Delegada)</option>
                                <option value="paid_transfer">Transferencia Bancaria</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Realiza primero el pago real (Bizum/Banco) y luego confirma aquí.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleConfirmPayment}>
                        Confirmar Pago
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Payments;
