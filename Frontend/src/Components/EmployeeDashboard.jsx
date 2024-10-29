import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './EmployeeDashbord.css';


const EmployeeDashboard = () => {
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();

    // Extract email from query parameters
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    // These should be replaced with secure/authenticated credentials
    const username = "rahul@gmail.com"; // Use the email you logged in with
    const password = "Rajesh11"; // Use the corresponding password

    useEffect(() => {
        if (!email) {
            setError('No email found in query parameters.');
            return;
        }

        const fetchEmployeeDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/employees/by-email/${email}`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${username}:${password}`) // Basic authentication
                    }
                });
                console.log('Employee details:', response.data);
                setEmployee(response.data);
            } catch (err) {
                console.error('Failed to fetch employee details:', err);
                if (err.response) {
                    // Server responded with an error
                    setError(`Failed to fetch employee details: ${err.response.data.message || err.response.statusText}`);
                } else if (err.request) {
                    // Request was made, but no response was received
                    setError('No response received from the server.');
                } else {
                    // Something happened while setting up the request
                    setError(`Error: ${err.message}`);
                }
            }
        };

        fetchEmployeeDetails();
    }, [email]);

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Display error message in red
    }

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <p>Name: {employee.name}</p>
            <p>Email: {employee.email}</p>
            {/* Render other employee details */}
        </div>
    );
};

export default EmployeeDashboard;
