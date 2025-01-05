import React, { useState, useEffect } from "react";
import { addShop } from "../src/functions/shop"; // Assuming this path is correct
import { getAllShopCategories } from "../src/functions/shopcategory"; // Assuming this path is correct

const CreateShop = () => {
    const [shop, setShop] = useState({
        name: "",
        category: "",
        floor: "",
        owner: "",
        image: "", // Will automatically be updated after Cloudinary upload
        specialOffer: [],
    });

    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getAllShopCategories();
            if (response.success) {
                setCategories(response.categories);
            } else {
                setMessage(response.error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShop((prevShop) => ({ ...prevShop, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
            formData.append("cloud_name", "dujdyhai7"); // Replace with your Cloudinary cloud name

            try {
                const res = await fetch(
                    "https://api.cloudinary.com/v1_1/dujdyhai7/image/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const data = await res.json();
                if (data.secure_url) {
                    setShop((prevShop) => ({ ...prevShop, image: data.secure_url })); // Automatically update image URL
                    setMessage("Image uploaded successfully!");
                } else {
                    setMessage("Failed to upload image. Please try again.");
                }
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                setMessage("Error uploading image. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const response = await addShop(shop);

        setLoading(false);

        if (response.success) {
            setMessage("Shop added successfully!");
            setShop({
                name: "",
                category: "",
                floor: "",
                owner: "",
                image: "",
                specialOffer: [],
            });
        } else {
            setMessage(response.error);
        }
    };

    return (
        <div className="create-shop-container">
            <h2>Create a New Shop</h2>
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit} className="create-shop-form">
                <label>
                    Shop Name:
                    <input
                        type="text"
                        name="name"
                        value={shop.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Category:
                    <select
                        name="category"
                        value={shop.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Floor:
                    <select
                        name="floor"
                        value={shop.floor}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Floor</option>
                        <option value="Ground">Ground</option>
                        <option value="First">First</option>
                        <option value="Second">Second</option>
                    </select>
                </label>

                <label>
                    Owner Name:
                    <input
                        type="text"
                        name="owner"
                        value={shop.owner}
                        onChange={handleChange}
                        required
                    />
                </label>


                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Add Shop"}
                </button>
            </form>
        </div>
    );
};

export default CreateShop;
