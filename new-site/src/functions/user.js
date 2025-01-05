
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, arrayUnion, doc, getDoc, setDoc, arrayRemove } from 'firebase/firestore';
import crypto from 'crypto'; // Built-in Node.js module for token generation
import dotenv from 'dotenv';
const { Buffer } = require('buffer');


dotenv.config(); // Load environment variables

// Access the secret key from .env or fallback
const SECRET_KEY = process.env.SECRET_KEY || '279122971627671';

// Utility function to convert base64 to base64url
const base64ToBase64Url = (base64) => {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Utility function to create base64url string
const toBase64Url = (input) => {
    return base64ToBase64Url(Buffer.from(input).toString('base64'));
};

// Function to generate a token using crypto
const generateToken = (payload) => {
    const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = toBase64Url(JSON.stringify(payload));
    const signature = base64ToBase64Url(
        crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64')
    );

    return `${header}.${body}.${signature}`;
};

// Function to verify a token
const verifyToken = (token) => {
    const [header, body, signature] = token.split('.');
    const expectedSignature = base64ToBase64Url(
        crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64')
    );

    if (signature === expectedSignature) {
        const payload = JSON.parse(Buffer.from(body, 'base64').toString());
        return { valid: true, payload };
    } else {
        return { valid: false };
    }
};

// Function to add user data
const addUser = async (user) => {
    try {
        if (!user.name || !user.email || !user.password || !user.role) {
            console.error("Missing required fields");
            return { error: "Missing required fields." };
        }

        const docRef = await addDoc(collection(db, "users"), {
            name: user.name,
            role: user.role,
            email: user.email,
            password: user.password, // Ideally, hash the password before saving it
            purchase: [],
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: "User added successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { error: "Error adding document." };
    }
};

// Function to get user data by email, role, and password
const getUserByIdAndRole = async (email, role, password) => {
    if (!SECRET_KEY) {
        console.error("SECRET_KEY is not defined");
        return { error: "Internal server error. Secret key missing." };
    }
    console.log(SECRET_KEY);

    try {
        // Query to find user by email and role
        const q = query(
            collection(db, "users"),
            where("email", "==", email),
            where("role", "==", role)
        );

        const querySnapshot = await getDocs(q);

        // If no user is found
        if (querySnapshot.empty) {
            return { error: "User not found with this email and role." };
        }

        // User found, check password
        const user = querySnapshot.docs[0].data();

        if (user.password === password) {
            // Generate a token if the password is correct
            const payload = { email: user.email, role: user.role, timestamp: Date.now() };
            const token = generateToken(payload);

            return { success: "Login successful.", token };
        } else {
            return { error: "Incorrect password." };
        }
    } catch (e) {
        console.error("Error fetching user: ", e);
        return { error: "An error occurred." };
    }
};

const getUserRole = async (token) => {
    if (!token) {
        return { error: "Token is required." };
    }

    const verificationResult = verifyToken(token);

    if (!verificationResult.valid) {
        return { error: "Invalid token." };
    }

    const { email } = verificationResult.payload;

    if (!email) {
        return { error: "Token does not contain a valid email." };
    }

    try {
        // Query Firestore for the user's role
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { error: "User not found." };
        }

        const user = querySnapshot.docs[0].data();
        console.log("User role fetched from Firestore:", user.role);
        return { success: true, role: user.role };
    } catch (error) {
        console.error("Error fetching user role:", error);
        return { error: "Failed to retrieve user role." };
    }
};


const getUserData = async (token) => {
    if (!token) {
        return { error: "Token is required." };
    }

    const verificationResult = verifyToken(token);

    if (!verificationResult.valid) {
        return { error: "Invalid token." };
    }

    const { email } = verificationResult.payload;

    if (!email) {
        return { error: "Token does not contain a valid email." };
    }

    try {
        // Query Firestore for the user's role
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { error: "User not found." };
        }

        const user = querySnapshot.docs[0].data();
        return { success: true, userData: user };
    } catch (error) {
        console.error("Error fetching user role:", error);
        return { error: "Failed to retrieve user role." };
    }
};


const addProductToPurchase = async (token, name, shopId, image) => {
    if (!token || !name || !shopId || !image) {
        return { error: "Token and product information are required." };
    }

    // Verify the token and extract user data
    const verificationResult = verifyToken(token);
    if (!verificationResult.valid) {
        return { error: "Invalid token." };
    }

    const { email } = verificationResult.payload;
    if (!email) {
        return { error: "Token does not contain a valid email." };
    }

    try {
        // Query Firestore to find the user by email
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            return { error: "User not found in the database." };
        }

        // Assume one user per email (Firestore constraint)
        const userDoc = userSnapshot.docs[0];
        const userDocRef = userDoc.ref;

        // Update the 'purchase' array for the user
        await updateDoc(userDocRef, {
            purchase: arrayUnion({
                name,
                shopId,
                image,
                timestamp: Date.now(), // Track when the product was purchased
            }),
        });

        console.log("Product added to user purchases.");
        return { success: "Product added to purchases." };
    } catch (error) {
        console.error("Error adding product to purchases:", error);
        return { error: "Failed to add product to purchases." };
    }
};


const removePurchase = async (token, timestamp) => {
    if (!token || !timestamp) {
        return { error: "Token and timestamp are required." };
    }

    // Verify the token and extract user data
    const verificationResult = verifyToken(token);
    if (!verificationResult.valid) {
        return { error: "Invalid token." };
    }

    const { email } = verificationResult.payload;
    if (!email) {
        return { error: "Token does not contain a valid email." };
    }

    try {
        // Query Firestore to find the user by email
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            return { error: "User not found in the database." };
        }

        // Assume one user per email (Firestore constraint)
        const userDoc = userSnapshot.docs[0];
        const userDocRef = userDoc.ref;

        // Find the purchase item with the matching timestamp
        const userData = userDoc.data();
        const purchaseToRemove = userData.purchase.find(purchase => purchase.timestamp === timestamp);

        if (!purchaseToRemove) {
            return { error: "Purchase with the specified timestamp not found." };
        }

        // Remove the specific purchase item from the 'purchase' array
        await updateDoc(userDocRef, {
            purchase: arrayRemove(purchaseToRemove) // Remove the exact object with the matching timestamp
        });

        console.log("Purchase removed from user purchases.");
        return { success: "Purchase removed from purchases." };
    } catch (error) {
        console.error("Error removing purchase:", error);
        return { error: "Failed to remove purchase." };
    }
};




export { addUser, getUserByIdAndRole, verifyToken, getUserRole, getUserData, addProductToPurchase, removePurchase };
