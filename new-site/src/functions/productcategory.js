import { db } from '../firebaseConfig';
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";

// Function to add a product category
const addProductCategory = async (categoryName) => {
    try {
        if (!categoryName) {
            console.error("Category name is required.");
            return { error: "Category name is required." };
        }

        const docRef = await addDoc(collection(db, "productCategories"), {
            name: categoryName,
            createdAt: new Date().toISOString(),
        });
        console.log("Product category added with ID:", docRef.id);
        return { success: "Product category added successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error adding product category:", e);
        return { error: "Error adding product category." };
    }
};

// Function to get all product categories
const getAllProductCategories = async () => {
    try {
        const q = query(collection(db, "productCategories"));
        const querySnapshot = await getDocs(q);

        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, name: doc.data().name });
        });

        if (categories.length > 0) {
            console.log("Product categories retrieved:", categories);
            return { success: "Product categories retrieved successfully.", categories };
        } else {
            console.log("No product categories found.");
            return { error: "No product categories found." };
        }
    } catch (e) {
        console.error("Error retrieving product categories:", e);
        return { error: "Error retrieving product categories." };
    }
};

// Function to get a product category by name
const getProductCategoryByName = async (categoryName) => {
    try {
        if (!categoryName) {
            console.error("Category name is required.");
            return { error: "Category name is required." };
        }

        const q = query(collection(db, "productCategories"), where("name", "==", categoryName));
        const querySnapshot = await getDocs(q);

        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, name: doc.data().name });
        });

        if (categories.length > 0) {
            console.log("Product category found:", categories);
            return { success: "Product category found.", categories };
        } else {
            console.log("No product category found with the given name.");
            return { error: "No product category found with the given name." };
        }
    } catch (e) {
        console.error("Error retrieving product category by name:", e);
        return { error: "Error retrieving product category by name." };
    }
};

export { addProductCategory, getAllProductCategories, getProductCategoryByName };
