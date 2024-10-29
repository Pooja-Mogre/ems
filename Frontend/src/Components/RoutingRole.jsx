import React, { useState } from 'react';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const App = () => {
    const [role, setRole] = useState('');

    const handleLogin = (role) => {
        setRole(role);
    };

    return (
        <div>
            {!role && <Login onLogin={handleLogin} />}
            {role === 'Admin' && <AdminDashboard />}
            {role === 'Employee' && <EmployeeDashboard />}
        </div>
    );
};

export default App;