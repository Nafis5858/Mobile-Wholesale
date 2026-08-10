# Mobile Wholesale MERN App

This repository contains a MERN stack application for a wholesale mobile platform with registration, login, product browsing, and order placement.

## Structure
- `backend/` — Express, MongoDB, authentication, product, and order APIs
- `frontend/` — React app with login, register, product list, and order pages

## Run locally

### 1. Backend
1. Open a terminal in `backend/`
2. Copy `.env.example` to `.env`
3. Set `MONGODB_URI` if you want a remote database, or use the default local MongoDB URI
4. Run:
   ```bash
   npm install
   npm run dev
   ```

### 2. Frontend
1. Open a terminal in `frontend/`
2. Run:
   ```bash
   npm install
   npm start
   ```
3. Open `http://localhost:3000`

## Deployment options

### Option 1: Host backend on Railway / Render / Heroku
- Deploy `backend/` as a Node.js app
- Use the `backend/` folder as the service root
- Set `MONGODB_URI` and `JWT_SECRET` in service environment variables
- If Railway marks the app as "unexposed," make sure the service type is Node.js/HTTP and the app root is `backend/`
- Alternative: use the provided `render.yaml` for Render automatic service setup

### Option 2: Host frontend on Vercel / Netlify
- Deploy `frontend/` as a static React app
- Set `REACT_APP_API_URL` to the backend URL

### Option 3: Single-host with a combined deployment
- Build frontend with `npm run build`
- Serve from backend with Express static files (additional setup required)

## Next features implemented
- User registration and login with JWT
- Product catalog with order placement
- User order history page

## Notes
- Backend uses `mongodb://127.0.0.1:27017/mobile-wholesale` by default
- Frontend automatically stores JWT token in `localStorage`

---

## Detailed Deployment Guide (step-by-step)

This section expands on the quick deployment notes above and provides exact steps for a common, reliable deployment setup: MongoDB Atlas for the database, Railway (or Render/Heroku) for the backend, and Vercel for the frontend.

### 1) Prepare MongoDB Atlas
1. Sign in to https://cloud.mongodb.com and create a project and a cluster.
2. Go to **Database Access** → Add New Database User. Note the username (e.g., `nafiskamal2000`) and choose a strong password.
3. Go to **Network Access** → Add IP Address; for quick testing add `0.0.0.0/0` or click "Add Current IP Address" for local testing.
4. Copy the connection string and set the DB name to `mobile-wholesale`.

Example connection string (NO secrets here):
```
mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_HOST>/mobile-wholesale?retryWrites=true&w=majority
```

URL-encode the password when placing it into a connection URL (e.g. `@` → `%40`).

### 2) Configure backend environment
1. In the `backend/` folder create a `.env` file (DO NOT COMMIT this file):
```
MONGODB_URI=mongodb+srv://USER:ENCODED_PASSWORD@cluster-host/mobile-wholesale?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```
2. Install and test locally:
```bash
cd backend
npm install
npm run dev
```
3. Verify the health endpoint:
```bash
curl http://localhost:5000/api/health
```

### 3) Push the repository to GitHub
1. Create a new GitHub repository.
2. From project root:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-user>/<repo>.git
git push -u origin main
```

### 4) Deploy backend (Railway example)
Railway makes Node deployment straightforward.
1. Sign up at https://railway.app and connect your GitHub account.
2. Create a new project and select the repo, then select the `backend/` folder as the service root.
3. Add environment variables in Railway project settings:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Set the start command to `npm start` (already in `package.json`).
5. Deploy and note the backend URL (e.g., `https://your-backend.railway.app`).

Alternative hosts: Render, Heroku (use `Procfile`), DigitalOcean App Platform.

### 5) Deploy frontend to Vercel
1. Sign up at https://vercel.com and connect GitHub.
2. Import the repository and set the Project Root to `frontend/`.
3. Build Command: `npm run build`.
4. Output Directory: `build`.
5. In Vercel project settings add environment variable:
   - `REACT_APP_API_URL=https://your-backend-url/api`
6. Deploy and open the Vercel URL.

### 6) Post-deploy checks
- Register/login and confirm the frontend reads/writes to the backend.
- Check MongoDB Atlas to confirm collections and documents exist.
- If images/uploads are required to persist, consider using S3 or another object store instead of the local `uploads/` folder.

### 7) Optional: Containerize the backend
Use the provided `backend/Dockerfile` to build a container and deploy to any container host.

---

If you want, I can now prepare a pull request with the helper files or walk you through connecting the repo to Railway and Vercel step-by-step while you perform the account-based actions.
