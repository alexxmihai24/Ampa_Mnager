import { Container, Card, Row, Col, Badge, ListGroup, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Sample Data - In a real app this would come from the backend
const SAMPLE_CHILDREN = [
    { id: 1, name: 'María García López', class: '3º Primaria A', avatar: '👧' },
    { id: 2, name: 'Pablo García López', class: '1º ESO B', avatar: '👦' },
];

const SAMPLE_NEWS = [
    { id: 1, title: '📚 Reunión de padres - 2º Trimestre', date: '25 Enero 2026', type: 'info', content: 'Se convoca a todos los padres del centro a la reunión trimestral.' },
    { id: 2, title: '🎭 Función de Navidad - Fotos disponibles', date: '20 Enero 2026', type: 'success', content: 'Ya están disponibles las fotos de la función navideña.' },
    { id: 3, title: '⚠️ Cierre por festividad local', date: '18 Enero 2026', type: 'warning', content: 'El centro permanecerá cerrado el día 28 de febrero.' },
];

const SAMPLE_EDICTOS = [
    { id: 1, title: 'Cuota AMPA 2026 - Plazo hasta 15 Feb', urgent: true },
    { id: 2, title: 'Inscripciones Actividades Extraescolares', urgent: false },
    { id: 3, title: 'Excursión Zoo - Autorización requerida', urgent: true },
    { id: 4, title: 'Sudaderas del Cole - Pedidos abiertos', urgent: false },
];

function Home() {
    const { user } = useAuth();

    return (
        <Container className="mt-4">
            {/* Welcome Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-0">Bienvenido, {user?.name}</h1>
                    <p className="text-muted mb-0">AMPA San Francisco Solano</p>
                </div>
                <div className="d-none d-md-block">
                    <span className="badge bg-primary p-2 me-2">📅 {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
            </div>

            <Row>
                {/* Left Column - Children & Quick Actions */}
                <Col lg={4} className="mb-4">
                    {/* My Children Card */}
                    <Card className="ipasen-card mb-3 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <strong>👨‍👩‍👧‍👦 Mis Hijos/as</strong>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {SAMPLE_CHILDREN.map(child => (
                                <ListGroup.Item key={child.id} className="d-flex align-items-center">
                                    <span className="fs-3 me-3">{child.avatar}</span>
                                    <div>
                                        <strong>{child.name}</strong>
                                        <br />
                                        <small className="text-muted">{child.class}</small>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="ipasen-card shadow-sm">
                        <Card.Header className="bg-secondary text-white">
                            <strong>⚡ Acciones Rápidas</strong>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item action as={Link} to="/activities" className="d-flex justify-content-between">
                                <span>📋 Ver Actividades</span>
                                <Badge bg="info">3 disponibles</Badge>
                            </ListGroup.Item>
                            <ListGroup.Item action as={Link} to="/payments" className="d-flex justify-content-between">
                                <span>💳 Mis Pagos</span>
                                <Badge bg="danger">2 pendientes</Badge>
                            </ListGroup.Item>
                            <ListGroup.Item action href="#">
                                <span>📄 Autorizaciones</span>
                            </ListGroup.Item>
                            <ListGroup.Item action href="#">
                                <span>📞 Contactar Delegada</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                {/* Center Column - News */}
                <Col lg={5} className="mb-4">
                    <Card className="ipasen-card shadow-sm h-100">
                        <Card.Header className="bg-info text-white">
                            <strong>📰 Últimas Noticias</strong>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {SAMPLE_NEWS.map(news => (
                                <Alert key={news.id} variant={news.type} className="mb-3">
                                    <Alert.Heading className="h6 mb-1">{news.title}</Alert.Heading>
                                    <small className="text-muted d-block mb-1">{news.date}</small>
                                    <p className="mb-0 small">{news.content}</p>
                                </Alert>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Column - Tablón de Edictos */}
                <Col lg={3} className="mb-4">
                    <Card className="ipasen-card shadow-sm h-100 border-warning">
                        <Card.Header className="bg-warning text-dark">
                            <strong>📌 Tablón de Edictos</strong>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {SAMPLE_EDICTOS.map(edicto => (
                                <ListGroup.Item key={edicto.id} className="py-3">
                                    <div className="d-flex align-items-start">
                                        {edicto.urgent && <Badge bg="danger" className="me-2">!</Badge>}
                                        <span className={edicto.urgent ? 'fw-bold' : ''}>{edicto.title}</span>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Card.Footer className="text-center bg-light">
                            <small><a href="#">Ver todos los edictos →</a></small>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* Bottom Stats Row */}
            <Row className="mt-3">
                <Col md={3} className="mb-3">
                    <Card className="text-center ipasen-card shadow-sm border-0 bg-primary text-white">
                        <Card.Body>
                            <h2 className="mb-0">127</h2>
                            <small>Familias en el AMPA</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center ipasen-card shadow-sm border-0 bg-success text-white">
                        <Card.Body>
                            <h2 className="mb-0">5</h2>
                            <small>Actividades Activas</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center ipasen-card shadow-sm border-0 bg-info text-white">
                        <Card.Body>
                            <h2 className="mb-0">42</h2>
                            <small>Inscripciones este mes</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="text-center ipasen-card shadow-sm border-0 bg-warning text-dark">
                        <Card.Body>
                            <h2 className="mb-0">3</h2>
                            <small>Edictos Nuevos</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
