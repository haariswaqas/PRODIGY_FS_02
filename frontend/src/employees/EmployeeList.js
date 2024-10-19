import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const EmployeeList = () => {
    const { authTokens } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showActions, setShowActions] = useState(false);
    const [groupByJobTitle, setGroupByJobTitle] = useState(false);
    const [sortOrder, setSortOrder] = useState(null); // Add sortOrder state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/employees/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data);
                } else {
                    throw new Error('Failed to fetch employees');
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authTokens) {
            fetchEmployees();
        }
    }, [authTokens]);

    const deleteEmployee = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this employee?");
        if (confirmed) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/employees/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });

                if (response.ok) {
                    alert('Employee successfully deleted');
                    setEmployees(employees.filter(employee => employee.id !== id));
                } else {
                    throw new Error('Failed to delete employee');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const groupByJobTitleFunc = (employees) => {
        return employees.reduce((acc, employee) => {
            const jobTitle = employee.job_title || 'Unspecified';
            if (!acc[jobTitle]) {
                acc[jobTitle] = [];
            }
            acc[jobTitle].push(employee);
            return acc;
        }, {});
    };

    // Sorting employees by salary
    const sortEmployeesBySalary = (order) => {
        const sortedEmployees = [...employees].sort((a, b) => {
            const salaryA = a.salary || 0;
            const salaryB = b.salary || 0;
            return order === 'asc' ? salaryA - salaryB : salaryB - salaryA;
        });
        setEmployees(sortedEmployees);
        setSortOrder(order);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const groupedEmployees = groupByJobTitleFunc(employees);

    return (
        <div className="container mt-4">
            <h2>ALL EMPLOYEES</h2>

            {/* Toggle Button for Grouping */}
            <button 
                className="btn btn-info mb-3 me-2"
                onClick={() => setGroupByJobTitle(!groupByJobTitle)}
            >
                {groupByJobTitle ? 'View All Employees' : 'Group By Job Title'}
            </button>

            {/* Toggle Button for Actions Visibility */}
            <button 
                className="btn btn-warning mb-3 me-2"
                onClick={() => setShowActions(!showActions)}
            >
                {showActions ? 'Done' : 'Manage Employees'}
            </button>

            {/* Sort by Salary Button */}
            <button
                className="btn btn-secondary mb-3"
                onClick={() => sortEmployeesBySalary(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
                {sortOrder === 'asc' ? 'Sort by Salary (High to Low)' : 'Sort by Salary (Low to High)'}
            </button>

            {groupByJobTitle ? (
                Object.keys(groupedEmployees).map(jobTitle => (
                    <div key={jobTitle} className="mb-4">
                        <h3>{jobTitle}</h3>
                        <table className="table table-dark">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Age</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Salary</th>
                                    {showActions && <th scope="col">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {groupedEmployees[jobTitle].map((employee, index) => (
                                    <tr key={employee.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            <Link to={`/employee/${employee.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {employee.first_name} {employee.last_name}
                                            </Link>
                                        </td>
                                        <td>{employee.age || 'N/A'}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.phone_number || 'N/A'}</td>
                                        <td>{employee.salary ? `$${employee.salary}` : 'N/A'}</td>
                                        {showActions && (
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => navigate(`/edit-employee/${employee.id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteEmployee(employee.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <table className="table table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Age</th>
                            <th scope="col">Job Title</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Salary</th>
                            {showActions && <th scope="col">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee.id}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    <Link to={`/employee/${employee.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {employee.first_name} {employee.last_name}
                                    </Link>
                                </td>
                                <td>{employee.age || 'N/A'}</td>
                                <td>{employee.job_title || 'N/A'}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone_number || 'N/A'}</td>
                                <td>{employee.salary ? `$${employee.salary}` : 'N/A'}</td>
                                {showActions && (
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => navigate(`/edit-employee/${employee.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteEmployee(employee.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeeList;
