import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CategoryOrProduct from "../pages/CategoryOrProduct";
import Floor from "../pages/Floor";
import NewUser from "../pages/NewUser";
import Offer from "../pages/Offer";
import Shop from "../pages/Shop";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import AccountCreation from "../pages/AccountCreation";
import Product from "../pages/Product";
import ParticularShop from "../pages/IndividualShop";
import UserProfile from "../pages/Carry-bag";


const App = () => {
  return (
    <div>
  

      {/* Define the routes */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category-or-product" element={<CategoryOrProduct />} />
          <Route path="/floor" element={<Floor />} />
          <Route path="/newuser" element={<NewUser />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/account-creation" element={<AccountCreation />} />
          <Route path="/product" element={<Product/>}/>
          <Route path="/particular-shop/:id" element={<ParticularShop/>} />
          <Route path="/carry-bag" element={<UserProfile/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
