import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import { getUserByIdAndRole } from "../src/functions/user"; // Import the getUserByIdAndRole function

const Login = () => {
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [email, setemail] = useState(""); // Store user ID (email in this case)
  const [password, setPassword] = useState(""); // Store password
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [secret, setSecretKey] = useState("");
  const navigate = useNavigate(); // Navigation for redirection

  const fetchSecretData = () => {
    const secretKey = "grampanchayat1234";
    if (secretKey) {
      setSecretKey(secretKey);
      console.log("Using secret key:", secretKey);
    } else {
      console.error("Secret key is not defined");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    fetchSecretData();
    const secret = "grampanchayat1234";
    console.log("frontend", secret);

    // Validate input fields
    if (!email || !password) {
      setErrorMessage("Please fill in all the fields.");
      alert("Please fill in all the fields."); // Alert for empty fields
      return;
    }

    try {
      // Call the backend function
      const response = await getUserByIdAndRole(email, role, password);

      if (response.error) {
        setErrorMessage(response.error); // Display error message
        setSuccessMessage("");
        alert(`Login failed: ${response.error}`); // Alert for login failure
      } else {
        setSuccessMessage("Login successful!");
        setErrorMessage("");
        alert("Login successful!"); // Alert for successful login
        // Save the token in localStorage
        localStorage.setItem("token", response.token);
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login.");
      alert("An error occurred during login."); // Alert for error during login
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className="login-page">
      {/* Back Button */}
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
        </ul>
      </div>

      {/* Login Container */}
      <div className="login-container">
        <h2>Login</h2>

        {/* Role selection form */}
        <form className="role-selection">
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={handleRoleChange}
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={handleRoleChange}
              />
              User
            </label>
          </div>
        </form>

        {/* Login credentials form */}
        <form className="login-form" onSubmit={handleLogin}>
          <label className="form-label" id="label-email">
            Email Address:
            <br />
            <input
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </label>
          <br />
          <label className="form-label" id="label-password">
            Password:
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit" className="submit-button" id="login-button">
            Log In
          </button>
        </form>

        {/* Link for new users */}
        <div className="new-user-link">
          New User? <Link to="/account-creation">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
