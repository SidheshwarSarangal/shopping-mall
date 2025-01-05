import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, getProductByName, getProductsByCategory } from "../src/functions/product"; // Import product functions
import "../css/Products.css"; // Ensure this path is correct
import CreateProduct from "../components/createProductComponent"; // Component to add new product
import { getUserRole } from "../src/functions/user";


const Product = () => {
  const [showBox, setShowBox] = useState(false);
  const [productList, setProductList] = useState([]); // List of products to display
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products after search
  const [isSearching, setIsSearching] = useState(false); // Track if a search is performed
  const boxRef = useRef(null);
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


 /* const toggleBox = () => {
    setShowBox((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowBox(false);
      }
    };

    if (showBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBox]);*/

  // Fetch all products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const allProductsResponse = await getAllProducts();
      setProductList(allProductsResponse.products || []);
    };
    fetchProducts();
    console.log("productlist", productList);

  }, []);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true); // Indicate that a search is being performed

    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const response = await getProductByName(searchTerm);
      if (response.products && response.products.length > 0) {
        setFilteredProducts(response.products);
      } else {
        setFilteredProducts([]);
      }
    }
  };

  // Clear search input and show all products
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
    setIsSearching(false); // Reset the search state to show all products again
  };

  // Determine which list of products to display (filtered or all)
  const productsToDisplay = isSearching ? filteredProducts : productList;

  return (
    <div className="product-page">
      {/* Back Button */}
      <div className="back-button">
        <Link to="/">Back to Home</Link>
      </div>

      {/* Search Section */}
      <div className="search-container">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-bar">
            <input
              type="text"
              id="search"
              name="search"
              className="search-input"
              placeholder="Enter product name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button type="button" className="clear-button" onClick={clearSearch}>
                &#10005; {/* Cross mark for clearing */}
              </button>
            )}
            <button type="submit" className="search-button">Search</button>

          </div>
        </form>
      </div>

      {/* List of Products */}
      <div className="product-list-container">
        <ul className="result-list">
          {productsToDisplay.length > 0 ? (
            productsToDisplay.map((productItem) => (
              <li key={productItem.id}>
                <div className="result-item">
                  <div className="result-info">
                    <p><strong>Product Name:</strong> {productItem.name}</p>
                    <p><strong>Price:</strong> Rupees.{productItem.price}</p>
                    <p>
                      <strong>Shops:</strong>{" "}
                      {Array.isArray(productItem.shopList) && productItem.shopList.length > 0 ? (
                        console.log("shoplist", productItem.shopList),
                        productItem.shopList.map((shop, index) => (
                          <span key={index}>
                            {console.log("shopid:", shop.shopId)}
                            <Link to={`/particular-shop/${shop.shopId}`}>{shop.shopName}</Link>
                            {index < productItem.shopList.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        "No shops available."
                      )}
                    </p>
                  </div>
                  <div className="result-image">
                    <img src={productItem.image || "default.jpg"} alt={productItem.name} />
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>{isSearching ? "No products found." : "No products available."}</p>
          )}
        </ul>
      </div>

      {/* Plus Button */}
      {/*userRole === "admin" && (
        <button className="plus-button" onClick={toggleBox}>
          +
        </button>
      )*/}


      {/* Popup Box */}
      {showBox && (
        <div className="popup-box" ref={boxRef}>
          <CreateProduct />
        </div>
      )}
    </div>
  );
};

export default Product;
