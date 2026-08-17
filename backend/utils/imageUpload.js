import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
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

  if (!hasCloudinaryConfig) {
    return {
      imageUrl: `/uploads/${file.filename}`,
      imagePublicId: '',
    };
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
  });

  return {
    imageUrl: result.secure_url,
    imagePublicId: result.public_id,
  };
};

export const deleteUploadedImage = async (publicId) => {
  if (!hasCloudinaryConfig || !publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};
