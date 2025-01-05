import {  collection, addDoc, doc, getDoc, updateDoc, query, where, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Adds an offer to the offers collection
 * @param {Object} offer - Offer details (offerTitle, offerDescription, expiryDate)
 */
const addOffer = async (offer, shopId, shopName) => {
    try {
        if (!offer.offerTitle || !offer.offerDescription || !offer.expiryDate) {
            console.error("Missing required fields: offerTitle, offerDescription, or expiryDate.");
            return { error: "Missing required fields: offerTitle, offerDescription, or expiryDate." };
        }

        const docRef = await addDoc(collection(db, "offers"), {
            offerTitle: offer.offerTitle,
            offerDescription: offer.offerDescription,
            expiryDate: new Date(offer.expiryDate).toISOString(),
            createdAt: new Date().toISOString(),
            shopId: shopId,
            shopName: shopName,
        });

        console.log("Offer added with ID:", docRef.id);
        return { success: "Offer added successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error adding offer:", e);
        return { error: "Error adding offer." };
    }
};

const getAllOffers = async () => {
    try {
      const offersRef = collection(db, "offers");
      const snapshot = await getDocs(offersRef);
  
      if (snapshot.empty) {
        console.log("No offers found.");
        return { success: true, offers: [] };
      }
  
      const offers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return { success: true, offers };
    } catch (error) {
      console.error("Error fetching offers:", error);
      return { success: false, error: "Failed to fetch offers." };
    }
  };

/**
 * Adds an offer to a specific shop and associates it with the shop
 * @param {String} shopId - The shop's ID
 * @param {Object} offer - Offer details (offerTitle, offerDescription, expiryDate)
 */



const addOfferToShop = async (shopId, offer) => {
    try {
        if (!shopId || !offer.offerTitle || !offer.offerDescription || !offer.expiryDate) {
            console.error("Missing required fields: shopId, offerTitle, offerDescription, or expiryDate.");
            return { error: "Missing required fields: shopId, offerTitle, offerDescription, or expiryDate." };
        }

        // Get a reference to the shop document
        const shopDocRef = doc(db, "shops", shopId);
        const shopDoc = await getDoc(shopDocRef);

        if (!shopDoc.exists()) {
            console.error(`Shop with ID ${shopId} does not exist.`);
            return { error: `Shop with ID ${shopId} does not exist.` };
        }

        // Get existing specialOffer list or initialize a new one
        const shopData = shopDoc.data();
        const specialOffer = shopData.specialOffer || [];

        // Add the new offer to the specialOffer list
        specialOffer.push({
            offerTitle: offer.offerTitle,
            offerDescription: offer.offerDescription,
            expiryDate: new Date(offer.expiryDate).toISOString(),
            createdAt: new Date().toISOString(),
        });

        // Update the shop document with the new specialOffer list
        await updateDoc(shopDocRef, { specialOffer });

        console.log(`Offer added to the specialOffer list of shop ${shopId}.`);
        return { success: `Offer added to the specialOffer list of shop ${shopId}.` };
    } catch (e) {
        console.error("Error adding offer to shop:", e);
        return { error: "Error adding offer to shop." };
    }
};



const deleteExpiredOffersGlobal = async () => {
    try {
        const now = new Date().toISOString();
        const offersRef = collection(db, "offers");
        const expiredOffersQuery = query(offersRef, where("expiryDate", "<=", now));
        const expiredOffersSnapshot = await getDocs(expiredOffersQuery);

        for (const doc of expiredOffersSnapshot.docs) {
            console.log(`Deleting expired offer: ${doc.id}`);
            await deleteDoc(doc.ref);
        }

        console.log("Expired offers deleted from global collection.");
    } catch (error) {
        console.error("Error deleting expired global offers:", error);
    }
};

/**
 * Deletes expired offers from shop-specific collections.
 */
const deleteExpiredOffersFromShops = async () => {
    try {
        const now = new Date().toISOString();
        const shopsRef = collection(db, "shops");
        const shopsSnapshot = await getDocs(shopsRef);

        for (const shopDoc of shopsSnapshot.docs) {
            const shopOffersRef = collection(db, "shops", shopDoc.id, "offers");
            const expiredShopOffersQuery = query(shopOffersRef, where("expiryDate", "<=", now));
            const expiredShopOffersSnapshot = await getDocs(expiredShopOffersQuery);

            for (const doc of expiredShopOffersSnapshot.docs) {
                console.log(`Deleting expired offer from shop ${shopDoc.id}: ${doc.id}`);
                await deleteDoc(doc.ref);
            }

            console.log(`Expired offers deleted from shop ${shopDoc.id}.`);
        }
    } catch (error) {
        console.error("Error deleting expired shop-specific offers:", error);
    }
};
export {
    addOffer,
    addOfferToShop,
    deleteExpiredOffersGlobal,
    deleteExpiredOffersFromShops,
    getAllOffers
};
