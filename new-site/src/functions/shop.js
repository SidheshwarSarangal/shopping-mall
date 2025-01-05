import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

// Function to add a new shop
const addShop = async (shop) => {
    try {
        if (!shop.name || !shop.category || !shop.floor || !shop.owner) {
            console.error("Missing required fields");
            return { error: "Missing required fields." };
        }

        const docRef = await addDoc(collection(db, "shops"), {
            name: shop.name,
            category: shop.category,
            products: shop.products || [], // Default to an empty list
            floor: shop.floor,
            owner: shop.owner,
            createdAt: new Date().toISOString(),
            specialOffer: shop.specialOffer || []
        });
        console.log("Shop added with ID:", docRef.id);
        return { success: "Shop added successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error adding shop:", e);
        return { error: "Error adding shop." };
    }
};

// Function to edit an existing shop
const editShop = async (shopId, updatedData) => {
    try {
        const shopRef = doc(db, "shops", shopId);
        await updateDoc(shopRef, {
            ...updatedData,
            updatedAt: new Date().toISOString(), // Track the update timestamp
        });
        console.log("Shop updated successfully.");
        return { success: "Shop updated successfully." };
    } catch (e) {
        console.error("Error updating shop:", e);
        return { error: "Error updating shop." };
    }
};

// Function to delete a shop
const deleteShop = async (shopId) => {
    try {
        const shopRef = doc(db, "shops", shopId);
        await deleteDoc(shopRef);
        console.log("Shop deleted successfully.");
        return { success: "Shop deleted successfully." };
    } catch (e) {
        console.error("Error deleting shop:", e);
        return { error: "Error deleting shop." };
    }
};

// Function to get a shop by name
const getShopByName = async (name) => {
    try {
        const q = query(collection(db, "shops"), where("name", "==", name));
        const querySnapshot = await getDocs(q);

        const shops = [];
        querySnapshot.forEach((doc) => {
            shops.push({ id: doc.id, ...doc.data() });
        });

        if (shops.length > 0) {
            console.log("Shop(s) found:", shops);
            return { success: "Shop(s) found.", shops };
        } else {
            console.log("No shop found with the given name.");
            return { error: "No shop found with the given name." };
        }
    } catch (e) {
        console.error("Error fetching shop by name:", e);
        return { error: "Error fetching shop by name." };
    }
};

// Function to get shops by category
const getShopByCategory = async (category) => {
    try {
        const q = query(collection(db, "shops"), where("category", "==", category));
        const querySnapshot = await getDocs(q);

        const shops = [];
        querySnapshot.forEach((doc) => {
            shops.push({ id: doc.id, ...doc.data() });
        });

        if (shops.length > 0) {
            console.log("Shops in category:", shops);
            return { success: "Shops found in the category.", shops };
        } else {
            console.log("No shops found in the given category.");
            return { error: "No shops found in the given category." };
        }
    } catch (e) {
        console.error("Error fetching shops by category:", e);
        return { error: "Error fetching shops by category." };
    }
};

// Function to get shops by floor
const getShopByFloor = async (floor) => {
    try {
        const q = query(collection(db, "shops"), where("floor", "==", floor));
        const querySnapshot = await getDocs(q);

        const shops = [];
        querySnapshot.forEach((doc) => {
            shops.push({ id: doc.id, ...doc.data() });
        });

        if (shops.length > 0) {
            console.log("Shops on floor:", shops);
            return { success: "Shops found on the floor.", shops };
        } else {
            console.log("No shops found on the given floor.");
            return { error: "No shops found on the given floor." };
        }
    } catch (e) {
        console.error("Error fetching shops by floor:", e);
        return { error: "Error fetching shops by floor." };
    }
};

// Function to get all shops
const getAllShops = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "shops"));

        const shops = [];
        querySnapshot.forEach((doc) => {
            shops.push({ id: doc.id, ...doc.data() });
        });

        if (shops.length > 0) {
            console.log("All shops found:", shops);
            return { success: "Shops retrieved successfully.", shops };
        } else {
            console.log("No shops found.");
            return { error: "No shops found." };
        }
    } catch (e) {
        console.error("Error fetching all shops:", e);
        return { error: "Error fetching all shops." };
    }
};

// Function to get a shop by ID
/*
const getShopById = async (id) => {
    try {
        const shopRef = doc(db, "shops", id); // Reference the shop document by ID
        const shopSnap = await getDoc(shopRef); // Fetch the document

        if (shopSnap.exists()) {
            console.log("Shop found:", shopSnap.data());
            return { success: "Shop found.", shop: { id: shopSnap.id, ...shopSnap.data() } };
        } else {
            console.log("No shop found with the given ID.");
            return { error: "No shop found with the given ID." };
        }
    } catch (e) {
        console.error("Error fetching shop by ID:", e);
        return { error: "Error fetching shop by ID." };
    }
};*/
const getShopById = async (id) => {
    try {
        const shopRef = doc(db, "shops", id);
        const shopDoc = await getDoc(shopRef);
        if (shopDoc.exists()) {
            return { shop: shopDoc.data() };
        } else {
            console.error("Shop not found");
            return { error: "Shop not found" };
        }
    } catch (error) {
        console.error("Error fetching shop:", error);
        return { error: "Error fetching shop" };
    }
};

const decreaseProductQuantity = async (shopId, productName, val) => {
    try {
        // Reference to the shop document
        const shopRef = doc(db, "shops", shopId);

        // Get the current shop document data
        const shopDoc = await getDoc(shopRef);

        if (!shopDoc.exists()) {
            return { error: "Shop not found." };
        }

        const shopData = shopDoc.data();
        const products = shopData.products;

        // Find the product in the products list
        const productIndex = products.findIndex(product => product.name === productName);

        if (productIndex === -1) {
            return { error: "Product not found in the shop's product list." };
        }

        const product = products[productIndex];

        // Check if the product quantity is greater than 0
        if (product.quantity <= 0) {
            return { error: "Product quantity is already 0, cannot decrease." };
        }

        // Decrease the product quantity by 1
        product.quantity += val;

        // Update the products array with the modified product
        products[productIndex] = product;

        // Update the shop's document with the new products list
        await updateDoc(shopRef, {
            products: products
        });

        console.log("Product quantity decreased successfully.");
        return { success: true };

    } catch (error) {
        console.error("Error decreasing product quantity:", error);
        return { error: "Error decreasing product quantity." };
    }
};

export { addShop, editShop, deleteShop, getShopByName, getShopByCategory, getShopByFloor, getAllShops, getShopById, decreaseProductQuantity };
