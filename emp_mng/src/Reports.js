import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, departmentsRes] = await Promise.all([
        axios.get(`${API_URL}/employees`),
        axios.get(`${API_URL}/departments`)
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

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const averageSalary = Math.round(totalSalary / totalEmployees);

  // Calculate department statistics
  const departmentStats = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept.name);
    const deptTotalSalary = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    const deptActiveEmployees = deptEmployees.filter(emp => emp.status === 'Active').length;
    const deptOnLeaveEmployees = deptEmployees.filter(emp => emp.status === 'On Leave').length;

    return {
      name: dept.name,
      employeeCount: deptEmployees.length,
      activeEmployees: deptActiveEmployees,
      onLeaveEmployees: deptOnLeaveEmployees,
      totalSalary: deptTotalSalary,
      averageSalary: Math.round(deptTotalSalary / deptEmployees.length) || 0,
      budget: dept.budget,
      budgetUtilization: Math.round((deptTotalSalary / dept.budget) * 100) || 0
    };
  });

  // Calculate attendance statistics
  const attendanceStats = employees.reduce((acc, emp) => {
    const attendance = emp.attendance || { daysWorked: 0, daysAbsent: 0, daysOnLeave: 0 };
    acc.totalDaysWorked += attendance.daysWorked;
    acc.totalDaysAbsent += attendance.daysAbsent;
    acc.totalDaysOnLeave += attendance.daysOnLeave;
    return acc;
  }, { totalDaysWorked: 0, totalDaysAbsent: 0, totalDaysOnLeave: 0 });

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

        <Row className="mb-4">
          <Col>
            <h2>Reports & Analytics</h2>
            <p className="text-muted">View and analyze employee and department data</p>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Quick Stats */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm bg-primary bg-opacity-10">
              <Card.Body>
                <h6 className="text-primary mb-2">Total Employees</h6>
                <h3 className="mb-0 text-primary">{totalEmployees}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm bg-success bg-opacity-10">
              <Card.Body>
                <h6 className="text-success mb-2">Active Employees</h6>
                <h3 className="mb-0 text-success">{activeEmployees}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm bg-warning bg-opacity-10">
              <Card.Body>
                <h6 className="text-warning mb-2">On Leave</h6>
                <h3 className="mb-0 text-warning">{onLeaveEmployees}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm bg-info bg-opacity-10">
              <Card.Body>
                <h6 className="text-info mb-2">Avg. Salary</h6>
                <h3 className="mb-0 text-info">${averageSalary.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Department Performance */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Department Performance</h5>
          </Card.Header>
          <Card.Body className="bg-light">
            <Table responsive hover className="align-middle">
              <thead className="bg-primary bg-opacity-10">
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Active</th>
                  <th>On Leave</th>
                  <th>Total Salary</th>
                  <th>Avg. Salary</th>
                  <th>Budget</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept) => (
                  <tr key={dept.name}>
                    <td className="fw-bold">{dept.name}</td>
                    <td>{dept.employeeCount}</td>
                    <td><span className="badge bg-success">{dept.activeEmployees}</span></td>
                    <td><span className="badge bg-warning">{dept.onLeaveEmployees}</span></td>
                    <td className="text-success">${dept.totalSalary.toLocaleString()}</td>
                    <td className="text-info">${dept.averageSalary.toLocaleString()}</td>
                    <td className="text-primary">${dept.budget.toLocaleString()}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={dept.budgetUtilization} 
                          variant={dept.budgetUtilization > 90 ? 'danger' : 'success'}
                          style={{ width: '100px' }}
                          className="bg-opacity-25"
                        />
                        <span className="ms-2">{dept.budgetUtilization}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Attendance Report */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">Attendance Report</h5>
          </Card.Header>
          <Card.Body className="bg-light">
            <Row className="mb-4">
              <Col md={4}>
                <Card className="border-0 bg-success bg-opacity-10">
                  <Card.Body>
                    <h6 className="text-success mb-2">Total Days Worked</h6>
                    <h3 className="mb-0 text-success">{attendanceStats.totalDaysWorked}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 bg-danger bg-opacity-10">
                  <Card.Body>
                    <h6 className="text-danger mb-2">Total Days Absent</h6>
                    <h3 className="mb-0 text-danger">{attendanceStats.totalDaysAbsent}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 bg-warning bg-opacity-10">
                  <Card.Body>
                    <h6 className="text-warning mb-2">Total Days on Leave</h6>
                    <h3 className="mb-0 text-warning">{attendanceStats.totalDaysOnLeave}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Table responsive hover>
              <thead className="bg-success bg-opacity-10">
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Days Worked</th>
                  <th>Days Absent</th>
                  <th>Days on Leave</th>
                  <th>Last Attendance</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td className="fw-bold">{emp.name}</td>
                    <td>{emp.department}</td>
                    <td className="text-success">{emp.attendance?.daysWorked || 0}</td>
                    <td className="text-danger">{emp.attendance?.daysAbsent || 0}</td>
                    <td className="text-warning">{emp.attendance?.daysOnLeave || 0}</td>
                    <td>{emp.attendance?.lastAttendance || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Salary Report */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">Salary Report</h5>
          </Card.Header>
          <Card.Body className="bg-light">
            <Table responsive hover>
              <thead className="bg-info bg-opacity-10">
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Department Avg.</th>
                  <th>Company Avg.</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const deptStats = departmentStats.find(d => d.name === emp.department);
                  return (
                    <tr key={emp.id}>
                      <td className="fw-bold">{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>
                        <span className={`badge bg-${emp.status === 'Active' ? 'success' : 'warning'}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="text-primary">${emp.salary.toLocaleString()}</td>
                      <td className="text-info">${deptStats?.averageSalary.toLocaleString() || 0}</td>
                      <td className="text-success">${averageSalary.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Reports; 