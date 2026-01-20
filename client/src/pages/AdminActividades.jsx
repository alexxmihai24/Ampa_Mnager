import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

function AdminActividades() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        date: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/activities', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Actividad creada con éxito', type: 'success' });
            setFormData({ title: '', description: '', price: '', date: '' });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Error al crear actividad', type: 'danger' });
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Panel de Administración</h2>

            <Card className="ipasen-card">
                <Card.Body>
                    <Card.Title className="mb-4">Nueva Actividad / Excursión</Card.Title>
                    {message.text && <Alert variant={message.type}>{message.text}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio (€)</Form.Label>
                                    <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha</Form.Label>
                                    <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                                </Form.Group>
                            </div>
                        </div>

                        <Button variant="primary" type="submit">
                            Publicar Actividad
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminActividades;
