import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Homepage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container bg-dark text-white p-5 rounded" style={{ width: '70%' }}>
        <h1 className="mb-4 text-center">Welcome to the Employee Management System</h1>

        {/* Description shown only when the user is not logged in */}
        {!user && (
          <div className="mb-4" style={{ fontSize: '1.2rem' }}>
            <p className="text-center mb-4">This platform allows you to efficiently manage your organization's employee data:</p>
            <ul className="list-unstyled">
              <li>🌟 Add new employees to the system.</li>
              <li>📊 View existing employee profiles.</li>
              <li>✏️ Update employee information as needed.</li>
              <li>🔍 Easily search for specific employees.</li>
              <li>🔐 Secure access with user authentication.</li>
            </ul>
          </div>
        )}

        {user ? (
          <div>
            <div className="text-center">
              <p className="lead mb-4">Hello, {user.first_name} {user.last_name}</p>

              <div className="btn-group" role="group" aria-label="Employee Actions">
                <Link to="/add-employee" className="btn btn-primary btn-lg me-3">
                  Add Employee
                </Link>
                <Link to="/employees" className="btn btn-success btn-lg">
                  View Employees
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="lead">Please log in to manage employees.</p>
            <div className="btn-group" role="group" aria-label="Auth Actions">
              <Link to="/login" className="btn btn-success btn-lg me-3">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-lg">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
