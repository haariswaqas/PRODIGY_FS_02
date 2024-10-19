import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './navbar/NavBar';
import Login from './login/Login';
import Homepage from './home/Homepage';
import Register from './register/Register';
import EmployeeList from './employees/EmployeeList';
import EmployeeForm from './employees/EmployeeForm';
import EmployeeProfilePage from './employees/EmployeeProfile';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RestrictedRoute } from './route/ProtectedRoute'; // Import the routes

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/register" element={<RestrictedRoute element={<Register />} />} />
            <Route path="/login" element={<RestrictedRoute element={<Login />} />} />

            <Route path="/employees" element={<PrivateRoute element={<EmployeeList />} />} />
            <Route path="/employee/:id" element={<PrivateRoute element={<EmployeeProfilePage />} />} />
            <Route path="/add-employee" element={<PrivateRoute element={<EmployeeForm />} />} />
            <Route path="/edit-employee/:id" element={<PrivateRoute element={<EmployeeForm />} />} />

            <Route path="/" element={<Homepage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
