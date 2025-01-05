import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddProductCategory from "../components/createProductCategory";
import "../css/CategoryOrProducts.css";
import AddShopCategory from "../components/createshopCategory";
import { getAllProductCategories } from "../src/functions/productcategory";
import { getAllShopCategories } from "../src/functions/shopcategory";
import { getProductsByCategory } from "../src/functions/product";
import { getShopByCategory } from "../src/functions/shop";
import { getUserRole } from "../src/functions/user";



const CategoryOrProduct = () => {
  const [viewOption, setViewOption] = useState("Category");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Keep track of selected category
  const [items, setItems] = useState([]); // To store products or shops
  const [message, setMessage] = useState(""); // Success or error message
  const [userRole, setUserRole] = useState(""); // State for storing the user role

  // Effect hook to get the user role when component mounts
  useEffect(() => {
    const getRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Await the result of getUserRole to get the user role
          const roleResponse = await getUserRole(token);
          console.log("Role response:", roleResponse);
          if (roleResponse.success) {
            setUserRole(roleResponse.role); // Set the role in state
          } else {
            console.error("Failed to fetch user role:", roleResponse.error);
          }
        }
      } catch (err) {
        console.error("Error getting role:", err);
      }
    };
    getRole(); // Call the function to get the role when the component mounts
  }, []); // Empty dependency array to run only once on component mount

  const handleOptionChange = (e) => {
    setViewOption(e.target.value);
    setItems([]);
    setMessage("");
    setSelectedCategory(""); // Reset selected category when changing view option
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const closePopup = (e) => {
    if (e.target.className === "popup-box") {
      setIsPopupOpen(false);
    }
  };

  // Fetch categories when viewOption changes
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      if (viewOption === "Category") {
        const result = await getAllShopCategories();
        if (result.categories) {
          setCategories(result.categories);
        }
      } else if (viewOption === "Products") {
        const result = await getAllProductCategories();
        if (result.categories) {
          setCategories(result.categories);
        }
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, [viewOption, isPopupOpen]);

  // Fetch items (products or shops) when a category is selected
  const handleCategorySelect = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category); // Set selected category

    if (!category) return;

    setIsLoading(true);
    setItems([]); // Clear items before fetching new ones
    setMessage(""); // Reset message

    if (viewOption === "Products") {
      const result = await getProductsByCategory(category);
      if (result.products) {
        setItems(result.products);
        setMessage(result.success);
      } else {
        setMessage(result.error);
      }
    } else if (viewOption === "Category") {
      const result = await getShopByCategory(category);
      if (result.shops) {
        setItems(result.shops);
        setMessage(result.success);
      } else {
        setMessage(result.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="cop-category-or-product">
      {/* Back Button */}
      <div className="cop-back-button">
        <Link to="/">Back to Home</Link>
      </div>

      {/* Options Section */}
      <form className="cop-options-form">
        <div className="cop-options">
          <label>
            <input
              type="radio"
              id="cop-category"
              name="view_option"
              value="Category"
              checked={viewOption === "Category"}
              onChange={handleOptionChange}
            />
            Shop Category
          </label>
          <label>
            <input
              type="radio"
              id="cop-products"
              name="view_option"
              value="Products"
              checked={viewOption === "Products"}
              onChange={handleOptionChange}
            />
            Products
          </label>
        </div>
      </form>

      {/* Search Section */}
      <form className="cop-search-form">
        <label htmlFor="search-dropdown">Search:</label>
        <div className="cop-search-bar">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <select
              id="cop-search-dropdown"
              name="search"
              value={selectedCategory} // Bind value to selectedCategory state
              onChange={handleCategorySelect}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </form>

      {/* Display Items Section */}
      <div className="cop-item-list">
        {message && <p>{message}</p>}
        {items.length > 0 ? (
          <ul>
            {console.log(items)}

            {items.map((item) => (
              <li key={item.id}>
                {item.name}
                {console.log(item)}
                {viewOption !== "Products" && (
                  <Link to={`/particular-shop/${item.id}`}>
                    <br />
                    Get To The Shop
                  </Link>
                )}
                {viewOption === "Products" && (
                  <div>
                    
                      Rs.{item.price}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found for the selected category.</p>
        )}
      </div>

      {/* Add Button */}
      {userRole === "admin" && (

        <div className="cop-add-button">
          <button onClick={togglePopup}>+</button>
        </div>
      )}


      {/* Popup Box */}
      {isPopupOpen && (
        <div className="cop-popup-box" onClick={closePopup}>
          <div className="cop-popup-content">
            <button className="cop-close-popup" onClick={togglePopup}>
              &times;
            </button>
            <form className="cop-options-form">
              <div className="cop-options">
                <label>
                  <input
                    type="radio"
                    id="cop-category"
                    name="view_option"
                    value="Category"
                    checked={viewOption === "Category"}
                    onChange={handleOptionChange}
                  />
                  Shop Category
                </label>
                <label>
                  <input
                    type="radio"
                    id="cop-products"
                    name="view_option"
                    value="Products"
                    checked={viewOption === "Products"}
                    onChange={handleOptionChange}
                  />
                  Products
                </label>
              </div>
            </form>

            {viewOption === "Category" && <AddShopCategory />}
            {viewOption === "Products" && <AddProductCategory />}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryOrProduct;
