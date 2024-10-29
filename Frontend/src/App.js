import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import AdminDashboard from './Components/AdminDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard';
import './App.css';

const App = () => {
    const [user, setUser] = useState({ role: null, id: null, email: null }); // Track user role, ID, and email

    const handleLogin = (userData) => {
        console.log('User data on login:', userData); // Debug log
        setUser(userData); // Set user data
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            !user.role ? (
                                <Login onLogin={handleLogin} />
                            ) : (
                                <Navigate to={`/${user.role.toLowerCase()}-dashboard?email=${user.email}`} />
                            )
                        } 
                    />

                    {/* Admin dashboard route */}
                    {user.role === 'Admin' && (
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    )}

                    {/* Employee dashboard route */}
                    {user.role === 'Employee' && (
                        <Route path="/employee-dashboard" element={<EmployeeDashboard userId={user.id} />} />
                    )}

                    {/* Redirect to home for unmatched routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
