import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { getUserRole } from "../src/functions/user";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCategoryDescription, setShowCategoryDescription] = useState(false);
  const [showShopsDescription, setShowShopsDescription] = useState(false);
  const [showOfferDescription, setShowOfferDescription] = useState(false);
  const [showFloorDescription, setShowFloorDescription] = useState(false);
  const [userRole, setUserRole] = useState(""); // State for storing the user role

  // Effect hook to get the user role when component mounts
  useEffect(() => {
    const getRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Await the result of getUserRole to get the user role
          const roleResponse = await getUserRole(token);
          console.log("Role response:", roleResponse);
          if (roleResponse.success) {
            setUserRole(roleResponse.role); // Set the role in state
          } else {
            console.error("Failed to fetch user role:", roleResponse.error);
          }
        }
      } catch (err) {
        console.error("Error getting role:", err);
      }
    };
    getRole(); // Call the function to get the role when the component mounts
  }, []); // Empty dependency array to run only once on component mount

  // Effect hook to check if the user is logged in based on token presence
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set login status based on token presence
  }, []); // Empty dependency array to run once on component mount

  // Toggle description visibility for different sections
  const toggleCategoryDescription = () => {
    setShowCategoryDescription((prev) => !prev);
  };

  const toggleShopsDescription = () => {
    setShowShopsDescription((prev) => !prev);
  };

  const toggleOfferDescription = () => {
    setShowOfferDescription((prev) => !prev);
  };

  const toggleFloorDescription = () => {
    setShowFloorDescription((prev) => !prev);
  };

  return (
    <div className="home-body">
      {/* Top Bar */}
      <div className="home-top-bar">
        <div className="home-top-bar-content">
          <li className="home-a">
            <Link to="/category-or-product">Category</Link>
          </li>
          <li className="home-a">
            <Link to="/floor">Floor</Link>
          </li>
          <li className="home-a">
            <Link to="/offer">Offers</Link>
          </li>
          <li className="home-a">
            <Link to="/shop">Shops</Link>
          </li>
          <li className="home-a">
            <Link to="/product">Products</Link>
          </li>
          {userRole === "user" && (
            <li className="home-a">
              <Link to='/carry-bag'>Carry Bag</Link>
            </li>
          )}
          {isLoggedIn ? (
            <>
              <li className="home-a">
                <Link to="/logout">Log Out</Link>
              </li>
            </>
          ) : (
            <li className="home-a">
              <Link to="/login">Log In</Link>
            </li>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="home-align">
        <div className="home-about">
          <div className="home-about-text">
            <h2>About</h2>
            <p>
              Are you tired of roaming at different locations to get different products and want to just get all at a single place?
              Then try our SHOPPING MALL application.
            </p>
          </div>
          <img
            src="https://www.worldatlas.com/r/w1200-q80/upload/76/74/29/shutterstock-230466028.jpg"
            alt="Gram Panchayat pic"
            className="home-about-img"
          />
        </div>

        <div className="home-sections">
          <div className="home-section home-left">
            <div className="home-section-info">
              <h3>Category</h3>
              <p>We have distinguished the shops and products according to different categories.</p>
              <button className="home-info-btn" onClick={toggleCategoryDescription}>
                {showCategoryDescription ? "Hide Description" : "Show Description"}
              </button>
              {showCategoryDescription && (
                <div className="home-section-description">
                  The consumer can go to CATEGORY WISE to find the products and shops based on their categories.
                </div>
              )}
            </div>
            <img
              src="https://cbk.bschool.cuhk.edu.hk/wp-content/uploads/shutterstock_1723731022.jpg"
              alt="Category Image"
              className="home-section-img"
            />
          </div>

          <div className="home-section home-right">
            <div className="home-section-info">
              <h3>Shops</h3>
              <p>The consumer can search shops and find all the products of it.</p>
              <button className="home-info-btn" onClick={toggleShopsDescription}>
                {showShopsDescription ? "Hide Description" : "Show Description"}
              </button>
              {showShopsDescription && (
                <div className="home-section-description">
                  The consumer can search shops by name. He/She can get into that and look at the different products available.
                </div>
              )}
            </div>
            <img
              src="https://a.cdn-hotels.com/gdcs/production84/d1205/d3d70d60-3c22-4e3c-bb3d-6435950e2f8a.jpg"
              alt="Shops Image"
              className="home-section-img"
            />
          </div>

          <div className="home-section home-left">
            <div className="home-section-info">
              <h3>Offer</h3>
              <p>The different Offers available</p>
              <button className="home-info-btn" onClick={toggleOfferDescription}>
                {showOfferDescription ? "Hide Description" : "Show Description"}
              </button>
              {showOfferDescription && (
                <div className="home-section-description">
                  The OFFERS show the different offers available. Individual shop also shows the offers given by it.
                </div>
              )}
            </div>
            <img
              src="https://imagevars.gulfnews.com/2017/7/9/1_16a0841780d.2055247_2168390477_16a0841780d_large.jpg"
              alt="Offer Image"
              className="home-section-img"
            />
          </div>

          <div className="home-section home-right">
            <div className="home-section-info">
              <h3>Floor</h3>
              <p>The consumer can look for the different shops floor wise</p>
              <button className="home-info-btn" onClick={toggleFloorDescription}>
                {showFloorDescription ? "Hide Description" : "Show Description"}
              </button>
              {showFloorDescription && (
                <div className="home-section-description">
                  In FLOORS you can find the shops based on their floor in which they are located.
                </div>
              )}
            </div>
            <img
              src="https://propertymanagerinsider.com/wp-content/uploads/2021/02/Busy-Shopping-Mall-With-Multiple-Escalators-And-Floors-1536x1024.jpg"
              alt="Floor Image"
              className="home-section-img"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <p>Developer of this Application: Sidheshwar</p>
        <p>Details - Web application for managing supermall operations.</p>
      </div>
    </div>
  );
};

export default Home;
