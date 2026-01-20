import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password); // Default role is family
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Registro</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name" className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group id="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group id="password" className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button className="w-100" type="submit">
                            Registrarse
                        </Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Register;
