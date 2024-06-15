import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Router } from "express";
import { authenticationValidator } from "../middleware/authenticationValidator.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const mediaCustomerRoute = Router();

mediaCustomerRoute.post("/dashboard/customer/new/upload", authenticationValidator, upload.single("file"), async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    try {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const fileName = file.originalname.split(".")[0];
  
      const result = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: "auto",
      });
      const secureUrl = result.secure_url;
  
      res.json({
        message: "Upload file successfully",
        secure_url: secureUrl,
      });
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      res.status(500).json({ error: "Error uploading file" });
    }
  });
  

export default mediaCustomerRoute;
