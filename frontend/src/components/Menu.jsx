import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Menu() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>

        <Navbar.Brand href="/">
          Mi Tienda
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            <Nav.Link href="/clientes">
              Clientes
            </Nav.Link>

            <Nav.Link href="/productos">
              Productos
            </Nav.Link>

            <Nav.Link href="/ventas">
              Ventas
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Menu;

