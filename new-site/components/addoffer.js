import React, { useState } from "react";
import { addOffer, addOfferToShop } from "../src/functions/offers"; // Adjust the path based on your file structure

const AddOffer = ({ shopId, shopName }) => {
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const offer = {
      offerTitle,
      offerDescription,
      expiryDate,
    };

    try {
      // Add offer globally
      const globalResponse = await addOffer(offer,shopId, shopName);

      // Add offer to shop if shopId is provided
      if (shopId) {
        const shopResponse = await addOfferToShop(shopId, offer);
        setMessage(`Offer added globally and to shop ${shopName}.`);
        console.log("Shop Response:", shopResponse);
      } else {
        setMessage("Offer added globally.");
      }

      console.log("Global Response:", globalResponse);
    } catch (error) {
      console.error("Error adding offer:", error);
      setMessage("Failed to add the offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Offer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="offerTitle">Offer Title:</label>
          <input
            type="text"
            id="offerTitle"
            value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="offerDescription">Offer Description:</label>
          <textarea
            id="offerDescription"
            value={offerDescription}
            onChange={(e) => setOfferDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="date"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Offer"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddOffer;
