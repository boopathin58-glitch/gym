# 💪 GymPro — Full Stack Gym Management Platform

A complete gym management system with **React** frontend, **Node.js/Express** backend, **MongoDB** database, **JWT** auth, **Google OAuth**, and role-based dashboards for **Members** and **Trainers**.

---

## 🗂️ Project Structure

```
gympro/
├── backend/          ← Node.js + Express REST API
│   ├── src/
│   │   ├── server.js          ← Entry point
│   │   ├── config/db.js       ← MongoDB connection
│   │   ├── models/            ← User, Membership, WorkoutPlan, Progress, ClassSchedule
│   │   ├── controllers/       ← auth, user, progress, membership, workout, analytics, class
│   │   ├── routes/            ← All API routes
│   │   └── middleware/        ← JWT auth + role authorization
│   └── .env                   ← Backend environment variables
│
└── frontend/         ← React 18 SPA
    ├── src/
    │   ├── App.jsx            ← Router + GoogleOAuthProvider
    │   ├── context/AuthContext.jsx  ← Global auth state
    │   ├── utils/api.js       ← Axios with JWT auto-refresh
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── MemberDashboard.jsx  ← Overview, Classes, Workout, Progress, Membership, Profile
    │   │   └── TrainerDashboard.jsx ← Overview, Clients, Schedule, Earnings, Classes, Profile
    │   └── components/
    │       └── DashboardLayout.jsx  ← Sidebar + top nav
    └── .env                   ← REACT_APP_GOOGLE_CLIENT_ID
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google OAuth Client ID

### 2. Backend Setup
```bash
cd backend
npm install
# Edit .env — add your MONGO_URI, JWT secrets, Google credentials
npm run dev        # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Edit .env — add your REACT_APP_GOOGLE_CLIENT_ID
npm start          # Starts on http://localhost:3000
```

---

## 🔑 Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add authorized origins: `http://localhost:3000`
5. Add authorized redirect URIs: `http://localhost:3000`
6. Copy **Client ID** → paste in both `.env` files

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register member or trainer |
| POST | `/api/auth/login` | ❌ | Email/password login |
| POST | `/api/auth/google` | ❌ | Google OAuth login |
| POST | `/api/auth/refresh-token` | ❌ | Refresh JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/logout` | ✅ | Logout |
| POST | `/api/auth/forgot-password` | ❌ | Send OTP |
| POST | `/api/auth/reset-password` | ❌ | Reset with OTP |
| GET | `/api/users/profile` | ✅ | Get profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| GET | `/api/users/notifications` | ✅ | Get notifications |
| GET | `/api/users/dashboard/member` | ✅ | Member dashboard data |
| GET | `/api/users/dashboard/trainer` | ✅ | Trainer dashboard data |
| GET | `/api/users/trainer/clients` | ✅ Trainer | Get trainer's clients |
| GET | `/api/users/trainers` | ✅ | List all trainers |
| GET | `/api/progress/summary` | ✅ | Progress summary |
| POST | `/api/progress/log` | ✅ | Log progress |
| GET | `/api/progress/history` | ✅ | Progress history |
| GET | `/api/membership/my` | ✅ | Get my membership |
| POST | `/api/membership/subscribe` | ✅ | Subscribe to plan |
| DELETE | `/api/membership/cancel` | ✅ | Cancel membership |
| GET | `/api/workouts/weekly-plan` | ✅ | Get weekly workout plan |
| POST | `/api/workouts/create` | ✅ | Create workout plan |
| GET | `/api/classes` | ❌ | List all classes |
| POST | `/api/classes` | ✅ Trainer | Create class |
| POST | `/api/classes/:id/book` | ✅ | Book a class |
| DELETE | `/api/classes/:id/cancel` | ✅ | Cancel booking |
| GET | `/api/analytics/workouts` | ✅ | Workout analytics |

---

## 🔐 Auth Roles

| Role | Access |
|------|--------|
| `member` | Dashboard, classes, workout plans, progress, membership |
| `trainer` | Client management, schedules, earnings, class creation |
| `admin` | Full access (all routes) |

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gympro
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (`frontend/.env`)
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=http://localhost:5000/api
```
