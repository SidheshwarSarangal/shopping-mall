import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOffers } from "../src/functions/offers"; // Import the fetch function
import "../css/Offer.css";
const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch offers on component mount
  useEffect(() => {
    const fetchOffers = async () => {
      const result = await getAllOffers();
      if (result.success) {
        setOffers(result.offers);
        console.log("offers", result.offers);
      } else {
        setMessage(result.error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="offer-page">
      {/* Back Button */}
      <div className="0ffer-back-button">
        <Link to="/">Back to Home</Link>
      </div>

      {/* Offers Section */}
      <div className="offers-container">
        <h2>Available Offers</h2>
        <p className="offer-subtitle">Explore the latest offers and deals available at the Supermall.</p>

        {/* Offer List */}
        {message && <p className="offer-error-message">{message}</p>}
        <ul className="offer-offer-list">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <Link to={`/particular-shop/${offer.shopId}`}>
                
                <li className="offer-item" key={offer.id}>
                  <div className="offer-content">
                    <div className="offer-info">
                      <h3>{offer.offerTitle}</h3>
                      <p>
                        <strong>Description:</strong> {offer.offerDescription}
                      </p>
                      <p>
                        <strong>Expiry Date:</strong> {new Date(offer.expiryDate).toLocaleDateString()}
                      </p>
                      {/* <Link to={`/offer-manage-box/${offer.id}`} className="offer-manage-link">
                      Manage Offer
                    </Link>*/}
                    </div>
                  </div>
                </li>

              </Link>

            ))
          ) : (
            <p>No offers available at the moment.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Offer;
