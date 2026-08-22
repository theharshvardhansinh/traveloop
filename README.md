# 🌍 Traveloop — Personalized Travel Planning Platform

Traveloop is a full-stack travel planning web application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 📁 Project Structure

```
Traveloop-Project/
├── client/        # React frontend (Vite + Tailwind CSS)
├── server/        # Express backend (Node.js + MongoDB/Mongoose)
└── README.md
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally **or** a MongoDB Atlas connection string
- npm v9+

---

## 🚀 Getting Started

### 1. Clone / Open the project

```bash
cd Traveloop-Project
```

### 2. Set up the Server

```bash
cd server
npm install
```

Edit `server/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=replace_with_a_long_random_string
ADMIN_SECRET=replace_with_your_admin_secret
```

Start the server (development):

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

### 3. Set up the Client

```bash
cd client
npm install
```

Edit `client/.env` if needed (defaults point to local server):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The React app will be available at `http://localhost:5173`.

---

## 🔑 Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a regular user |
| POST | `/api/auth/admin/signup` | Register an admin (requires `adminSecret`) |
| POST | `/api/auth/login` | Login (user or admin) |
| POST | `/api/auth/admin/login` | Admin-specific login |
| GET  | `/api/auth/me` | Get current user (Bearer token required) |

---

## 🗃️ Database Design

15 Mongoose collections are defined in `/server/models/`:

`User`, `Follow`, `City`, `Activity`, `Trip`, `Stop`, `TravelSegment`, `Expense`, `PackingItem`, `TripNote`, `Post`, `Like`, `Comment`, `TrainBooking`, `HotelBooking`

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3 |
| Backend | Node.js, Express.js (CommonJS) |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios |

---

## 📝 Notes

- Both `/client` and `/server` have independent `package.json` and `.env` files.
- JWT tokens are stored in `localStorage` for simplicity.
- Admin signup is protected by a secret key defined in `server/.env` as `ADMIN_SECRET`.
- All other feature modules (trips, itinerary, bookings, social feed) will be built on top of the existing Mongoose models in future iterations.
