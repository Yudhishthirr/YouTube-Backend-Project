import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return console.log("File path not found");
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log("file is uploaded successfully ", response);
        // console.log("file is uploaded successfully ");
        // const duration = response?.duration
        // if(duration){
        //     fs.unlinkSync(localFilePath)
        //     return duration
        // }
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("file uploaded failled ", error);
        fs.unlinkSync(localFilePath) 
        return null;
    }
}



export {uploadOnCloudinary}