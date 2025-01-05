import { db } from '../firebaseConfig';
import { collection, addDoc, query, getDocs } from "firebase/firestore";

// Function to add a special offer
const addSpecialOffer = async (shopName, offerDescription, validTill) => {
    try {
        if (!shopName || !offerDescription || !validTill) {
            console.error("All fields (shop name, offer description, valid till) are required.");
            return { error: "All fields (shop name, offer description, valid till) are required." };
        }

        const docRef = await addDoc(collection(db, "specialOffers"), {
            shopName,
            offerDescription,
            validTill,
            createdAt: new Date().toISOString(),
        });
        console.log("Special offer added with ID:", docRef.id);
        return { success: "Special offer added successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error adding special offer:", e);
        return { error: "Error adding special offer." };
    }
};

// Function to get all special offers
const getAllSpecialOffers = async () => {
    try {
        const q = query(collection(db, "specialOffers"));
        const querySnapshot = await getDocs(q);

        const offers = [];
        querySnapshot.forEach((doc) => {
            offers.push({
                id: doc.id,
                shopName: doc.data().shopName,
                offerDescription: doc.data().offerDescription,
                validTill: doc.data().validTill,
                createdAt: doc.data().createdAt,
            });
        });

        if (offers.length > 0) {
            console.log("Special offers retrieved:", offers);
            return { success: "Special offers retrieved successfully.", offers };
        } else {
            console.log("No special offers found.");
            return { error: "No special offers found." };
        }
    } catch (e) {
        console.error("Error retrieving special offers:", e);
        return { error: "Error retrieving special offers." };
    }
};

export { addSpecialOffer, getAllSpecialOffers };
