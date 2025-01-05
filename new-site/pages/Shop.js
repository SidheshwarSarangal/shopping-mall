import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllShops, getShopByName } from "../src/functions/shop"; // Import shop functions
import "../css/Shop.css"; // Ensure this path is correct
import CreateShop from "../components/createShopComponent";
import { getUserRole } from "../src/functions/user";

const Shop = () => {
  const [showBox, setShowBox] = useState(false);
  const [shopList, setShopList] = useState([]); // List of shops to display
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filteredShops, setFilteredShops] = useState([]); // Filtered shops after search
  const [isSearching, setIsSearching] = useState(false); // Track if a search is performed
  const boxRef = useRef(null);
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


  const toggleBox = () => {
    setShowBox((prev) => !prev);
  };

  // Fetch all shops when the component mounts
  useEffect(() => {
    const fetchShops = async () => {
      const allShopsResponse = await getAllShops();
      setShopList(allShopsResponse.shops || []);
    };

    fetchShops();
  }, [showBox]);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true); // Indicate that a search is being performed

    if (searchTerm.trim() === "") {
      setFilteredShops([]);
    } else {
      const response = await getShopByName(searchTerm);
      if (response.shops && response.shops.length > 0) {
        setFilteredShops(response.shops);
      } else {
        setFilteredShops([]);
      }
    }
  };

  // Clear search input and show all shops
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredShops([]);
    setIsSearching(false); // Reset the search state to show all shops again
  };

  // Determine which list of shops to display (filtered or all)
  const shopsToDisplay = isSearching ? filteredShops : shopList;

  return (
    <div className="shop-page">
      {/* Back Button */}
      <div className="shop-back-button">
        <Link to="/"> Back to Home</Link>
      </div>

      {/* Search Section */}
      <div className="shop-search-container">
        <form onSubmit={handleSearchSubmit} className="shop-search-form">
          <div className="shop-search-bar">
            <input
              type="text"
              id="shop-lname"
              name="lname"
              className="search-input"
              placeholder="Enter shop name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit" className="shop-search-button">Search</button>
            {searchTerm && (
              <button type="button" className="shop-clear-button" onClick={clearSearch}>
                &#10005;
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of Shops */}
      <div className="shop-list-container">
        <ul className="shop-result-list">
          {shopsToDisplay.length > 0 ? (
            shopsToDisplay.map((shopItem) => (
              <li key={shopItem.id}>
                <Link to={`/particular-shop/${shopItem.id}`} className="shop-link">
                  <div className="shop-result-item">
                    <div className="shop-result-info">
                      <p><strong>Shop Name:   </strong> {shopItem.name}</p>
                      <p><strong>Owner:   </strong> {shopItem.owner}</p>
                    </div>
                    <div className="shop-result-image">
                      
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>{isSearching ? "No shops found." : "No shops available."}</p>
          )}
        </ul>
      </div>

      {/* Plus Button */}
      {userRole === "admin" && (
        <button className="shop-plus-button" onClick={toggleBox}>
          +
        </button>
      )}


      {/* Popup */}
      {showBox && (
        <>
          {/* Overlay */}
          <div className="shop-popup-overlay" onClick={() => setShowBox(false)}></div>
          {/* Popup Content */}
          <div className="shop-popup-box" ref={boxRef}>
            <CreateShop />
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
