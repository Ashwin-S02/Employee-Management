import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:3001/employees';
const DEPARTMENTS_URL = 'http://localhost:3001/departments';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    status: 'Active',
    salary: '',
    attendance: {
      daysWorked: 0,
      daysAbsent: 0,
      daysOnLeave: 0,
      lastAttendance: ''
    }
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch employees and departments
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, departmentsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(DEPARTMENTS_URL)
      ]);
      setEmployees(employeesRes.data);
      setDepartments(departmentsRes.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average salary
  const averageSalary = employees.length > 0 
    ? employees.reduce((acc, emp) => acc + emp.salary, 0) / employees.length 
    : 0;

  // Calculate department-wise average salaries
  const departmentSalaries = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { total: 0, count: 0 };
    }
    acc[emp.department].total += emp.salary;
    acc[emp.department].count += 1;
    return acc;
  }, {});

  const departmentAverages = Object.entries(departmentSalaries).map(([dept, data]) => ({
    department: dept,
    average: Math.round(data.total / data.count)
  }));

  // Calculate attendance statistics with null checks
  const attendanceStats = employees.reduce((acc, emp) => {
    const attendance = emp.attendance || {
      daysWorked: 0,
      daysAbsent: 0,
      daysOnLeave: 0,
      lastAttendance: new Date().toISOString().split('T')[0]
    };
    
    acc.totalDaysWorked += attendance.daysWorked || 0;
    acc.totalDaysAbsent += attendance.daysAbsent || 0;
    acc.totalDaysOnLeave += attendance.daysOnLeave || 0;
    return acc;
  }, { totalDaysWorked: 0, totalDaysAbsent: 0, totalDaysOnLeave: 0 });

  const averageAttendance = employees.length > 0 
    ? Math.round(attendanceStats.totalDaysWorked / employees.length)
    : 0;

  const handleClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      status: 'Active',
      salary: '',
      attendance: {
        daysWorked: 0,
        daysAbsent: 0,
        daysOnLeave: 0,
        lastAttendance: ''
      }
    });
    setSelectedEmployee(null);
  };

  const handleShow = () => {
    setShowModal(true);
    setError(null);
    setSuccessMessage('');
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      status: employee.status,
      salary: employee.salary.toString(),
      attendance: employee.attendance
    });
    setShowEditModal(true);
    setError(null);
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEmployee = {
        ...formData,
        salary: parseInt(formData.salary),
        attendance: {
          daysWorked: parseInt(formData.attendance?.daysWorked) || 0,
          daysAbsent: parseInt(formData.attendance?.daysAbsent) || 0,
          daysOnLeave: parseInt(formData.attendance?.daysOnLeave) || 0,
          lastAttendance: formData.attendance?.lastAttendance || new Date().toISOString().split('T')[0]
        }
      };
      await axios.post(API_URL, newEmployee);
      setSuccessMessage('Employee added successfully!');
      handleClose();
      fetchData();
    } catch (err) {
      setError('Error adding employee: ' + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = {
        ...formData,
        salary: parseInt(formData.salary),
        attendance: {
          daysWorked: parseInt(formData.attendance?.daysWorked) || 0,
          daysAbsent: parseInt(formData.attendance?.daysAbsent) || 0,
          daysOnLeave: parseInt(formData.attendance?.daysOnLeave) || 0,
          lastAttendance: formData.attendance?.lastAttendance || new Date().toISOString().split('T')[0]
        }
      };
      await axios.put(`${API_URL}/${selectedEmployee.id}`, updatedEmployee);
      setSuccessMessage('Employee updated successfully!');
      handleClose();
      fetchData();
    } catch (err) {
      setError('Error updating employee: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Employee deleted successfully!');
        fetchData();
      } catch (err) {
        setError('Error deleting employee: ' + err.message);
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'On Leave' : 'Active';
      await axios.patch(`${API_URL}/${id}`, { status: newStatus });
      setSuccessMessage('Employee status updated successfully!');
      fetchData();
    } catch (err) {
      setError('Error updating employee status: ' + err.message);
    }
  };

  if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;

  return (
    <div style={{ marginTop: '80px' }}>
      <Container>
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}

        <Row className="mb-4">
          <Col>
            <h2>Employee Management</h2>
            <p className="text-muted">Manage your organization's employees efficiently</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={handleShow}>
              Add New Employee
            </Button>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-white bg-primary">
              <Card.Body>
                <Card.Title>Total Employees</Card.Title>
                <h2>{employees.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-success">
              <Card.Body>
                <Card.Title>Active Employees</Card.Title>
                <h2>{employees.filter(emp => emp.status === 'Active').length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-warning">
              <Card.Body>
                <Card.Title>On Leave</Card.Title>
                <h2>{employees.filter(emp => emp.status === 'On Leave').length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-info">
              <Card.Body>
                <Card.Title>Departments</Card.Title>
                <h2>{new Set(employees.map(emp => emp.department)).size}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Attendance Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-white bg-success">
              <Card.Body>
                <Card.Title>Total Days Worked</Card.Title>
                <h2>{attendanceStats.totalDaysWorked}</h2>
                <small>Across all employees</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-danger">
              <Card.Body>
                <Card.Title>Total Days Absent</Card.Title>
                <h2>{attendanceStats.totalDaysAbsent}</h2>
                <small>Across all employees</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-warning">
              <Card.Body>
                <Card.Title>Total Days On Leave</Card.Title>
                <h2>{attendanceStats.totalDaysOnLeave}</h2>
                <small>Across all employees</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-primary">
              <Card.Body>
                <Card.Title>Average Days Worked</Card.Title>
                <h2>{averageAttendance}</h2>
                <small>Per employee</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Salary Stats Cards */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="text-white bg-dark">
              <Card.Body>
                <Card.Title>Average Salary</Card.Title>
                <h2>${Math.round(averageSalary).toLocaleString()}</h2>
                <small>Across all departments</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Department-wise Average Salaries</Card.Title>
                <div className="d-flex flex-wrap gap-3">
                  {departmentAverages.map(({ department, average }) => (
                    <div key={department} className="text-center">
                      <h6 className="mb-1">{department}</h6>
                      <h5 className="text-primary mb-0">${average.toLocaleString()}</h5>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Employee Table */}
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>
                      <Button 
                        variant={employee.status === 'Active' ? 'success' : 'warning'}
                        size="sm"
                        onClick={() => handleStatusChange(employee.id, employee.status)}
                      >
                        {employee.status}
                      </Button>
                    </td>
                    <td>${employee.salary.toLocaleString()}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <small className="text-success">
                          <strong>Worked:</strong> {employee.attendance?.daysWorked || 0} days
                        </small>
                        <small className="text-danger">
                          <strong>Absent:</strong> {employee.attendance?.daysAbsent || 0} days
                        </small>
                        <small className="text-warning">
                          <strong>On Leave:</strong> {employee.attendance?.daysOnLeave || 0} days
                        </small>
                        <small className="text-muted">
                          <strong>Last:</strong> {employee.attendance?.lastAttendance 
                            ? new Date(employee.attendance.lastAttendance).toLocaleDateString()
                            : 'Not recorded'}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(employee)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Add Employee Modal */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>{department.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter salary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Attendance</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      name="daysWorked"
                      placeholder="Days Worked"
                      value={formData.attendance?.daysWorked || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, daysWorked: parseInt(e.target.value) || 0 }
                      }))}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="daysAbsent"
                      placeholder="Days Absent"
                      value={formData.attendance?.daysAbsent || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, daysAbsent: parseInt(e.target.value) || 0 }
                      }))}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="daysOnLeave"
                      placeholder="Days On Leave"
                      value={formData.attendance?.daysOnLeave || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, daysOnLeave: parseInt(e.target.value) || 0 }
                      }))}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Attendance Date</Form.Label>
                <Form.Control
                  type="date"
                  name="lastAttendance"
                  value={formData.attendance?.lastAttendance || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    attendance: { ...prev.attendance, lastAttendance: e.target.value }
                  }))}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Add Employee
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Employee Modal */}
        <Modal show={showEditModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>{department.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter salary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Attendance</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      name="daysWorked"
                      placeholder="Days Worked"
                      value={formData.attendance?.daysWorked || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, daysWorked: parseInt(e.target.value) || 0 }
                      }))}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="daysAbsent"
                      placeholder="Days Absent"
                      value={formData.attendance?.daysAbsent || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, daysAbsent: parseInt(e.target.value) || 0 }
                      }))}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="daysOnLeave"
                      placeholder="Days On Leave"
                      value={formData.attendance?.daysOnLeave || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, daysOnLeave: parseInt(e.target.value) || 0 }
                      }))}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Attendance Date</Form.Label>
                <Form.Control
                  type="date"
                  name="lastAttendance"
                  value={formData.attendance?.lastAttendance || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    attendance: { ...prev.attendance, lastAttendance: e.target.value }
                  }))}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Employee
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Employees; 