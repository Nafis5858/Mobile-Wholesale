import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema);
export default GalleryImage;
