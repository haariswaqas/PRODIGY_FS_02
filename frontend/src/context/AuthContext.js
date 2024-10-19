import React, { createContext, useState, useEffect, useContext } from "react";
import {jwtDecode }from "jwt-decode"; // Fixed the import of jwtDecode
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// Export context
export default AuthContext;

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);

// Define AuthProvider component
export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        return localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;
    });

    const [user, setUser] = useState(() => {
        return authTokens ? jwtDecode(authTokens.access) : null;
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userLogin = async (email, password) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
                navigate("/");
            } else {
                alert("Something went wrong: " + response.status);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const userRegistration = async (email, username, first_name, last_name, password, password2) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    first_name,
                    last_name,
                    password,
                    password2,
                }),
            });

            if (response.status === 201) {
                navigate("/login");
            } else {
                alert("Something went wrong: " + response.status);
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const userLogout = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
    };

    const refreshAccessToken = async () => {
        try {
            if (authTokens && authTokens.access) {
                const { exp } = jwtDecode(authTokens.access);
                const currentTime = Date.now() / 1000;

                if (exp < currentTime) {
                    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refresh: authTokens.refresh }),
                    });

                    if (response.status === 200) {
                        const data = await response.json();
                        setAuthTokens(data);
                        localStorage.setItem("authTokens", JSON.stringify(data));
                    } else {
                        userLogout();
                    }
                }
            }
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            userLogout();
        }
    };

    useEffect(() => {
        if (authTokens && authTokens.access) {
            const { exp } = jwtDecode(authTokens.access);
            const currentTime = Date.now() / 1000;

            if (exp < currentTime) {
                refreshAccessToken();
            }
        }
    }, [authTokens]);

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={{ authTokens, user, loading, userRegistration, userLogin, refreshAccessToken, userLogout }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
