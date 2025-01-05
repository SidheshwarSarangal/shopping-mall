import React, { useState, useEffect } from "react";
import { addProductToShop } from "../src/functions/product";
import { uploadImage } from "../utils/cloudinary"; // Cloudinary upload function
import { getAllProductCategories } from "../src/functions/productcategory"; // Import your category fetching function
import { addOrUpdateProduct, getProductByName, addProduct } from "../src/functions/product";

const AddProduct = ({ shopId, shopName }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // For file upload
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false); // To indicate upload status
  const [categories, setCategories] = useState([]); // To store categories
  const [selectedCategory, setSelectedCategory] = useState(""); // To store selected category
  const [quantity, setQuantity] = useState(""); // To store the product quantity

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getAllProductCategories(); // Call your function to fetch categories
      if (result.success) {
        setCategories(result.categories); // Set categories to state
      } else {
        setMessage(result.error);
      }
    };
    console.log("shopname parent",shopName);


    fetchCategories();
  }, []); // Empty dependency array to fetch categories once on mount

  const handleUpload = async () => {
    if (!image) {
      setMessage("No image selected.");
      return;
    }

    try {
      setUploading(true);
      const uploadedImageUrl = await uploadImage(image); // Pass the File object
      setImageUrl(uploadedImageUrl);
      setMessage("Image uploaded successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!productName || !price || !imageUrl || !selectedCategory || !quantity) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const productData = {
        name: productName,
        price: parseFloat(price),
        image: imageUrl,
        category: selectedCategory, // Include selected category
        quantity: parseInt(quantity, 10), // Include quantity as a number
      };

      // First, add product to shop (assuming it's not already added)
      const addResult = await addProductToShop(shopId, productData);
      if (addResult.success) {
        setMessage(addResult.success);
      } else {
        setMessage(addResult.error);
        return;
      }

      // Check if the product exists in the database
      const productCheck = await getProductByName(productData.name);
      if (productCheck.products.length > 0) {
        // Product exists, update it
        const updateResult = await addOrUpdateProduct(productData, shopId,shopName);
        if (updateResult.success) {
          console.log(`${productName} updated in shop list.`);
        } else {
          console.error(`Failed to update product: ${productName}`);
        }
      } else {
        // Product doesn't exist, create new one
        const addProductResult = await addProduct(productData);
        if (addProductResult.success) {
          console.log("till here ok");
          console.log(`${productName} added to shop list.`);
          const updateResult = await addOrUpdateProduct(productData, shopId, shopName);
          if (updateResult.success) {
            console.log(`${productName} updated in shop list.`);
            console.log(productData);
          } else {
            console.error(`Failed to update product: ${productName}`);
          }
        } else {
          console.error(`Failed to add product: ${productName}`);
        }
      }
    } catch (e) {
      console.error("Error adding product:", e);
      setMessage("Error adding product.");
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add Product</h1>
      <form onSubmit={handleAddProduct}>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button type="button" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          {message && <p>{message}</p>}
          {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: "100px", marginTop: "10px" }} />}
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
