import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

export const getAssetUrl = (url) => {
  if (!url || url.startsWith('data:')) {
    return url;
  }

  const apiOrigin = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : API_BASE;
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.pathname.startsWith('/uploads/')) {
        return `${apiOrigin}${parsedUrl.pathname}`;
      }
    } catch (error) {
      return url;
    }
    return url;
  }

  return `${apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mobileWholesaleToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
