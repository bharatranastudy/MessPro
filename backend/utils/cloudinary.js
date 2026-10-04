import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import path from "path"

const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : "",
        api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : "",
        api_secret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : ""
    });
    try {
        const result = await cloudinary.uploader.upload(file)
        if (fs.existsSync(file)) fs.unlinkSync(file)
        return result.secure_url
    } catch (error) {
        console.log("Cloudinary upload failed, falling back to local file:", error?.message || error)
        const filename = path.basename(file)
        const port = process.env.PORT || 8000
        return `http://localhost:${port}/public/${filename}`
    }
}

export default uploadOnCloudinary