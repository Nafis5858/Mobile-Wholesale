import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema);
export default GalleryImage;
