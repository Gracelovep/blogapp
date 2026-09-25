# BlogApp

A full-stack blog application: a Node.js/Express + MongoDB REST API with JWT authentication, and a React (Vite) single-page frontend. Anyone can read posts and search; registered users can create, edit, and delete their own posts from the home feed or their dashboard.

```
blog-app/
  backend/     Express + MongoDB API
  frontend/    React + Vite SPA
```

## Tech stack

- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT (jsonwebtoken), bcryptjs, express-validator
- **Frontend:** React 19, Vite, React Router, Axios
- **Suggested hosting:** Backend on Render (free web service) + MongoDB Atlas (free cluster) for the database; frontend on Vercel or Netlify

## Response format

Every API response follows the same envelope:

```jsonc
// success
{ "success": true, "data": { /* ... */ }, "message": "Optional success message" }

// failure
{ "success": false, "error": "Error message description" }
```

## API routes

**Auth** (`/api/auth`)

| Method | Route      | Access  | Description               |
|--------|-----------|---------|---------------------------|
| POST   | /register | Public  | Create an account, returns a JWT |
| POST   | /login    | Public  | Log in, returns a JWT     |
| GET    | /me       | Private | Get the current user      |

**Posts** (`/api/posts`)

| Method | Route         | Access            | Description                          |
|--------|--------------|-------------------|---------------------------------------|
| GET    | /             | Public            | List posts (`?search=`, `?page=`, `?limit=`) |
| GET    | /:id          | Public            | Get a single post                     |
| GET    | /user/me      | Private           | Get only the current user's posts     |
| POST   | /             | Private           | Create a post                         |
| PUT    | /:id          | Private (author)  | Update a post — 403 if you're not the author |
| DELETE | /:id          | Private (author)  | Delete a post — 403 if you're not the author |

Send the JWT as `Authorization: Bearer <token>` on private routes.

## Running locally

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI (a local mongod, or a free MongoDB Atlas cluster) and JWT_SECRET
npm install
npm run dev        # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL should point at the backend, e.g. http://localhost:5000/api
npm install
npm run dev         # http://localhost:5173
```

Register an account, then create, edit, delete, and search posts from the home page and your dashboard.

---

## Deploying

### Step 1 — Create a free MongoDB Atlas database

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free **M0** cluster.
3. Under **Database Access**, create a database user (username/password).
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   mongodb+srv://<gracelovepalmer_db_user>:<AnOgLmwKK9gNHzJ0>@cluster0.tbljcqw.mongodb.net/?appName=blogapp
   Fill in your real username/password and keep `/blogapp` as the database name.

### Step 2 — Deploy the backend to Render

1. Push this project to a GitHub repository.
2. Go to [render.com](https://render.com) → **New → Web Service** → connect your repo.
3. Render should detect `backend/render.yaml`. If asked, set the **root directory** to `backend`.
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables in Render's dashboard (the blueprint marks these as required):
   - `MONGO_URI` — your Atlas connection string from Step 1
   - `JWT_SECRET` — Render can auto-generate this (the blueprint sets `generateValue: true`), or set your own long random string
   - `CLIENT_ORIGINS` — the URL of your deployed frontend once you have it (e.g. `https://your-app.vercel.app`); you can update this after Step 3
5. Deploy. Once live, note your backend URL, e.g. `https://blog-app-backend.onrender.com`.
6. Confirm it's up: visit `https://<your-backend>.onrender.com/api/health` — you should see `{"success":true,"data":{"status":"ok"}}`.

> Render's free web services spin down after inactivity, so the first request after idle time can take ~30–60 seconds to wake up.

### Step 3 — Deploy the frontend

Pick either Vercel or Netlify (both included configs work out of the box):

**Vercel**
1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your repo.
2. Set the **root directory** to `frontend`.
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output directory `dist`.
4. Add environment variable `VITE_API_URL` = `https://<your-backend>.onrender.com/api`.
5. Deploy. Vercel gives you a URL like `https://your-app.vercel.app`.

**Netlify**
1. Go to [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → connect your repo.
2. Set the **base directory** to `frontend` (netlify.toml already sets the build command and publish directory).
3. Add environment variable `VITE_API_URL` = `https://<your-backend>.onrender.com/api`.
4. Deploy. Netlify gives you a URL like `https://your-app.netlify.app`.

### Step 4 — Close the loop on CORS

Go back to Render, update `CLIENT_ORIGINS` to your deployed frontend URL (comma-separate multiple origins if needed, e.g. local + prod), and redeploy the backend so it accepts requests from your live frontend.

---

## Project structure

```
backend/
  server.js                 entry point
  src/
    app.js                  Express app, CORS, route mounting
    config/db.js            Mongo connection
    models/User.js          User schema (bcrypt password hashing)
    models/Post.js           Post schema (text index for search)
    middleware/auth.js       JWT verification (protect)
    middleware/validate.js   express-validator error formatting
    middleware/errorHandler.js  central error handler -> {success:false,error}
    controllers/authController.js
    controllers/postController.js
    routes/authRoutes.js
    routes/postRoutes.js
    utils/                   ApiError, asyncHandler, sendResponse

frontend/
  src/
    api/client.js            axios instance + auth header + error normalization
    context/AuthContext.jsx  auth state, login/register/logout, persists JWT
    components/              Navbar, Modal, LoginModal, RegisterModal,
                              PostCard, PostFormModal, ConfirmDialog,
                              SearchBar, ProtectedRoute
    pages/Home.jsx            public feed, search, pagination, inline edit/delete for owned posts
    pages/Dashboard.jsx       your own posts, create/edit/delete
```
