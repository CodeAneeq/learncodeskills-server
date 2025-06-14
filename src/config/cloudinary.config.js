import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Constants from '../constant.js';

// Use cloudinary.v2 for the latest stable API in version 1.x
const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
    cloud_name: Constants.CLOUD_NAME,
    api_key: Constants.API_KEY,
    api_secret: Constants.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: async (req, file) => {
        let resourceType = 'image';
        if (file.mimetype.startsWith('video/')) {
            resourceType = 'video';
        }

        return {
            folder: 'learnCodeSkills',
            resourceType: resourceType,
            allowedFormats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
        }
    }
});

export { cloudinaryV2 as cloudinary, storage };
