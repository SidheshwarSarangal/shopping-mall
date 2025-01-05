import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";

/**
 * Add a product to the database or update its shop list if it already exists.
 * @param {Object} product - The product details { name, category, price, image }.
 * @param {string} shopName - The name of the shop adding the product.
 * @returns {Object} - Success or error message.
 */


// Function to add a new product
const addProduct = async (product) => {
  try {
    if (!product.name || !product.category || !product.price) {
      console.error("Missing required fields: product name or category.");
      return { error: "Missing required fields: product name or category." };
    }

    const docRef = await addDoc(collection(db, "products"), {
      name: product.name,
      category: product.category,
      price: product.price,
      createdAt: new Date().toISOString(),
      image: product.image,
      shopList: product.shopList || [],
    });

    console.log("Product added with ID:", docRef.id);
    return { success: "Product added successfully.", id: docRef.id };
  } catch (e) {
    console.error("Error adding product:", e);
    return { error: "Error adding product." };
  }
};

// Function to get all products by category
const getProductsByCategory = async (category) => {
  try {
    if (!category) {
      console.error("Category is required to fetch products.");
      return { error: "Category is required to fetch products." };
    }

    const q = query(collection(db, "products"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    if (products.length > 0) {
      console.log("Products retrieved:", products);
      return { success: "Products retrieved successfully.", products };
    } else {
      console.log("No products found for the given category.");
      return { error: "No products found for the given category." };
    }
  } catch (e) {
    console.error("Error retrieving products:", e);
    return { error: "Error retrieving products." };
  }
};


// Add product function

// Get all products
const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { success: "Products retrieved successfully.", products };
  } catch (e) {
    console.error("Error retrieving products:", e);
    return { error: "Error retrieving products." };
  }
};

// Get product by name
const getProductByName = async (name) => {
  try {
    const q = query(collection(db, "products"), where("name", "==", name));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { success: "Products retrieved successfully.", products };
  } catch (e) {
    console.error("Error retrieving products by name:", e);
    return { error: "Error retrieving products by name." };
  }
};

const addProductToShop = async (shopId, product) => {
  try {
    // Validate the product fields
    if (!product.name || !product.price || !product.image) {
      console.error("Missing required product fields");
      return { error: "Missing required product fields." };
    }

    const shopRef = doc(db, "shops", shopId);

    // Fetch the shop document to get the current list of products
    const shopDoc = await getDoc(shopRef);

    if (!shopDoc.exists()) {
      console.error("Shop not found.");
      return { error: "Shop not found." };
    }

    // Get the current products or initialize as an empty array
    const shopData = shopDoc.data();
    const currentProducts = shopData.products || [];

    // Prepare the product object
    const newProduct = {
      name: product.name,
      price: product.price,
      image: product.image,
      addedAt: new Date().toISOString(),
      category: product.category,
      quantity: product.quantity
    };

    // Update the shop's products array by adding the new product
    await updateDoc(shopRef, {
      products: [...currentProducts, newProduct], // Add new product to existing products array
    });

    console.log("Product added to shop successfully.");
    return { success: "Product added successfully." };
  } catch (e) {
    console.error("Error adding product to shop:", e);
    return { error: "Error adding product to shop." };
  }
};


const addOrUpdateProduct = async (product, shopId, shopName) => {
  try {
    // Log the incoming product and shopName to check if they are valid
    console.log("Received product:", product);
    console.log("Received shopName:", shopName);

    // If the shopName is undefined, throw an error
    if (!shopName) {
      throw new Error("Invalid shop name");
    }

    const productQuery = query(collection(db, "products"), where("name", "==", product.name));
    const querySnapshot = await getDocs(productQuery);

    console.log("Product Query Result:", querySnapshot.docs[0]);

    if (!querySnapshot.empty) {
      // If product exists, update the shopList
      const productDoc = querySnapshot.docs[0]; // Get the first document that matches
      const existingProduct = productDoc.data();
      const productRef = doc(db, "products", productDoc.id);

      // Ensure existing shopList is initialized as an empty array if undefined
      const existingShopList = existingProduct.shopList || [];
      console.log("Existing Shop List:", existingShopList); // Log existing shop list

      // Add the current shop to the product's shop list
      const updatedShopList = [
        ...new Set([
          ...existingShopList, 
          { shopName, shopId: shopId, price: product.price }
        ]) // Avoid duplicates
      ];

      console.log("Updated Shop List:", updatedShopList); // Log updated shop list

      // Validate that all required fields exist in shopList
      if (!updatedShopList || updatedShopList.some(item => !item.shopName || !item.shopId || !item.price)) {
        console.error("Invalid shop list data:", updatedShopList);
        throw new Error("Invalid shop list data.");
      }

      // Update the product with the new shopList
      await updateDoc(productRef, { shopList: updatedShopList });

      return { success: `Product "${product.name}" updated with shop "${shopName}".` };
    } else {
      // If product does not exist, create a new product
      const newProduct = {
        ...product,
        shopList: [{ shopName, price: product.price }],
        createdAt: new Date().toISOString(),
      };

      console.log("New Product:", newProduct); // Log new product data

      const docRef = await addDoc(collection(db, "products"), newProduct);
      return { success: "Product added successfully.", id: docRef.id };
    }
  } catch (error) {
    console.error("Error adding or updating product:", error);
    return { error: error.message || "Error adding or updating product." };
  }
};







export { addProduct, getAllProducts, getProductByName, getProductsByCategory, addProductToShop, addOrUpdateProduct };
