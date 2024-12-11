import { v2 as cloudinary } from 'cloudinary'; 
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';  // Import from 'express'
import path from 'path';
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,     
  api_secret: process.env.CLOUDINARY_API_SECRET  ,  
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("in multer")
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname); // Extract file extension
    cb(null, `image-${uniqueSuffix}${extension}`); 
    
  }
});

const upload = multer({ storage });

export interface CustomRequest extends Request {
  imageUrl?: string;
}

const uploadImageToCloudinary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log("**********************",req.file)
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'community-connect/images', // Folder in Cloudinary to store the image
      });

      req.imageUrl = result.secure_url;
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        } else {
          console.log('Temporary file deleted successfully');
        }
      });
      next();
    } catch (error) {
      // if (error instanceof cloudinary.CloudinaryError) {
      //   return next(new CustomError('Cloudinary upload failed', 500, error));
      // }
      next(error);
    }
  } else {
    next();
  }
};

export { upload, uploadImageToCloudinary };
