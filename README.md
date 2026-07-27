# 📰 api-news

A full-stack news blog built with **Node.js**, **Express**, and **MySQL**. It provides a complete article management system with JWT authentication, session handling, and media uploads.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| Database | MySQL via Sequelize ORM |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Sessions | express-session + cookie-parser |
| File Uploads | Multer |
| Utilities | Moment.js, Slugify, CORS, dotenv |
| Dev | Nodemon |

---

## 📁 Project Structure

```
api-news/
├── app.js                  # Application entry point
├── .env                    # Environment variables
├── package.json
├── config/                 # Configuration (DB, etc.)
├── controllers/            # Route business logic
├── middlewares/            # Express middlewares (auth, etc.)
├── models/                 # Sequelize models
└── routes/                 # Route definitions
```

---

## ⚙️ Installation

### Prerequisites

- Node.js >= 16
- MySQL >= 5.7

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/frasasu/api-news.git
cd api-news

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env .env.local
# then edit .env with your values
```

---

## 🔧 Configuration (`.env`)

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourdbpassword
DB_NAME=dbname
DB_LOGGING=false

JWT_SECRET=yoursecretjwt
SESSION_SECRET=secretforsessions
```

Create the MySQL database before starting:

```sql
CREATE DATABASE dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## ▶️ Running the App

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔐 Authentication

The project uses a dual security layer:

- **JWT** for stateless API calls
- **Express sessions** for browser-side cookie management
- **bcryptjs** for password hashing

---

## 📦 Main Dependencies

```json
{
  "express": "^4.18.2",
  "sequelize": "^6.32.1",
  "mysql2": "^3.6.0",
  "jsonwebtoken": "^9.0.1",
  "bcryptjs": "^2.4.3",
  "express-session": "^1.17.3",
  "multer": "^1.4.5-lts.1",
  "ejs": "^3.1.9",
  "slugify": "^1.6.6",
  "moment": "^2.29.4"
}
```

---

## 👤 Author

**François** — [@frasasu](https://github.com/frasasu)
Institut de Statistique Appliquée, Université du Burundi

---

## 📄 License

This project is developed for educational and experimental purposes.
