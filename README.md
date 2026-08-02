# 🎥 VidTube Backend

A scalable RESTful backend for a video-sharing platform built with **Node.js**, **Express.js**, and **MongoDB**. The project provides secure authentication, video management, user interactions, and social features while following a clean MVC architecture.

---

## 🚀 Features

- 🔐 JWT Authentication (Access & Refresh Tokens)
- 👤 User Registration & Login
- 🔒 Password Hashing with bcrypt
- 🍪 Secure Cookie-based Authentication
- 📸 Avatar & Cover Image Uploads (Cloudinary)
- 🎥 Video Upload & Management
- ❤️ Like/Unlike Videos
- 💬 Comment System
- 📝 Tweet CRUD Operations
- 📂 Playlist Management
- 🔔 Channel Subscription System
- 📊 Dashboard APIs
- 🔍 Search, Filtering & Pagination
- 📈 MongoDB Aggregation Pipelines
- 📁 File Uploads using Multer
- ⚡ Centralized Error Handling
- 🏗️ Modular MVC Architecture

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Cloudinary | Media Storage |
| Multer | File Upload |
| Postman | API Testing |

---

## 📂 Project Structure

```
.
├── public/
├── src/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

---

## 📦 Installation

Clone the repository

```bash
git clone https://github.com/LaFLAME-hub/vid-backend.git
```

Navigate into the project

```bash
cd vid-backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file in the root directory and add the required environment variables.

Start the development server

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file and configure the following variables:

```env
PORT=

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGIN=
```

---

## 📚 API Modules

- Authentication
- Users
- Videos
- Comments
- Likes
- Playlists
- Subscriptions
- Tweets
- Dashboard

---

## 🔒 Security Features

- JWT Authentication
- Refresh Token Mechanism
- Password Hashing using bcrypt
- Protected Routes
- Cookie-based Authentication
- Input Validation
- Centralized Error Handling

---

## 🏛️ Architecture

- RESTful API Design
- MVC Architecture
- Modular Folder Structure
- MongoDB Aggregation Pipelines
- Cloudinary Media Storage
- Middleware-based Authentication

---

## 🧪 API Testing

The APIs were tested using **Postman**.

---

## 📌 Future Improvements

- Frontend Integration (React.js)
- Video Streaming
- Real-time Notifications
- Unit & Integration Testing
- Docker Support
- CI/CD Pipeline

---

## 👨‍💻 Author

**Harshit Anand**

GitHub: https://github.com/LaFLAME-hub

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.