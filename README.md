# Mobile Wholesale

A full-stack wholesale e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). Designed for mobile phone distributors and retail shop owners to manage inventory, browse bulk stock, and place wholesale orders.

---

## Features

### For Buyers:
- **User Authentication:** Sign up and log in using JWT tokens with hashed passwords (bcrypt).
- **Product Catalog:** View available phones, brands, wholesale prices, and live stock levels.
- **Product Details & MOQ:** Detailed product specifications with Minimum Order Quantity (MOQ) validation.
- **Cart & Checkout:** Add multiple items to cart, adjust quantities, and checkout with delivery address and phone number.
- **Order Tracking:** View order status history (`pending`, `confirmed`, `shipped`, `delivered`, `rejected`).
- **Customer Reviews:** Leave 1-5 star ratings and reviews on confirmed orders.
- **WhatsApp Support:** Direct WhatsApp chat integration for quick wholesale inquiries.

### For Admins:
- **Product Management:** Add, edit, and delete products (name, brand, description, price, stock, MOQ, and photos).
- **Gallery Management:** Upload and manage inventory photos for the showcase gallery.
- **Blog / News:** Post and update industry news and market announcements.
- **Order Management:** View all incoming buyer orders and approve or reject them.
- **Site Settings:** Update contact email, phone number, physical address, and WhatsApp contact number.
- **Live Stock List:** Quick overview of all inventory in stock.

---

## Tech Stack

- **Frontend:** React.js, React Router v6, Axios, Context API, Vanilla CSS (Dark Theme)
- **Backend:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB & Mongoose
- **Image Storage:** Cloudinary (with local storage fallback)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/Nafis5858/Mobile-Wholesale.git
cd Mobile-Wholesale
```

### 2. Backend Setup
1. Move to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/mobile-wholesale
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ADMIN_EMAIL=nafis.kamal.2000@gmail.com
   ADMIN_PASSWORD=your_admin_password
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and move to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will open at `http://localhost:3000`.

---

## Deployment on Render

1. Connect the GitHub repo to Render as a **Web Service**.
2. Settings:
   - **Root Directory:** `.`
   - **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command:** `npm start`
3. Add the following Environment Variables in your Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NODE_ENV=production`

In production, Express serves the built React app from `frontend/build` while handling all API routes.

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a buyer account
- `POST /api/auth/login` - Login user or admin
- `PUT /api/auth/profile` - Update buyer profile (auth required)

### Products
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Add product (admin only)
- `PUT /api/products/:id` - Edit product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders/checkout` - Checkout cart items
- `GET /api/orders/my-orders` - Get buyer's orders
- `GET /api/orders/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `POST /api/orders/:orderId/review` - Leave review on confirmed order
- `GET /api/orders/reviews/all` - Get all customer reviews

### Gallery & Blog
- `GET /api/admin/gallery` - Get gallery images
- `POST /api/admin/gallery` - Add gallery photo (admin only)
- `PUT /api/admin/gallery/:id` - Edit gallery photo (admin only)
- `DELETE /api/admin/gallery/:id` - Delete gallery photo (admin only)
- `GET /api/blogs` - Get blogs
- `POST /api/blogs` - Create blog post (admin only)
- `PUT /api/blogs/:id` - Edit blog post (admin only)
- `DELETE /api/blogs/:id` - Delete blog post (admin only)

### Site Settings
- `GET /api/admin/site` - Get site contact info
- `PUT /api/admin/site/contact` - Update contact info (admin only)

---

## Author
Developed by **Nafis Kamal** for the CSE391 Project at BRAC University.
