import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env variables are loaded before evaluating Cloudinary config
dotenv.config({ path: path.join(__dirname, '../.env') });

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_.]/g, '');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const upload = multer({
  storage: hasCloudinaryConfig ? multer.memoryStorage() : localStorage,
});

export const saveUploadedImage = async (file, folder) => {
  if (!file) {
    return null;
  }

  // If local disk storage was used (hasCloudinaryConfig is false)
  if (!hasCloudinaryConfig || !file.buffer) {
    return {
      imageUrl: `/uploads/${file.filename}`,
      imagePublicId: '',
    };
  }

  // Try uploading to Cloudinary
  try {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
    });

    return {
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
    };
  } catch (error) {
    console.warn('Cloudinary upload failed, falling back to local file storage:', error.message);
    
    // Fallback: write memory buffer to local uploads folder
    const safeName = (file.originalname || 'upload.jpg').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_.]/g, '');
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, file.buffer);

    return {
      imageUrl: `/uploads/${filename}`,
      imagePublicId: '',
    };
  }
};

export const deleteUploadedImage = async (publicId) => {
  if (!hasCloudinaryConfig || !publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.warn('Cloudinary delete error:', error.message);
  }
};

