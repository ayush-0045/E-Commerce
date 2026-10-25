# 💎 Gahana Luxury Jewelry — Intelligent Full-Stack E-Commerce Platform

An enterprise-grade, luxury e-commerce web platform engineered for precious jewelry and bridal collections. Features an applied **Vector Similarity Recommendation Engine**, **Dynamic Bullion Pricing Model**, **BIS Hallmarking Standards**, and a **Resilient Dual-Mode Data Layer**.

---

## 🏛️ System Architecture

```
                                  [ Client Layer ]
                     React 19 • Redux Toolkit • Material-UI (Luxury Slate)
                                          │
                               (RESTful JSON Protocol)
                                          │
                                 [ Application Layer ]
                             Node.js • Express Framework
                      ┌───────────────────┴───────────────────┐
                      ▼                                       ▼
             [ Core Commerce Services ]             [ AI / ML Services ]
          • User Auth & RBAC (JWT/Cookie)      • Attribute Vector Extraction
          • Catalog & Multi-Facet Filtering    • Cosine Similarity Scoring
          • Dynamic Order Fulfillment Pipeline • Bullion Spot Rate Engine
          • 3% GST & Making Charge Breakdown
                      │
                      ▼
              [ Persistence Layer ]
        Resilient Dual-Mode Data Engine:
     MongoDB Atlas / Local Embedded Datastore
```

---

## 🧠 Applied AI / Machine Learning Features

### 1. Vector Similarity Recommendation Engine
* **Feature Vector Representation:** Maps jewelry specifications across 6 normalized continuous & categorical dimensions:
  $$\vec{v} = \left[ w_{\text{metal}}, \, w_{\text{purity}}, \, w_{\text{gem}}, \, c_{\text{cat}}, \, \log_{10}(P), \, \frac{W_{\text{grams}}}{50} \right]$$
* **Cosine Similarity Scoring:** Evaluates design likeness between catalog items:
  $$\text{Similarity}(\vec{A}, \vec{B}) = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \cdot \sqrt{\sum_{i=1}^n B_i^2}}$$
* **Endpoint:** `GET /api/products/:id/similar` returns ranked recommendations with match confidence scores.

### 2. Algorithmic Bullion & GST Pricing Engine
Calculates real-time jewelry retail valuations adhering to Indian precious metal commerce standards:
$$\text{Retail Price} = \Big[ (\text{Weight in grams} \times \text{Purity Spot Rate}) + \text{Gemstone Value} + \text{Making Charges} \Big] \times (1 + \text{GST}_{3\%})$$

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Redux Toolkit, React Router 7, Material-UI 7, Recharts, Formik, Yup |
| **Backend** | Node.js (ESM), Express 4, JWT, bcryptjs, Morgan |
| **Data Engine** | Dual-Mode: MongoDB / Mongoose 8 + Embedded Persistent Engine (`@seald-io/nedb`) |
| **Styling** | Custom Luxury Dark Slate (`#141414`), Brushed Gold (`#D4AF37`), Playfair Display Typography |
| **Compliance** | 100% BIS Hallmarking badges, 3% Indian GST tax computations, Indian Rupee (`en-IN`) formatting |

---

## 📁 Repository Directory Structure

```
E-Commerce/
├── backend/
│   ├── config/              # Database failover & environment configs
│   ├── controllers/         # Auth, Product, Order, and Bullion controllers
│   ├── middleware/          # JWT authentication & role-based access guards
│   ├── models/              # Mongoose database schemas
│   ├── routes/              # RESTful API route definitions
│   ├── services/
│   │   ├── embeddedDb.js    # Resilient local persistent data store & catalog seeder
│   │   └── mlRecommendationEngine.js  # Vector similarity & cosine scoring model
│   ├── server.js            # Express server entry point
│   └── start.js             # Environment loader & bootstrapper
├── frontend/
│   ├── public/              # Brand assets, favicon.svg, and metadata
│   └── src/
│       ├── components/      # Luxury Header, Footer, HeroSlider, Route Guards
│       ├── features/        # Redux slices (Auth, Cart, Orders, Products)
│       ├── pages/           # Storefront, Shop, Product, Checkout, Account
│       │   ├── admin/       # Fulfillment & Product Management Dashboards
│       │   └── legal/       # Privacy Policy and Terms & Conditions
│       ├── utils/           # Indian Rupee (`en-IN`) currency & GST breakdown utilities
│       └── store.js         # Redux Toolkit store with persistence
├── .gitignore               # Multi-tier gitignore protecting secrets & dependencies
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ (tested on Node v24 LTS)
* npm or yarn

### 1. Installation

Clone the repository:
```bash
git clone https://github.com/ayush-0045/E-Commerce.git
cd E-Commerce
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install --legacy-peer-deps
```

### 2. Environment Configuration

Create a `.env` file in `/backend` (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/gahana-jewelry
JWT_SECRET=your_secure_jwt_secret_token_here
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
FRONTEND_URL=http://localhost:3000
```

> **Zero-Setup Database:** If a remote or local MongoDB instance is not detected, the backend automatically boots an embedded persistent database engine with catalog data pre-seeded.

### 3. Run the Development Servers

Start the Backend API (Port 5000):
```bash
cd backend
npm run dev
```

Start the Frontend Application (Port 3000):
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 🔐 Credentials for Testing

* **Admin Portal (`/admin`):**
  * Email: `admin@gahanajewelry.com`
  * Password: `Admin@12345`
* **Customer Account (`/login`):**
  * Email: `ayush@example.com`
  * Password: `User@12345`

---

## 📜 Legal & Compliance Pages
* **Privacy Policy:** `/privacy-policy` (Data protection, 256-bit SSL, grievance redressal)
* **Terms & Conditions:** `/terms-and-conditions` (BIS hallmarking, bullion valuation, 15-day return policy)

---

## 📄 License
This project is licensed under the MIT License.
