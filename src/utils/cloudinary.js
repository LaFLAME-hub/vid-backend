import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
    console.error("Cloudinary Error:", error);

    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }

    throw error;   // Don't return null
}
}

const deleteFromCloudinary = async(publicId) => {
    try {
       const result = await cloudinary.uploader.destroy(publicId)
       console.log("deleted from cloudinary ");
       
    } catch (error) {
       console.log("Error deleting from cloudinary" ,error);
        return null
    }
}



export {uploadOnCloudinary , deleteFromCloudinary}