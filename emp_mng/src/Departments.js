import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:3001/departments';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    budget: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch departments and employees
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [departmentsRes, employeesRes] = await Promise.all([
        axios.get(API_URL),
        axios.get('http://localhost:3001/employees')
      ]);
      setDepartments(departmentsRes.data);
      setEmployees(employeesRes.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate department statistics
  const departmentStats = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = {
        employeeCount: 0,
        totalSalary: 0,
        activeEmployees: 0,
        onLeaveEmployees: 0,
        employees: []
      };
    }
    
    acc[emp.department].employeeCount++;
    acc[emp.department].totalSalary += emp.salary;
    acc[emp.department].employees.push(emp);
    
    if (emp.status === 'Active') {
      acc[emp.department].activeEmployees++;
    } else if (emp.status === 'On Leave') {
      acc[emp.department].onLeaveEmployees++;
    }
    
    return acc;
  }, {});

  const handleClose = () => {
    setShowModal(false);
    setShowViewModal(false);
    setSelectedDepartment(null);
    setFormData({
      name: '',
      description: '',
      manager: '',
      budget: ''
    });
  };

  const handleShow = (department = null) => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
        manager: department.manager,
        budget: department.budget
      });
      setSelectedDepartment(department);
    } else {
      setFormData({
        name: '',
        description: '',
        manager: '',
        budget: ''
      });
      setSelectedDepartment(null);
    }
    setShowModal(true);
    setError(null);
    setSuccessMessage('');
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // POST - Create new department
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, formData);
      setDepartments([...departments, response.data]);
      setSuccessMessage('Department created successfully!');
      handleClose();
    } catch (err) {
      setError('Error creating department: ' + err.message);
    }
  };

  // PUT - Update department
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/${selectedDepartment.id}`, formData);
      setDepartments(departments.map(dept => 
        dept.id === selectedDepartment.id ? response.data : dept
      ));
      setSuccessMessage('Department updated successfully!');
      handleClose();
    } catch (err) {
      setError('Error updating department: ' + err.message);
    }
  };

  // DELETE - Remove department
  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`${API_URL}/${departmentId}`);
        setDepartments(departments.filter(dept => dept.id !== departmentId));
        setSuccessMessage('Department deleted successfully!');
      } catch (err) {
        setError('Error deleting department: ' + err.message);
      }
    }
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: '80px' }}>
      <Container>
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}

        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="mb-0">Department Management</h2>
            <p className="text-muted mb-0">Manage your organization's departments</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={() => handleShow()}>
              <i className="bi bi-plus-circle me-2"></i>
              Add New Department
            </Button>
          </Col>
        </Row>

        {/* Department Stats Cards */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Departments</h6>
                    <h3 className="mb-0">{departments.length}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <i className="bi bi-building text-primary fs-4"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Employees</h6>
                    <h3 className="mb-0">{employees.length}</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <i className="bi bi-people text-success fs-4"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Avg. Department Size</h6>
                    <h3 className="mb-0">{Math.round(employees.length / departments.length)}</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <i className="bi bi-graph-up text-info fs-4"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Avg. Salary</h6>
                    <h3 className="mb-0">${Math.round(employees.reduce((acc, emp) => acc + emp.salary, 0) / employees.length).toLocaleString()}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <i className="bi bi-currency-dollar text-warning fs-4"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Department Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table responsive hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Department</th>
                  <th>Manager</th>
                  <th>Employees</th>
                  <th>Budget</th>
                  <th>View</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => {
                  const stats = departmentStats[dept.name] || {
                    employeeCount: 0,
                    activeEmployees: 0,
                    onLeaveEmployees: 0
                  };
                  
                  return (
                    <tr key={dept.id}>
                      <td>
                        <div>
                          <h6 className="mb-0">{dept.name}</h6>
                          <small className="text-muted">
                            {dept.description}
                          </small>
                        </div>
                      </td>
                      <td>{dept.manager}</td>
                      <td>
                        <Badge bg="primary" className="px-3 py-2">
                          {stats.employeeCount}
                        </Badge>
                      </td>
                      <td>${dept.budget?.toLocaleString()}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleViewDepartment(dept)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </Button>
                      </td>
                      <td>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          className="me-2"
                          onClick={() => handleShow(dept)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Add/Edit Department Modal */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              {selectedDepartment ? 'Edit Department' : 'Add New Department'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={selectedDepartment ? handleUpdate : handleCreate}>
              <Form.Group className="mb-3">
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter department description"
                  rows={3}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Department Manager</Form.Label>
                <Form.Control
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  placeholder="Enter manager name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Annual Budget</Form.Label>
                <Form.Control
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter annual budget"
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="light" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {selectedDepartment ? 'Update Department' : 'Add Department'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* View Department Modal */}
        <Modal show={showViewModal} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>Department Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDepartment && (
              <>
                <Row className="mb-4">
                  <Col md={6}>
                    <h5>{selectedDepartment.name}</h5>
                    <p className="text-muted">{selectedDepartment.description}</p>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-muted mb-2">Department Manager</h6>
                        <p className="mb-0">{selectedDepartment.manager}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-muted mb-2">Annual Budget</h6>
                        <p className="mb-0">${selectedDepartment.budget?.toLocaleString()}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <h5 className="mb-3">Department Employees</h5>
                <Table responsive hover>
                  <thead className="bg-light">
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(departmentStats[selectedDepartment.name]?.employees || []).map(emp => (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.position}</td>
                        <td>
                          <Badge bg={emp.status === 'Active' ? 'success' : 'warning'}>
                            {emp.status}
                          </Badge>
                        </td>
                        <td>${emp.salary.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                handleClose();
                handleShow(selectedDepartment);
              }}
            >
              Edit Department
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Departments; 