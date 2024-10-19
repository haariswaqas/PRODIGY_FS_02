import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmployeeProfilePage = () => {
    const { authTokens, refreshAccessToken } = useAuth();
    const { id } = useParams(); // Get employee ID from the URL
    const navigate = useNavigate(); // Initialize history for navigation

    // State to hold employee data
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employee data based on employeeId
    useEffect(() => {
        const fetchEmployee = async () => {
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
                    setEmployee(data); // Store the employee data in the state
                } else {
                    setError('Failed to fetch employee data');
                }
            } catch (error) {
                console.error('Error fetching employee:', error);
                setError('An error occurred while fetching employee data');
            } finally {
                setLoading(false); // Stop loading once the request is complete
            }
        };

        fetchEmployee();
    }, [id, authTokens, refreshAccessToken]);

    // Navigate to edit page
    const handleEditClick = () => {
        navigate(`/edit-employee/${id}`);
    };

    // Delete employee function
    const deleteEmployee = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this employee?");
        if (confirmed) {
            try {
                await refreshAccessToken(); // Refresh the access token before making the request
                const response = await fetch(`http://127.0.0.1:8000/api/employees/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}` // Pass the token in the Authorization header
                    }
                });

                if (response.ok) {
                    alert('Employee successfully deleted');
                    navigate('/employees'); // Redirect to employee list or another page after deletion
                } else {
                    setError('Failed to delete employee');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                setError('An error occurred while deleting the employee');
            }
        }
    };

    // Render a loading message while fetching data
    if (loading) {
        return <p>Loading...</p>;
    }

    // Render an error message if there was an issue fetching the data
    if (error) {
        return <p>{error}</p>;
    }

    // Render the employee profile information once the data is available
    return (
        <div>
            <section style={{ backgroundColor: '#eee' }}>
                <div className="container py-5">
                    <h1 className="text-center">Employee Profile</h1>
                    {employee ? (
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="card mb-4">
                                    <div className="card-body text-center">
                                        <img
                                            src={employee.profile_pic || 'https://via.placeholder.com/150'}
                                            alt={`${employee.first_name} ${employee.middle_name} ${employee.last_name}`}
                                            className="rounded-circle img-fluid"
                                            style={{ width: '150px' }}
                                        />
                                        <h5 className="my-3">
                                            {`${employee.first_name} ${employee.middle_name} ${employee.last_name}`}
                                        </h5>
                                        <div className="d-flex justify-content-center mb-2">
                                            <button className="btn btn-outline-primary ms-1" onClick={handleEditClick}>
                                                Edit
                                            </button>
                                            <button className="btn btn-outline-danger ms-1" onClick={deleteEmployee}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title">Employee Details</h5>
                                        <div className="mb-3">
                                            <strong>Job Title:</strong> {employee.job_title || 'N/A'}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Email:</strong> {employee.email}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Phone Number:</strong> {employee.phone_number || 'N/A'}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Bio:</strong> {employee.bio || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="col-sm-4">
                                                <p className="mb-0">First Name</p>
                                            </div>
                                            <div className="col-sm-8">
                                                <p className="text-muted mb-0">{employee.first_name}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row mb-3">
                                            <div className="col-sm-4">
                                                <p className="mb-0">Middle Name</p>
                                            </div>
                                            <div className="col-sm-8">
                                                <p className="text-muted mb-0">{employee.middle_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row mb-3">
                                            <div className="col-sm-4">
                                                <p className="mb-0">Last Name</p>
                                            </div>
                                            <div className="col-sm-8">
                                                <p className="text-muted mb-0">{employee.last_name}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row mb-3">
                                            <div className="col-sm-4">
                                                <p className="mb-0">Gender</p>
                                            </div>
                                            <div className="col-sm-8">
                                                <p className="text-muted mb-0">{employee.gender}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row mb-3">
                                            <div className="col-sm-4">
                                                <p className="mb-0">Date of Birth</p>
                                            </div>
                                            <div className="col-sm-8">
                                                <p className="text-muted mb-0">{employee.date_of_birth || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row mb-3">
                                            <div className="col-sm-4">
                                                <p className="mb-0">Age</p>
                                            </div>
                                            <div className="col-sm-8">
                                                <p className="text-muted mb-0">{employee.age || 'N/A'}</p>
                                            </div>
                                        </div>
                                      
                                        
                                        
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No employee data found.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EmployeeProfilePage;
