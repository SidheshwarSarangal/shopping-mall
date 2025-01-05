import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Logout.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    // Remove the token (adjust based on your storage method)
    localStorage.removeItem("token"); // Example: remove from localStorage
//    sessionStorage.removeItem("token"); // Example: remove from sessionStorage
    // Navigate to Home
    navigate("/");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // Navigate to Home
    navigate("/");
  };

  return (
    <div className="logout-container">
      <div className="logout-message">Do you want to log out?</div>

      <form className="logout-form">
        <button onClick={handleLogout} className="logout-button yes">
          Yes
        </button>
        <button onClick={handleCancel} className="logout-button no">
          No
        </button>
      </form>

      {/* Back to Home Link */}
      <div className="logout-home-link">
        <button className="back-home" onClick={() => navigate("/")}>
          &#8592; Back to Home
        </button>
      </div>
    </div>
  );
};

export default Logout;
