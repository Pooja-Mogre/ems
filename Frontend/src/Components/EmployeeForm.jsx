import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onSave }) => {
    const [formData, setFormData] = useState({ ...employee });

    useEffect(() => {
        setFormData({ ...employee });
    }, [employee]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Employee Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Manager</label>
                <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default EmployeeForm
