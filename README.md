# 🚀 Company Registry Lite

A full stack company management and filing system built with a modern cloud native architecture.

<img width="1708" height="972" alt="Screenshot 2026-03-03 at 20 27 00" src="https://github.com/user-attachments/assets/55a6234d-2ce7-4f64-9504-9894f9c77e80" />


🔗 **Live Demo:** https://company-registry-lite.vercel.app/

🖥 **Frontend:** Vercel  

⚙️ **Backend:** Render  

🗄 **Database:** Neon (PostgreSQL)

---

## 📖 Overview

Company Registry Lite is a simplified Companies House style system that allows users to:

- Securely register and log in (JWT authentication)
- Create and manage companies
- Manage company officers
- Upload filings
- Track audit logs
- Interact with a fully relational PostgreSQL database

---

## 🛠 Tech Stack


### Frontend
- **Next.js (App Router)**
- TypeScript
- Zustand for Global State Management
- Debounce
- Hosted on **Vercel**

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Bcrypt password hashing
- Multer (for file uploads)
- Hosted on **Render**

### Database
- PostgreSQL
- Hosted on **Neon**
- Normalised relational schema
- Foreign key constraints
- Indexed query paths

---

## 🔐 Authentication

- JWT based authentication
- Secure password hashing with bcrypt
- Protected backend routes via middleware
- Token based authorization flow

---

## ✨ Features

- User registration & login
- Company CRUD operations
- Officer management
- Filing uploads
- Audit logging system
- Relational data integrity
- Indexed database queries

---

# 💻 Local Development Setup

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/scottpickering31/company-registry-lite.git
cd company-registry-lite
```

---

# ⚙️ Backend Setup

Navigate to backend:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/company_registry
JWT_SECRET=your_JWT_secret_key
```

Start backend:

```bash
npm run devStart
```

Backend runs at:

```
http://localhost:3001
```

---

# 🎨 Frontend Setup

Navigate to frontend:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

## Database (Neon)

- Managed PostgreSQL
- SSL-enabled connection
- Connection string stored securely in Render environment variables
---

# 🔄 CI/CD

Deployment pipeline:

- Push to `main`
- Vercel auto deploys frontend
- Render auto deploys backend

Optional improvements:
- GitHub Actions for testing
- Docker image builds
- Linting & test pipelines

---

# 📈 Future Improvements

- Role based access control
- Refresh tokens
- Rate limiting
- Cloud file storage (AWS S3)
- Advanced filtering & search
- Unit & integration testing
- Docker Compose for full local stack

---

# 🧠 What This Project Demonstrates

- Full stack architecture design
- Secure authentication implementation
- PostgreSQL schema modelling
- Cloud deployment strategy
- Environment configuration management
- Production ready patterns

---

# 👨‍💻 Author

**Scott Pickering**  
Full-Stack JavaScript Developer

---
