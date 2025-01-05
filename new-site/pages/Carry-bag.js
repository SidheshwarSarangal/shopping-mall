import React, { useEffect, useState } from "react";
import { getUserData } from "../src/functions/user"; // Import the getUserData function
import { Link } from "react-router-dom";
import "../css/Carry-bag.css"; // Assuming you have a CSS file for styling
import { removePurchase } from "../src/functions/user";
import { decreaseProductQuantity } from "../src/functions/shop";

const UserProfile = () => {
    const [userData, setUserData] = useState(null); // Store user data
    const [error, setError] = useState(""); // Store any error messages
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const token = localStorage.getItem("token"); // Get token from local storage

        const fetchUserData = async () => {
            if (!token) {
                setError("No token found. Please log in.");
                setLoading(false);
                return;
            }

            const result = await getUserData(token); // Call the getUserData function
            console.log(result);

            if (result.error) {
                setError(result.error);
            } else {
                setUserData(result.userData); // Set the user data if successful
            }
            setLoading(false); // Stop loading once data is fetched
        };

        fetchUserData();
    }, []);

    const handlremove = async (timestamp, name, shopId) => {
        try {
            const token = localStorage.getItem("token"); // Get token from local storage
            const result = await removePurchase(token, timestamp)
            if (result.success) {
                const res = await decreaseProductQuantity(shopId, name, +1);
                if (res.success) {
                    alert("Removed Successfully");
                    window.location.reload();

                }
                else {
                    alert("Inner not removed")
                    window.location.reload();

                }

            }

        }
        catch (error) {
            alert(error);
        }

    }

    if (loading) {
        return <p>Loading...</p>; // Display loading message
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>; // Display error message
    }

    if (!userData) {
        return <p>No user data available.</p>; // Display message if no user data
    }

    return (
        <div className="cb-user-profile">
            <div className="0ffer-back-button">
                <Link to="/">Back to Home</Link>
            </div>
            <h2>User Profile</h2>
            <div className="cb-user-info">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
            </div>

            {/* Purchases List */}
            <div className="cb-user-purchases">
                <h3>Your Purchases</h3>
                {userData.purchase && userData.purchase.length > 0 ? (
                    <ul>
                        {userData.purchase.map((purchase, index) => (
                            <li key={index} className="cb-purchase-item">
                                <div className="cb-purchase-details">
                                    <Link to={`/particular-shop/${purchase.shopId}`}>
                                        <p><strong>Name:</strong> {purchase.name} <br/> CLICK TO GO TO THE SHOP
                                        </p>
                                    </Link>
                                    <div className="cb-remove">
                                        <button onClick={() => handlremove(purchase.timestamp, purchase.name, purchase.shopId)}> Remove Item</button>
                                    </div>
                                </div>
                                <img src={purchase.image} alt={purchase.name} className="cb-purchase-image" />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No purchases found.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
