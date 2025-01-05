
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dujdyhai7',
    api_key: '279122971627671',
    api_secret: 'oG-m6f-gC_Ie5ekmoQAw1ZhsMRs' // Replace with your actual API secret
});


// Cloudinary configuration
export function cloudinaryConnect() {
    try {
        cloudinary.config({
            cloud_name: 'dujdyhai7',
            api_key: '279122971627671',
            api_secret: '<your_api_secret>' // Replace with your actual API secret
        });
        console.log("Cloudinary connected successfully");
    } catch (error) {
        console.error("Cloudinary configuration error:", error.message);
        throw new Error("Cloudinary connection failed");
    }
}

/**
 * Uploads an image to Cloudinary.
 * @param {string} filePath - The local or remote path of the image to upload.
 * @param {string} publicId - The desired public ID for the uploaded image.
 * @returns {Promise<Object>} The upload result object from Cloudinary.
 */

/*
export async function uploadImage(filePath, publicId) {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
        });
        console.log("Upload successful:", uploadResult);
        return uploadResult;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error(`Error uploading image: ${error.message}`);
    }
}*/

export async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "shopping-mall"); // Replace with your upload preset

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dujdyhai7/image/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Upload error:", errorData);
            throw new Error(`Upload failed: ${errorData.error.message}`);
        }

        const data = await response.json();
        console.log("Image uploaded successfully:", data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error(`Error uploading image: ${error.message}`);
    }
}

/**
 * Generates an optimized URL for an image.
 * @param {string} publicId - The public ID of the image.
 * @returns {string} The optimized image URL.
 */
export function getOptimizedImageUrl(publicId) {
    const optimizedUrl = cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
    });
    console.log("Optimized image URL:", optimizedUrl);
    return optimizedUrl;
}

/**
 * Generates a transformed URL for an image.
 * @param {string} publicId - The public ID of the image.
 * @param {number} width - The desired width of the image.
 * @param {number} height - The desired height of the image.
 * @returns {string} The transformed image URL.
 */
export function getTransformedImageUrl(publicId, width, height) {
    const transformedUrl = cloudinary.url(publicId, {
        crop: 'auto',
        gravity: 'auto',
        width: width,
        height: height,
    });
    console.log("Transformed image URL:", transformedUrl);
    return transformedUrl;
}

// Example usage
(async function exampleUsage() {
    try {
        // Connect to Cloudinary
        cloudinaryConnect();

        // Upload an image
        const uploadResult = await uploadImage('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 'shoes');

        // Get optimized image URL
        const optimizedUrl = getOptimizedImageUrl('shoes');
        console.log("Optimized URL:", optimizedUrl);

        // Get transformed image URL
        const transformedUrl = getTransformedImageUrl('shoes', 500, 500);
        console.log("Transformed URL:", transformedUrl);
    } catch (error) {
        console.error("Error in example usage:", error);
    }
});
