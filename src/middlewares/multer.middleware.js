import multer from "multer";
import { storage } from "../config/cloudinary.config.js";

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2}
})

const uploadVideo = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 50 } // 50MB
});

export {upload, uploadVideo}