import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar className="navbar-custom" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">AMPA Manager</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                                <Nav.Link as={Link} to="/activities">Actividades</Nav.Link>
                                <Nav.Link as={Link} to="/payments">Pagos</Nav.Link>
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin">Administración</Nav.Link>
                                )}
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <NavDropdown title={user.name} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/payments">Mis Pagos</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    Cerrar Sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
