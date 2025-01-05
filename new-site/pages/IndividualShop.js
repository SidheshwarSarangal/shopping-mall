import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getShopById } from "../src/functions/shop"; // Fetch shop by ID
import "../css/IndividualShopBox.css";
import AddProduct from "../components/addProduct";
import AddOffer from "../components/addoffer";
import { getUserRole } from "../src/functions/user";
import { decreaseProductQuantity } from "../src/functions/shop";
import { addProductToPurchase } from "../src/functions/user";

const ParticularShop = () => {
  const { id } = useParams(); // Extract the shop ID from the URL
  const [shop, setShop] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState(false);
  const [userRole, setUserRole] = useState(""); // State for storing the user role

  const productPopupRef = useRef(null);
  const offerPopupRef = useRef(null);

  // Effect hook to get the user role when component mounts
  useEffect(() => {
    const getRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const roleResponse = await getUserRole(token);
          if (roleResponse.success) {
            setUserRole(roleResponse.role);
          } else {
            console.error("Failed to fetch user role:", roleResponse.error);
          }
        }
      } catch (err) {
        console.error("Error getting role:", err);
      }
    };
    getRole();
  }, []);

  useEffect(() => {
    const fetchShop = async () => {
      const response = await getShopById(id);
      setShop(response.shop || null);
    };

    fetchShop();
  }, [id]);

  const handleOutsideClick = (event) => {
    if (isPopupOpen && productPopupRef.current && !productPopupRef.current.contains(event.target)) {
      setIsPopupOpen(false);
    }
    if (isOfferPopupVisible && offerPopupRef.current && !offerPopupRef.current.contains(event.target)) {
      setIsOfferPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const closeOfferPopup = () => {
    setIsOfferPopupVisible(false);
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const toggleOfferPopup = () => {
    setIsOfferPopupVisible((prev) => !prev);
  };

  const handleBuy = async (productname, image) => {
    try {
      const result = await decreaseProductQuantity(id, productname, -1);

      if (result.success) {
        const token = localStorage.getItem("token");
        const res = await addProductToPurchase(token, productname, id, image);

        if (res.success) {
          alert("Bought successfully");
          window.location.reload();
        } else {
          await decreaseProductQuantity(id, productname, +1);
          alert(res.error || "There was an error in buying.");
        }
      } else if (result.error) {
        alert(result.error || "Failed to decrease product quantity.");
      }
    } catch (err) {
      alert(err.message || "An error occurred while buying the product.");
    }
  };

  if (!shop) {
    return (
      <div>
        <p>Shop details not available.</p>
        <Link to="/shop">&#8592; Back to Shop List</Link>
      </div>
    );
  }

  return (
    <div className="is-particular-shop-page">
      <div className="is-back-button">
        <Link to="/"> Back to Home</Link>
      </div>

      <h1>{shop.name}</h1>
      <p>
        <strong>Owner:</strong> {shop.owner}
      </p>
      Note: The Offer benefits can be claimed on SHOPS


      <div className="is-offers">
        <p>
          <strong>Special Offers:</strong>
        </p>
        {shop.specialOffer && shop.specialOffer.length > 0 ? (
          <ul>
            {shop.specialOffer.map((offer, index) => (
              <li key={index}>
                <div>
                  <strong>Offer Title:</strong> {offer.offerTitle}
                </div>
                <div>
                  <strong>Expiry Date:</strong> {offer.expiryDate}
                </div>
                <div>
                  <strong>Offer Description:</strong> {offer.offerDescription}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No special offers available.</p>
        )}
      </div>

      <div className="is-products">
        <p>
          <strong>Products:</strong>
        </p>
        {shop.products.length > 0 ? (
          <ul>
            {shop.products.map((product, index) => (
              <li key={index}>
                <div>
                  <div>
                    <strong>Product Name:</strong> {product.name}
                  </div>
                  <div>
                    <strong>Price:</strong> {product.price}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {product.quantity}
                  </div>
                  {userRole === "user" && (
                    <button
                      className="is-buy-button"
                      onClick={() => handleBuy(product.name, product.image)}
                    >
                      Buy
                    </button>
                  )}
                </div>
                <img src={product.image} alt={product.name} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No products available.</p>
        )}
      </div>

      {userRole === "admin" && (
        <div>
          <button className="is-plus-button" onClick={togglePopup}>
            +
          </button>
          <button className="is-plus-button-2" onClick={toggleOfferPopup}>
            +Offer
          </button>
        </div>
      )}

      {isPopupOpen && (
        <div className="is-popup-box">
          <div className="is-popup-content" ref={productPopupRef}>
           
            <AddProduct shopId={id} shopName={shop.name} />
          </div>
        </div>
      )}

      {isOfferPopupVisible && (
        <div className="is-popup-box">
          <div className="is-popup-content" ref={offerPopupRef}>
            
            <AddOffer shopId={id} shopName={shop.name} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticularShop;
