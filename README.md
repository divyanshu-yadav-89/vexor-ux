# VexorUX 🚀

> **Digital Products & Creative Engineering**  
> High-performance web applications, bespoke digital experiences, and interactive 3D interfaces engineered for growth and clarity. Built and maintained by **Divyanshu Yadav**.

---

## 🌟 Overview

**VexorUX** is a modern, high-converting digital agency and creative engineering platform. It pairs sleek, responsive design with interactive 3D WebGL visuals, real-time cost estimation, an integrated command palette (`⌘K`), and an Express/MongoDB backend to handle inquiries and client briefs.

---

## ✨ Features

### 🎨 Frontend & Experience
* **Interactive 3D Visuals (Three.js):** Custom WebGL canvas featuring interactive wireframe meshes, particle effects, smooth rotation, and dynamic mouse tracking with performance mode support.
* **Cost Calculator / Project Estimator:** Live pricing estimator allowing potential clients to calculate estimates based on scope, feature sets, and design complexity.
* **Quick Actions Command Palette (`Ctrl+K` / `⌘K`):** Keyboard-accessible quick navigation dialog for fast actions across sections.
* **Project Booking & Inquiry Modal:** Seamless onboarding modal to collect detailed scope briefs with instant backend synchronization.
* **Modern Responsive UI:** Glassmorphic navigation, sticky scroll indicators, interactive FAQs, and mobile drawer navigation.

### ⚙️ Backend & API
* **Node.js + Express REST API:** Lightweight, modular, and performant backend service.
* **MongoDB with Mongoose:** Schema-validated inquiry storage (`Inquiry` model) tracking client contacts, project specifications, timelines, and budgets.
* **Health Check & Diagnostic Endpoint:** Real-time uptime monitoring via `/api/health`.
* **CORS & Environment Configuration:** Safe cross-origin requests configured via `.env`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Modern CSS3 (Custom variables, Glassmorphism, Flex/Grid), Vanilla JavaScript (ES6+) |
| **3D Graphics** | [Three.js](https://threejs.org/) |
| **Typography** | Plus Jakarta Sans, Space Grotesk, JetBrains Mono |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| **Dev Tools** | Nodemon, Dotenv, Git |

---

## 📁 Project Structure

```text
VEXOR.UX/
├── index.html              # Main landing page & application UI
├── css/
│   └── style.css           # Design system, themes, and responsive styles
├── js/
│   ├── app.js              # Application logic, calculator, modals & API bindings
│   └── threeScene.js       # Three.js 3D background animation & controls
├── backend/
│   ├── models/
│   │   └── Inquiry.js      # Mongoose schema for client leads & inquiries
│   ├── .env.example        # Template for backend environment variables
│   ├── package.json        # Backend dependencies & npm scripts
│   └── server.js           # Express API server & database connection
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

---

### 1. Clone the Repository
```bash
git clone https://github.com/divyanshu-yadav-89/vexor-ux.git
cd vexor-ux
```

---

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment configuration file:
   ```bash
   cp .env.example .env
   ```
4. Configure `.env` with your values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/vexorux
   FRONTEND_URL=*
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The API will start at `http://localhost:5000`.*

---

### 3. Frontend Setup
Because the frontend is built with standard web technologies, no build step or bundler is required:

* **Option A (VS Code Live Server):** Right-click `index.html` and select **"Open with Live Server"**.
* **Option B (Static Server):**
  ```bash
  # From project root
  npx serve .
  ```
* **Option C:** Simply open `index.html` directly in any modern web browser.

---

## 🔌 API Reference

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "uptime": 124.5,
  "timestamp": "2026-09-11T12:00:00.000Z"
}
```

### Submit Project Inquiry
```http
POST /api/inquiries
```
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Alex Smith",
  "email": "alex@example.com",
  "company": "Acme Inc",
  "projectType": "Full Web Application",
  "budget": "$5k-$10k",
  "timeline": "4-6 weeks",
  "message": "We need a custom dashboard with 3D product visualization."
}
```

---

## 👤 Author

* **Divyanshu Yadav**
* GitHub: [@divyanshu-yadav-89](https://github.com/divyanshu-yadav-89)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
