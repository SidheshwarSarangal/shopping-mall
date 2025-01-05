import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirection
import { addUser } from '../src/functions/user'; // Import the addUser function
import "../css/AccountCreation.css";

const AccountCreation = () => {
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [fullName, setFullName] = useState(""); // Store full name
  const [email, setEmail] = useState(""); // Store email
  const [password, setPassword] = useState(""); // Store password
  const [confirmPassword, setConfirmPassword] = useState(""); // Store confirm password
  const [error, setError] = useState(""); // Store error messages

  const navigate = useNavigate(); // Initialize navigation to redirect after success

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!fullName || !email || !password) {
      setError("Please fill in all the fields.");
      return;
    }

    // Prepare user data object
    const user = {
      name: fullName,
      email: email,
      password: password,
      role: role, // Add role to the user data
    };

    try {
      // Call addUser function to add data to Firestore
      await addUser(user);

      // Alert on successful account creation
      alert("Account created successfully!");

      // Redirect to login page
      navigate("/login");
    } catch (e) {
      setError("Error creating account, please try again.");
    }
  };

  return (
    <div id="account-creation-page">
      <div className="sidebar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </div>

      <div className="account-container">
        <h1 id="account-creation-heading">Account Creation</h1>
        <p id="account-creation-description">
          Create an account to access all the features of the Gram Panchayat portal.
        </p>
        <div className="role-selection">
          <h3>Select Role</h3>
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
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <form className="account-form" onSubmit={handleSubmit}>
          <label className="form-label" id="label-full-name">
            Full Name:
            <input
              type="text"
              name="fullName"
              className="form-input"
              id="input-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <label className="form-label" id="label-email">
            Email Address:
            <input
              type="email"
              name="email"
              className="form-input"
              id="input-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <label className="form-label" id="label-password">
            Password:
            <input
              type="password"
              name="password"
              className="form-input"
              id="input-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <label className="form-label" id="label-confirm-password">
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              id="input-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <button type="submit" className="submit-button" id="create-account-button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountCreation;
