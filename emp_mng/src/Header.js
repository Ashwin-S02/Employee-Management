import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="ms-3">Employee Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto me-3" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-4">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/employees" active={location.pathname === '/employees'}>
              Employees
            </Nav.Link>
            <Nav.Link as={Link} to="/departments" active={location.pathname === '/departments'}>
              Departments
            </Nav.Link>
            <Nav.Link as={Link} to="/reports" active={location.pathname === '/reports'}>
              Reports
            </Nav.Link>
          </Nav>
          <Form className="d-flex ms-auto me-3">
            <FormControl
              type="search"
              placeholder="Search employees..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-light">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;