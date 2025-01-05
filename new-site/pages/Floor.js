import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getShopByFloor } from "../src/functions/shop"; // Import the function to fetch shops by floor
import "../css/Floor.css";

const Floor = () => {
  const [selectedFloor, setSelectedFloor] = useState("Ground");
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  // Fetch shops whenever the selected floor changes
  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      setError("");
      const result = await getShopByFloor(selectedFloor);

      if (result.error) {
        setError(result.error);
        setShops([]);
      } else {
        setShops(result.shops || []);
      }
      setIsLoading(false);
    };

    fetchShops();
  }, [selectedFloor]);

  return (
    <div className="floor-page">
      {/* Back Button */}
      <div className="floor-back-button">
        <Link to="/">Back to Home</Link>
      </div>

      {/* Radio Buttons */}
      <form className="floor-selection">
        <label>
          <input
            type="radio"
            id="floor-Ground"
            name="floor"
            value="Ground"
            checked={selectedFloor === "Ground"}
            onChange={handleFloorChange}
          />
          Ground
        </label>
        <label>
          <input
            type="radio"
            id="floor-First"
            name="floor"
            value="First"
            checked={selectedFloor === "First"}
            onChange={handleFloorChange}
          />
          First
        </label>
        <label>
          <input
            type="radio"
            id="floor-Second"
            name="floor"
            value="Second"
            checked={selectedFloor === "Second"}
            onChange={handleFloorChange}
          />
          Second
        </label>
      </form>

      {/* List of Items */}
      <div className="floor-shop-list">
        {isLoading && <p>Loading shops...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && shops.length === 0 && <p>No shops found on this floor.</p>}

        {!isLoading &&
          shops.map((shop) => (
            <Link to={`/particular-shop/${shop.id}`} key={shop.id}>
              <div className="floor-shop-card">
                <div className="floor-shop-card-header">
                  <h3>{shop.name}</h3>
                </div>
                <div className="floor-shop-card-body">
                  <p>
                    <strong>Owner:</strong> {shop.owner}
                  </p>
                  <p>
                    <strong>Floor:</strong> {selectedFloor}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Floor;
