import React, { useState, useEffect } from "react";
import { addShopCategory, getAllShopCategories, getCategoryByName } from "../src/functions/shopcategory";
//import "../css/AddShopCategory.css";

const AddShopCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch all categories on component mount
    const fetchCategories = async () => {
      const response = await getAllShopCategories();
      if (response.success) {
        setCategories(response.categories);
      } else {
        setError(response.error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    // Check if category already exists
    const existingCategoryResponse = await getCategoryByName(categoryName);
    if (existingCategoryResponse.success && existingCategoryResponse.categories.length > 0) {
      setError("Category already exists.");
      return;
    }

    // Add new category
    const response = await addShopCategory(categoryName);
    if (response.success) {
      setSuccess(response.success);
      setCategories([...categories, { id: response.id, name: categoryName }]);
      setCategoryName("");
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="asc-add-shop-category">
      <h2>Add Shop Category</h2>
      {/* Form to Add Category */}
      <form onSubmit={handleAddCategory} className="aasc-dd-category-form">
        <label htmlFor="categoryName">Category Name:</label>
        <input
          type="text"
          id="asc-categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
        />
        <button type="submit">Add Category</button>
      </form>

      {/* Display Success or Error Messages */}
      {success && <p className="asc-success-message">{success}</p>}
      {error && <p className="asc-error-message">{error}</p>}

      {/* List of Categories */}
      
    </div>
  );
};

export default AddShopCategory;
