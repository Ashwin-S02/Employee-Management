import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Tab } from 'react-bootstrap';
import './Landing.css';

function Landing() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <React.Fragment>
      <div className="modern-background">
        {/* Background Pattern */}
        <div className="background-pattern"></div>
        
        {/* Animated Background Circles */}
        <div className="animated-circle animated-circle-1"></div>
        <div className="animated-circle animated-circle-2"></div>
        <div className="animated-circle animated-circle-3"></div>
        
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="shadow-lg border-0" style={{ 
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px'
              }}>
                <Card.Body className="p-5">
                  <h2 className="text-center mb-4" style={{ color: '#764ba2' }}>Welcome Back</h2>
                  <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="pills" className="nav-fill mb-4" style={{ 
                      backgroundColor: 'rgba(118, 75, 162, 0.1)',
                      borderRadius: '10px',
                      padding: '5px'
                    }}>
                      <Nav.Item>
                        <Nav.Link eventKey="login" style={{ 
                          borderRadius: '8px',
                          color: activeTab === 'login' ? 'white' : '#764ba2',
                          backgroundColor: activeTab === 'login' ? '#764ba2' : 'transparent'
                        }}>Login</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="signup" style={{ 
                          borderRadius: '8px',
                          color: activeTab === 'signup' ? 'white' : '#764ba2',
                          backgroundColor: activeTab === 'signup' ? '#764ba2' : 'transparent'
                        }}>Sign Up</Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="Remember me" />
                          </Form.Group>
                          <Button variant="primary" type="submit" className="w-100">
                            Login
                          </Button>
                          <div className="text-center mt-3">
                            <a href="#forgot" className="text-decoration-none">Forgot Password?</a>
                          </div>
                        </Form>
                      </Tab.Pane>

                      <Tab.Pane eventKey="signup">
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your full name" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Check 
                              type="checkbox" 
                              label="I agree to the Terms of Service and Privacy Policy" 
                            />
                          </Form.Group>
                          <Button variant="primary" type="submit" className="w-100">
                            Create Account
                          </Button>
                        </Form>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ marginTop: '80px' }}>
        <Container>
          {/* Features Section */}
          <Row className="mt-5">
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://img.freepik.com/free-vector/team-management-concept-illustration_114360-1183.jpg" 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Employee Management</Card.Title>
                  <Card.Text>
                    Efficiently manage your workforce with our comprehensive employee tracking system.
                    Handle profiles, attendance, and performance metrics all in one place.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://img.freepik.com/free-vector/organizational-structure-concept-illustration_114360-1610.jpg"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Department Organization</Card.Title>
                  <Card.Text>
                    Organize your company structure with our department management tools.
                    Create, modify, and maintain department hierarchies effortlessly.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src="https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle-isolated-flat-vector-illustration-cartoon-partners-working-connection-teamwork-partnership-cooperation-concept_74855-9814.jpg"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>Team Collaboration</Card.Title>
                  <Card.Text>
                    Foster better team collaboration with our integrated communication tools.
                    Keep everyone connected and working towards common goals.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stats Section */}
          <Row className="bg-light p-4 rounded mt-5">
            <Col md={4} className="text-center">
              <h2 className="display-4">500+</h2>
              <p className="lead">Employees Managed</p>
            </Col>
            <Col md={4} className="text-center">
              <h2 className="display-4">50+</h2>
              <p className="lead">Departments</p>
            </Col>
            <Col md={4} className="text-center">
              <h2 className="display-4">98%</h2>
              <p className="lead">Satisfaction Rate</p>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Landing; 