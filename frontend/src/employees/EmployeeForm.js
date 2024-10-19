import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import Link for navigation

const EmployeeForm = () => {
    const { authTokens, refreshAccessToken } = useAuth(); // Destructure the values from the AuthContext
    const { id } = useParams(); // Get employee ID from the route if editing
    const navigate = useNavigate();
    // State variables to hold form data
    const [employeeData, setEmployeeData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: 'Male', // Default to Male
        date_of_birth: '',
        job_title: '',
        bio: '',
        email: 'employee@gmail.com', // Default value
        phone_number: ''
    });

    // Fetch employee data if editing an existing employee
    useEffect(() => {
        if (id) {
            const fetchEmployeeData = async () => {
                try {
                    await refreshAccessToken();
                    const response = await fetch(`http://127.0.0.1:8000/api/employees/${id}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authTokens.access}` // Pass the token in the Authorization header
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // Populate the form with the employee's data
                        setEmployeeData({
                            first_name: data.first_name,
                            middle_name: data.middle_name || '', // Use empty string if null
                            last_name: data.last_name,
                            gender: data.gender,
                            date_of_birth: data.date_of_birth || '', // Use empty string if null
                            job_title: data.job_title || '', // Use empty string if null
                            bio: data.bio || '', // Use empty string if null
                            email: data.email,
                            phone_number: data.phone_number || '' // Use empty string if null
                        });
                    }
                } catch (error) {
                    console.error('Error fetching employee data:', error);
                }
            };

            fetchEmployeeData();
        }
    }, [id, authTokens, refreshAccessToken]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submission (create or update employee)
    const createOrUpdateEmployee = async (e) => {
        e.preventDefault();

        // Determine if we're creating a new employee or updating an existing one
        const url = id
            ? `http://127.0.0.1:8000/api/employees/${id}/`
            : 'http://127.0.0.1:8000/api/employees/';

        const method = id ? 'PUT' : 'POST'; // Use POST for creation, PUT for updates

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}` // Pass the token in the Authorization header
                },
                body: JSON.stringify(employeeData)
            });

            if (response.ok) {
                const message = id ? 'Employee updated successfully' : 'Employee added successfully';
                alert(message);
                // Clear the form after successful submission or update
                setEmployeeData({
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    gender: 'Male',
                    date_of_birth: '',
                    job_title: '',
                    bio: '',
                    email: 'employee@gmail.com',
                    phone_number: ''
                });
                id ? navigate(`/employees/${id}`) : navigate('/employees');
            } else {
                const data = await response.json();
                alert(`Failed to ${id ? 'update' : 'add'} employee: ${data.detail}`);
            }
        } catch (error) {
            console.error(`Error ${id ? 'updating' : 'adding'} employee:`, error);
            alert(`An error occurred while ${id ? 'updating' : 'adding'} the employee`);
        }
    };

    // Render the form
    return (
        <form className="employee-form" onSubmit={createOrUpdateEmployee}>
            <div className="container mt-4 p-4" style={{ backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
                <h3 className="text-center" style={{ color: '#0c5460' }}>{id ? `Edit Employee Details` : 'Add Employee'}</h3>
                <br></br>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                name="first_name"
                                className="form-control mb-3"
                                value={employeeData.first_name}
                                onChange={handleChange}
                                required
                                placeholder="First Name"
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="middle_name"
                                className="form-control mb-3"
                                value={employeeData.middle_name}
                                onChange={handleChange}
                                placeholder="Middle Name (Optional)"
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="last_name"
                                className="form-control mb-3"
                                value={employeeData.last_name}
                                onChange={handleChange}
                                required
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <select
                                name="gender"
                                className="form-control mb-3"
                                value={employeeData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <input
                                type="date"
                                name="date_of_birth"
                                className="form-control mb-3"
                                value={employeeData.date_of_birth}
                                onChange={handleChange}
                                required
                                placeholder="Date of Birth"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                name="job_title"
                                className="form-control mb-3"
                                value={employeeData.job_title}
                                onChange={handleChange}
                                required
                                placeholder="Job Title"
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="bio"
                                className="form-control mb-3"
                                value={employeeData.bio}
                                onChange={handleChange}
                                placeholder="Bio"
                            ></textarea>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                name="phone_number"
                                className="form-control mb-3"
                                value={employeeData.phone_number}
                                onChange={handleChange}
                                required
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary">
                        {id ? `Save Details` : 'Add Employee'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EmployeeForm;
