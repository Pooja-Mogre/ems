import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css'; // Keep this for additional custom styling

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        managerName: '',
        gender: '',
        phoneNumber: '',
        emergencyContact: '',
        currentProject: ''
    });

    // Validation Errors
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/employees', {
                    withCredentials: true
                });
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                setError('Failed to fetch employee data.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const validateForm = () => {
        let errors = {};
        if (!employeeData.name) errors.name = 'Name is required';
        if (!employeeData.email) errors.email = 'Email is required';
        if (!employeeData.managerName) errors.managerName = 'Manager name is required';
        if (!employeeData.gender) errors.gender = 'Gender is required';
        if (!employeeData.phoneNumber) errors.phoneNumber = 'Phone number is required';
        if (!employeeData.emergencyContact) errors.emergencyContact = 'Emergency contact is required';
        if (!employeeData.currentProject) errors.currentProject = 'Current project is required';

        // Additional validations
        if (employeeData.phoneNumber && !/^\d{10}$/.test(employeeData.phoneNumber)) {
            errors.phoneNumber = 'Phone number must be 10 digits';
        }
        if (employeeData.gender && !['Male', 'Female', 'Other'].includes(employeeData.gender)) {
            errors.gender = 'Gender must be Male, Female, or Other';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEditClick = (employee) => {
        setEditingEmployee(employee.id);
        setEmployeeData({
            name: employee.name || '',
            email: employee.email || '',
            managerName: employee.managerName || '',
            gender: employee.gender || '',
            phoneNumber: employee.phoneNumber || '',
            emergencyContact: employee.emergencyContact || '',
            currentProject: employee.currentProject || ''
        });
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            const originalEmployees = [...employees];
            setEmployees(employees.filter(employee => employee.id !== id));

            try {
                await axios.delete(`http://localhost:8081/api/employees/${id}`, {
                    withCredentials: true
                });
            } catch (error) {
                console.error('Error deleting employee:', error);
                setEmployees(originalEmployees);
                setError('Failed to delete employee.');
            }
        }
    };

    const handleUpdateEmployee = async () => {
        if (validateForm()) {
            try {
                const response = await axios.put(`http://localhost:8081/api/employees/${editingEmployee}`, employeeData, {
                    withCredentials: true
                });
                console.log("Employee updated successfully:", response.data);
                setEmployees(employees.map(employee => (employee.id === editingEmployee ? response.data : employee)));
                setEditingEmployee(null);
                setEmployeeData({
                    name: '',
                    email: '',
                    managerName: '',
                    gender: '',
                    phoneNumber: '',
                    emergencyContact: '',
                    currentProject: ''
                });
                setValidationErrors({});
            } catch (error) {
                console.error('Error updating employee:', error);
                if (error.response) {
                    console.error('Server responded with:', error.response.data);
                    setError(error.response.data.message || 'Failed to update employee.');
                } else {
                    setError('Failed to update employee.');
                }
            }
        }
    };

    const handleAddEmployee = async () => {
        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:8081/api/employees', employeeData, {
                    withCredentials: true
                });
                setEmployees([...employees, response.data]);
                setEmployeeData({
                    name: '',
                    email: '',
                    managerName: '',
                    gender: '',
                    phoneNumber: '',
                    emergencyContact: '',
                    currentProject: ''
                });
                setValidationErrors({});
            } catch (error) {
                console.error('Error adding employee:', error);
                setError('Failed to add employee.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="Backimg">

        <div className="container mt-5">
            <h1 className="text-center mb-4">Admin Dashboard</h1>
            <img src="path/to/your/image.jpg" alt="Admin" className="img-fluid mb-4" />
            <div className="card mb-4">
                <div className="card-body">
                    <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
                    <div className="form-group">
                        {['name', 'email', 'managerName', 'gender', 'phoneNumber', 'emergencyContact', 'currentProject'].map((field) => (
                            <div key={field}>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    className="form-control mb-2"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                    value={employeeData[field] || ''}
                                    onChange={(e) => setEmployeeData({ ...employeeData, [field]: e.target.value })}
                                />
                                {validationErrors[field] && <p className="text-danger">{validationErrors[field]}</p>}
                            </div>
                        ))}
                        <button className={`btn ${editingEmployee ? 'btn-success' : 'btn-primary'}`} onClick={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
                            {editingEmployee ? 'Update Employee' : 'Add Employee'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Employee Name</th>
                            <th>Email</th>
                            <th>Manager</th>
                            <th>Gender</th>
                            <th>Phone Number</th>
                            <th>Emergency Contact</th>
                            <th>Current Project</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.managerName}</td>
                                    <td>{employee.gender}</td>
                                    <td>{employee.phoneNumber}</td>
                                    <td>{employee.emergencyContact}</td>
                                    <td>{employee.currentProject}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm mr-1" onClick={() => handleEditClick(employee)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(employee.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">No employees found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;
