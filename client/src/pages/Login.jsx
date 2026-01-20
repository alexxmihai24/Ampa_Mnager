import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(135deg, rgba(0,94,184,0.85) 0%, rgba(0,119,204,0.85) 50%, rgba(0,163,224,0.85) 100%), url("/school_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <Container style={{ maxWidth: '420px' }}>
                <Card className="shadow-lg border-0" style={{ borderRadius: '16px', overflow: 'hidden', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.95)' }}>
                    <Card.Header className="bg-white text-center py-4 border-0">
                        <div className="mb-2" style={{ fontSize: '3rem' }}>🏫</div>
                        <h3 className="mb-1" style={{ color: '#005eb8' }}>AMPA Manager</h3>
                        <p className="text-muted mb-0">CEIP San Francisco Solano</p>
                    </Card.Header>
                    <Card.Body className="p-4">
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">📧 Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    size="lg"
                                    style={{ borderRadius: '10px' }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">🔒 Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    size="lg"
                                    style={{ borderRadius: '10px' }}
                                />
                            </Form.Group>
                            <Button
                                className="w-100 py-2"
                                type="submit"
                                size="lg"
                                style={{
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #005eb8 0%, #0077cc 100%)',
                                    border: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                Entrar
                            </Button>
                        </Form>
                    </Card.Body>
                    <Card.Footer className="bg-light text-center py-3 border-0">
                        <span className="text-muted">¿No tienes cuenta? </span>
                        <Link to="/register" className="fw-bold" style={{ color: '#005eb8' }}>Regístrate</Link>
                    </Card.Footer>
                </Card>
                <p className="text-center text-white mt-4 small opacity-75">
                    © 2026 AMPA San Francisco Solano - Todos los derechos reservados
                </p>
            </Container>
        </div>
    );
}

export default Login;
