import React, { useState, useEffect } from "react";
import { addProductCategory, getAllProductCategories } from "../src/functions/productcategory"; // Functions to add and get categories


const CreateProductCategory = () => {
  const [newCategory, setNewCategory] = useState(""); // For handling the new category input
  const [categories, setCategories] = useState([]); // List of current categories
  const [message, setMessage] = useState(""); // Message to display feedback
  const [loading, setLoading] = useState(false); // To handle loading state

  // Fetch existing categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllProductCategories();
      if (response.success) {
        setCategories(response.categories); // Set categories from response
      } else {
        setMessage(response.error); // Show error message if categories can't be fetched
      }
    };
    fetchCategories();
  }, []);

  // Handle the change in new category input
  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Handle adding a new product category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setMessage("Category name is required.");
      return;
    }

    setLoading(true); // Set loading to true while adding category

    const response = await addProductCategory(newCategory);
    setLoading(false); // Set loading back to false

    if (response.success) {
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: response.id, name: newCategory }, // Add new category to state
      ]);
      setNewCategory(""); // Clear the input field
      setMessage(response.success); // Show success message
    } else {
      setMessage(response.error); // Show error message if category addition fails
    }
  };

  return (
    <div className="create-category-container">
      <h2>Add New Product Category</h2>
      {message && <p className="message">{message}</p>}

      {/* Form to add new category */}
      <form onSubmit={handleCategorySubmit} className="create-category-form">
        <label>
          New Category Name:
          <input
            type="text"
            value={newCategory}
            onChange={handleCategoryChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Add Category"}
        </button>
      </form>

      {/* Displaying existing categories */}
     
    </div>
  );
};

export default CreateProductCategory;
