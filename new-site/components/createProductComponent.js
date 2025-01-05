import React, { useState, useEffect } from "react";
import { addProduct } from "../src/functions/product"; // Function to add product
import { getAllProductCategories } from "../src/functions/productcategory"; // Function to get all product categories
import { uploadImage } from "../utils/cloudinary"; // Cloudinary upload function

const CreateProduct = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        image: "", // To be updated with Cloudinary URL after upload
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Handle image upload to Cloudinary
    const handleUpload = async () => {
        if (!image) {
            setMessage("No image selected.");
            return;
        }

        try {
            setUploading(true);
            const imageUrl = await uploadImage(image); // Pass the File object
            setImageUrl(imageUrl);
            setProduct((prevProduct) => ({ ...prevProduct, image: imageUrl }));
            setMessage("Image uploaded successfully!");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setUploading(false);
        }
    };


    // Fetch product categories
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getAllProductCategories();
            if (response.success) {
                setCategories(response.categories); // Set categories if successful
            } else {
                setMessage(response.error); // Display error message
            }
        };
        fetchCategories();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    };

    // Validate price and submit product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Price validation
        if (isNaN(product.price) || parseFloat(product.price) <= 0) {
            setMessage("Please enter a valid price greater than 0.");
            setLoading(false);
            return;
        }

        // Ensure the image has been uploaded before submitting the product
        if (!product.image) {
            setMessage("Please upload an image.");
            setLoading(false);
            return;
        }

        const response = await addProduct(product);

        setLoading(false);

        if (response.success) {
            setMessage("Product added successfully!");
            setProduct({ name: "", category: "", price: "", image: "" });
        } else {
            setMessage(response.error);
        }
    };

    return (
        <div className="create-product-container">
            <h2>Create a New Product</h2>
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit} className="create-product-form">
                <label>
                    Product Name:
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Category:
                    <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        ) : (
                            <option value="">No categories available</option>
                        )}
                    </select>
                </label>

                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Product Image:
                    <input
                        type="file"
                        onChange={handleImageChange}
                        required
                    />
                </label>
                {image && (
                    <div>
                        <p>Selected image: {image.name}</p>
                        <button type="button" onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload Image"}
                        </button>
                    </div>
                )}

                {imageUrl && <img src={imageUrl} alt="Product Preview" style={{ maxWidth: "200px" }} />}

                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
