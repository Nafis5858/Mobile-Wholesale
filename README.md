# 📱 Mobile Wholesale — Full-Stack MERN Platform

A full-stack MERN (MongoDB, Express, React, Node.js) wholesale e-commerce platform built for mobile device distributors, retail store owners, and bulk trade buyers.

---

## ✨ Features

### 🛍️ Buyer Features
- **Authentication & Profiles**: Secure JWT-based registration and login with encrypted passwords (`bcryptjs`). Manage profile details, contact numbers, and delivery addresses.
- **Product Catalog**: Clean, modern catalog grid displaying brand, live stock, and wholesale prices with instant navigation to product details.
- **Product Details & MOQ**: In-depth product view with detailed descriptions, brand tags, live stock counters, and Minimum Order Quantity (MOQ) validation.
- **Shopping Cart**: Dynamic multi-item shopping cart with quantity adjustment, MOQ enforcement, and total price calculation.
- **Checkout & Order Placement**: Multi-item order placement with customizable delivery address and contact information.
- **Order Tracking & History**: Track order status (`pending`, `confirmed`, `shipped`, `delivered`, `rejected`) in real-time.
- **Reviews & Ratings**: Submit 1–5 star ratings and reviews for confirmed orders. Public verified reviews display on the Customer Reviews page.
- **Live WhatsApp Support**: Floating WhatsApp quick-connect button with configurable number for instant wholesale inquiry.

### 🛡️ Admin & Control Features
- **Product Management**:
  - **Create**: Add new wholesale products with name, brand, description, price, stock, MOQ, and product photo.
  - **Edit**: In-place modal editor to update product attributes and replace product images.
  - **Delete**: Instant product removal with automatic Cloudinary asset cleanup.
- **Image Gallery Management**:
  - Upload, edit, and delete inventory showcase photos.
- **Blog & Industry News**:
  - Publish, edit, and manage market updates, reviews, and announcements.
- **Wholesale Order Management**:
  - Review all buyer orders with itemized breakdown, buyer contact info, and one-click Accept (`confirmed`) or Reject actions.
- **Live Stock List**:
  - Overview of current inventory levels, SKU grades, and pricing.
- **Site Settings**:
  - Update public contact info (email, phone, address) and WhatsApp float number directly from the dashboard.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`CartContext`)
- **HTTP Client**: Axios (with JWT interceptors)
- **Styling**: Vanilla CSS Design System with CSS variables, Glassmorphism, dark palette, micro-animations, and responsive layouts.

### Backend
- **Runtime**: Node.js (ES Modules `"type": "module"`)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **File Uploads**: `multer` (in-memory storage buffer)
- **Cloud Storage**: Cloudinary SDK (v2) with automatic local disk fallback

---

## 📂 Project Structure

```
Mobile-Wholesale/
├── backend/
│   ├── config/             # Database connection setup (db.js)
│   ├── middleware/         # JWT authentication & admin guard (auth.js)
│   ├── models/             # Mongoose schemas (User, Product, Order, Review, Blog, GalleryImage, SiteSetting)
│   ├── routes/             # Express API routes (auth, products, orders, admin, blogs)
│   ├── uploads/            # Local static fallback upload directory
│   ├── utils/              # Resilient Cloudinary & image processing utilities (imageUpload.js)
│   ├── .env.example        # Backend environment template
│   ├── Dockerfile          # Container configuration
│   ├── index.js            # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/             # Static public assets (HTML template, video, logos)
│   ├── src/
│   │   ├── assets/         # App logo and static assets
│   │   ├── components/     # Reusable components (NavBar, Footer, WhatsAppFloat)
│   │   ├── contexts/       # Global cart context provider (CartContext.js)
│   │   ├── pages/          # Application views (Products, Details, Checkout, Gallery, Blog, Admin, etc.)
│   │   ├── api.js          # Centralized Axios client, dynamic URL resolver & SVG fallback
│   │   ├── App.js          # App root & route definitions
│   │   ├── index.js        # React DOM entry point
│   │   └── styles.css      # Core design system & component styles
│   ├── .env                # Frontend environment config
│   └── package.json
├── render.yaml             # Render Blueprint configuration
├── package.json            # Root workspace scripts
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local daemon or MongoDB Atlas connection string)

### 1. Clone the repository
```bash
git clone https://github.com/Nafis5858/Mobile-Wholesale.git
cd Mobile-Wholesale
```

### 2. Configure Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file (based on `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/mobile-wholesale
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_EMAIL=nafis.kamal.2000@gmail.com
   ADMIN_PASSWORD=your_admin_password
   ```
3. Install dependencies and start the backend:
   ```bash
   npm install
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### 3. Configure Frontend
1. In a new terminal, navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Verify or create `frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
3. Install dependencies and start the React dev server:
   ```bash
   npm install
   npm start
   ```
   *The frontend will open at `http://localhost:3000`.*

---

## 🌐 Production Deployment

### Option 1: Deploy on Render (Recommended)

1. Connect your GitHub repository to [Render](https://dashboard.render.com).
2. Create a **Web Service** using the root directory:
   - **Environment**: Node
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `npm start` (or `node backend/index.js`)
3. Under **Environment Variables**, add:
   - `MONGODB_URI` — Your MongoDB Atlas connection URI
   - `JWT_SECRET` — A secure random string
   - `CLOUDINARY_CLOUD_NAME` — Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` — Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` — Your Cloudinary API secret
   - `NODE_ENV` — `production`
4. Click **Deploy**. In production, Express automatically serves the built React frontend from `frontend/build` and hosts all API endpoints.

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new wholesale buyer account | No |
| `POST` | `/api/auth/login` | Login user or admin | No |
| `PUT` | `/api/auth/profile` | Update current user's profile details | Yes (Buyer) |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get all products | No |
| `GET` | `/api/products/:id` | Get single product by ID | No |
| `POST` | `/api/products` | Create product (multipart with image) | Admin |
| `PUT` | `/api/products/:id` | Update product (multipart with optional image) | Admin |
| `DELETE`| `/api/products/:id` | Delete product and clean up Cloudinary image | Admin |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place single product order | Yes |
| `POST` | `/api/orders/checkout` | Process multi-item cart checkout | Yes |
| `GET` | `/api/orders/my-orders` | Get current user's order history | Yes |
| `POST` | `/api/orders/:orderId/review` | Submit review for confirmed order | Yes |
| `GET` | `/api/orders/reviews/all` | Get all public customer reviews | No |
| `GET` | `/api/orders/all` | Admin: view all buyer orders | Admin |
| `PUT` | `/api/orders/:id/status` | Admin: update order status (`confirmed`/`rejected`) | Admin |

### Admin & Site Management (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/site` | Get site contact settings & WhatsApp number | No |
| `PUT` | `/api/admin/site/contact`| Update site contact settings & WhatsApp number | Admin |
| `GET` | `/api/admin/gallery` | Get all gallery showcase images | No |
| `POST` | `/api/admin/gallery` | Upload new gallery image | Admin |
| `PUT` | `/api/admin/gallery/:id`| Edit gallery image title/photo | Admin |
| `DELETE`| `/api/admin/gallery/:id`| Delete gallery image | Admin |

### Blogs & News (`/api/blogs`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs` | Get all blog articles | No |
| `POST` | `/api/blogs` | Create a new blog post | Admin |
| `PUT` | `/api/blogs/:id` | Edit a blog post | Admin |
| `DELETE`| `/api/blogs/:id` | Delete a blog post | Admin |

---

## 📄 License
This project is for educational and commercial wholesale use. All rights reserved.
