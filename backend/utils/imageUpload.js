import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper to configure and check Cloudinary dynamically
const getCloudinary = () => {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({
      cloud_name: cloud_name.trim(),
      api_key: api_key.trim(),
      api_secret: api_secret.trim(),
    });
    return cloudinary;
  }
  return null;
};

// Always use memoryStorage so file.buffer is always available in RAM for Cloudinary or disk
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const saveUploadedImage = async (file, folder = 'mobile-wholesale') => {
  if (!file) {
    return null;
  }

  const cld = getCloudinary();

  // 1. Try Cloudinary upload if credentials exist
  if (cld && file.buffer) {
    try {
      const mime = file.mimetype || 'image/jpeg';
      const dataUri = `data:${mime};base64,${file.buffer.toString('base64')}`;

      const result = await cld.uploader.upload(dataUri, {
        folder,
        resource_type: 'image',
      });

      console.log('✅ Cloudinary upload success:', result.secure_url);
      return {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error.message || error);
    }
  }

  // 2. Fallback to local disk storage
  const safeName = (file.originalname || 'upload.jpg')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '');
  const filename = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadsDir, filename);

  if (file.buffer) {
    await fs.promises.writeFile(filePath, file.buffer);
  }

  console.log('📁 Local storage fallback saved:', filename);
  return {
    imageUrl: `/uploads/${filename}`,
    imagePublicId: '',
  };
};

export const deleteUploadedImage = async (publicId) => {
  if (!publicId) return;

  const cld = getCloudinary();
  if (!cld) return;

  try {
    await cld.uploader.destroy(publicId);
  } catch (error) {
    console.warn('Cloudinary delete error:', error.message);
  }
};


