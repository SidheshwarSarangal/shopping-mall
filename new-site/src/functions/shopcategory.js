import { db } from '../firebaseConfig';
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";

// Function to add a shop category
const addShopCategory = async (categoryName) => {
    try {
        if (!categoryName) {
            console.error("Category name is required.");
            return { error: "Category name is required." };
        }

        const docRef = await addDoc(collection(db, "shopCategories"), {
            name: categoryName,
            createdAt: new Date().toISOString(),
        });
        console.log("Category added with ID:", docRef.id);
        return { success: "Category added successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error adding category:", e);
        return { error: "Error adding category." };
    }
};

// Function to get all shop categories
const getAllShopCategories = async () => {
    try {
        const q = query(collection(db, "shopCategories"));
        const querySnapshot = await getDocs(q);

        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, name: doc.data().name });
        });

        if (categories.length > 0) {
            console.log("Categories retrieved:", categories);
            return { success: "Categories retrieved successfully.", categories };
        } else {
            console.log("No categories found.");
            return { error: "No categories found." };
        }
    } catch (e) {
        console.error("Error retrieving categories:", e);
        return { error: "Error retrieving categories." };
    }
};

// Function to get a specific category by name
const getCategoryByName = async (categoryName) => {
    try {
        if (!categoryName) {
            console.error("Category name is required.");
            return { error: "Category name is required." };
        }

        const q = query(collection(db, "shopCategories"), where("name", "==", categoryName));
        const querySnapshot = await getDocs(q);

        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, name: doc.data().name });
        });

        if (categories.length > 0) {
            console.log("Category found:", categories);
            return { success: "Category found.", categories };
        } else {
            console.log("No category found with the given name.");
            return { error: "No category found with the given name." };
        }
    } catch (e) {
        console.error("Error retrieving category by name:", e);
        return { error: "Error retrieving category by name." };
    }
};

export { addShopCategory, getAllShopCategories, getCategoryByName };
