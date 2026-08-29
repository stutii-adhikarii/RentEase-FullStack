<div align="center">

# 🏠 RentEase

### A Full-Stack Landlord–Tenant Portal

RentEase connects landlords and tenants on a single platform  post and browse listings, send applications, message directly, and manage the rental process end to end, without the back-and-forth of emails and spreadsheets.

<br>

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MERN](https://img.shields.io/badge/Stack-MERN-4B0082?style=for-the-badge)

</div>

---

## 📖 About

RentEase is a full-stack MERN application built to simplify communication and coordination between landlords and tenants. Instead of scattering property inquiries across calls, emails, and third-party listing sites, RentEase brings the entire workflow listing, applying, and messaging into one place.

The project was built by a small team as a full-stack exercise in designing a real-world two-sided platform: two distinct user roles (landlord and tenant), a shared data model, a REST API, and a responsive client that adapts to both.

---

## ✨ Features

- 🔑 User authentication for landlords and tenants
- 🏘️ Property listing creation and management (landlord)
- 🔍 Property browsing and search (tenant)
- 📝 Rental application submission and tracking
- 💬 In-app messaging between landlords and tenants
- 📄 Role-based dashboards
- 📱 Responsive UI across devices
- 🔒 Secure REST API with protected routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, JavaScript, CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT-based authentication |
| **Tooling** | Git, GitHub, npm, VS Code |

---

## 📂 Project Structure

```text
RentEase-FullStack/
│
├── backend/
│   ├── config/          # DB connection & environment setup
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & error handling
│   └── server.js        # App entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level views
│   │   ├── context/     # Global state (auth, user role, etc.)
│   │   └── App.js
│   └── package.json
│
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/) (local instance or a MongoDB Atlas cluster)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/stutii-adhikarii/RentEase-FullStack.git
cd RentEase-FullStack
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm start
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm start
```

The app should now be running at `http://localhost:3000`, with the API served from `http://localhost:5000`.

---

## 🖼️ Screenshots

> Add screenshots of the landlord dashboard, tenant dashboard, listings page, and messaging UI here once available.

| Landlord Listing | Tenant Dashboard |
|---|---|
| _screenshot here_ | _screenshot here_ |

| Listings Page | Messaging |
|---|---|
| _screenshot here_ | _screenshot here_ |

---

## 🗺️Future Improvements

- [ ] Email notifications for new applications/messages
- [ ] Payment integration for rent collection
- [ ] Document upload (lease agreements, ID verification)
- [ ] Ratings & reviews for landlords/tenants
- [ ] Admin panel for platform oversight
- [ ] Search filters (price range, location, amenities)
- [ ] Deployment (e.g. Render/Vercel + MongoDB Atlas)

---

## 👥 Team

RentEase was built collaboratively as a group full-stack project.

|     Member      |             Role / Contribution          |
|-----------------|------------------------------------------|
| Stuti Adhikari  | Backend — Auth & API routes              |
| Kritika Basel   | Frontend — Landlord dashboard            |
| Sabin Paudel    | Frontend — Tenant dashboard & messaging  |
| Smarika Mainali | Database schema design & integration     |

---

## 📄 License

This project is open for academic and portfolio purposes.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

</div>
