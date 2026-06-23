#  AI PDF Summarizer

A full-stack AI-powered PDF summarization application built with **Node.js**, **Express**, **PostgreSQL**, **Google Gemini API**, and **React (Vite)**.

---

## 📁 Project Structure

```
ai-pdf-summarizer/
├── backend/                        # Node.js + Express REST API
│   ├── config/db.js                # PostgreSQL connection pool
│   ├── controllers/                # Route handler logic
│   │   ├── authController.js       # Register, login, profile
│   │   ├── pdfController.js        # PDF upload & text extraction
│   │   └── summaryController.js    # AI summarization logic
│   ├── middleware/                 # Express middleware
│   │   ├── authMiddleware.js       # JWT verification guards
│   │   └── uploadMiddleware.js     # Multer file upload config
│   ├── models/                     # Database schema (auto-migration)
│   │   ├── User.js                 # Users table definition
│   │   └── Summary.js              # Summaries table definition
│   ├── routes/                     # Express route definitions
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── pdfRoutes.js            # /api/pdf/*
│   │   └── summaryRoutes.js        # /api/summary/*
│   ├── services/                   # External service integrations
│   │   ├── geminiService.js        # Google Gemini AI summarization
│   │   └── notificationService.js  # Email notifications (Nodemailer)
│   ├── .env                        # Environment variables (not committed)
│   ├── package.json
│   └── server.js                   # Express app entry point
│
├── frontend/                       # React + Vite SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── UploadCard.jsx
│   │   │   └── SummaryCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/api.js         # Axios API client
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🚀 Features

- 📄 **PDF Upload & Text Extraction** — Upload PDF files; text extracted server-side via `pdf-parse`
- 🤖 **AI Summarization** — Google Gemini API generates concise summaries
- 🔐 **JWT Authentication** — Register, login, token-based session management
- 👤 **Role-Based Access** — User & Admin roles with protected routes
- 📧 **Email Notifications** — Nodemailer sends summary-ready emails
- 🗃️ **PostgreSQL Storage** — Summaries stored with rating & feedback support
-  **Admin Panel** — Manage users and view all summaries

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Axios               |
| Backend   | Node.js, Express.js                 |
| Database  | PostgreSQL (via `pg` driver)        |
| AI        | Google Gemini API                   |
| Auth      | JWT (jsonwebtoken), bcryptjs        |
| Upload    | Multer                              |
| Email     | Nodemailer                          |

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Google Gemini API Key

### Backend

```bash
cd backend
npm install
# Edit .env with your credentials
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)

```env
PORT=5000
DATABASE_URL=postgresql://localhost:5432/aipdfdb
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Description         | Protected |
|--------|-----------------------|---------------------|-----------|
| POST   | `/api/auth/register`  | Register new user   | No        |
| POST   | `/api/auth/login`     | Login & get token   | No        |
| GET    | `/api/auth/profile`   | Get user profile    | Yes       |

### PDF
| Method | Endpoint        | Description            | Protected |
|--------|-----------------|------------------------|-----------|
| POST   | `/api/pdf/upload` | Upload PDF & summarize | Yes     |

### Summary
| Method | Endpoint                    | Description              | Protected |
|--------|-----------------------------|--------------------------|-----------|
| GET    | `/api/summary/all`          | Get user's summaries     | Yes       |
| GET    | `/api/summary/:id`          | Get single summary       | Yes       |
| POST   | `/api/summary/:id/feedback` | Submit rating & feedback | Yes       |
| DELETE | `/api/summary/:id`          | Delete summary           | Yes       |

---

## 📄 License

MIT © 2024 — AI PDF Summarizer
