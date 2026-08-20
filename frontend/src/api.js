import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

export const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23161b27"/><stop offset="100%" stop-color="%231e2535"/></linearGradient><linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="400" height="300" fill="url(%23bg)"/><circle cx="200" cy="125" r="46" fill="%23252d40" stroke="rgba(255,255,255,0.08)" stroke-width="2"/><rect x="184" y="99" width="32" height="52" rx="6" fill="none" stroke="url(%23primaryGrad)" stroke-width="3"/><line x1="195" y1="105" x2="205" y2="105" stroke="%23a5b4fc" stroke-width="2" stroke-linecap="round"/><circle cx="200" cy="143" r="2" fill="%23a5b4fc"/><text x="200" y="205" fill="%2394a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" text-anchor="middle" letter-spacing="0.5">Mobile Wholesale</text><text x="200" y="225" fill="%2364748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" text-anchor="middle">Stock Item</text></svg>`;

export const handleImageError = (e, fallback = DEFAULT_PRODUCT_IMAGE) => {
  if (e?.currentTarget && e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
};

export const getAssetUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const cleanUrl = url.trim();

  // If already a data URI or blob URL
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // If already an absolute URL (e.g. Cloudinary, external CDN, or full backend URL)
  if (/^https?:\/\//i.test(cleanUrl)) {
    return cleanUrl;
  }

  // Relative path (e.g. "/uploads/..." or "uploads/...")
  const path = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;

  // If API_BASE is an absolute URL (e.g., http://localhost:5000/api or https://api.domain.com/api)
  if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
    const origin = API_BASE.replace(/\/api\/?$/, '');
    return `${origin}${path}`;
  }

  return path;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mobileWholesaleToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
