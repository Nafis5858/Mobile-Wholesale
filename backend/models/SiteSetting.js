import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    contact: {
      email: { type: String, required: true, trim: true, default: 'support@mobilewholesale.com' },
      phone: { type: String, required: true, trim: true, default: '+880-1234-567890' },
      address: { type: String, required: true, trim: true, default: 'Dhaka, Bangladesh' },
    },
  },
  { timestamps: true }
);

const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema);
export default SiteSetting;
