<div align="center">

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

# 🏢 BariBhara - Frontend (Client App)

### The User Interface for Smart Rental Management

<div align="center">
  <a href="https://baribhara.vercel.app/">
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deployed on Vercel" />
  </a>
</div>

<p align="center">
  A highly responsive, animated, and installable Progressive Web App (PWA) built for Landlords, Tenants, and Admins to manage properties effortlessly — now with Biometric Login (WebAuthn).
</p>

</div>

---

## 📖 Introduction

Welcome to the **BariBhara Frontend Repository**. This client-side application is built using **React 19** and **Vite** to ensure blazing-fast performance. It connects to the BariBhara Node.js backend to deliver a seamless real estate management experience.

## ✨ Key Features

- 🏠 **Interactive Marketplace:** Infinite scrolling, dynamic search, and filtering for rental units.
- 📱 **Progressive Web App (PWA):** Installable on mobile and desktop with offline caching and home screen shortcut.
- 🔐 **Biometric Login (WebAuthn):** Fingerprint and Face ID login support — no password needed after initial setup.
- 🪪 **NID OCR Scanner:** Camera-based National ID scanning with auto-fill for tenant registration.
- 📄 **Digital Lease Agreements:** Generate, sign, and download PDF rental agreements digitally.
- 💰 **Tax-Ready PDF Reports:** Annual income & expense reports downloadable as PDFs for landlords.
- 🔔 **Real-Time Notifications:** Live updates via WebSockets (Socket.io) for maintenance, rent, and chats.
- 📊 **Dynamic Dashboards:** Dedicated dashboards for Admins, Landlords, and Tenants with interactive charts.
- 🌙 **Modern UI/UX:** Styled with custom CSS system and Material Symbols icons.

## ⚙️ Tech Stack

| Category | Technology |
|---|---|
| **Core** | React 19, Vite, TypeScript |
| **State Management** | Zustand, TanStack React Query |
| **Routing** | React Router DOM v6 |
| **Real-Time** | Socket.io-client |
| **Authentication** | JWT + WebAuthn (`@simplewebauthn/browser`) |
| **PDF & Reports** | Client-side PDF download via API |
| **PWA** | `vite-plugin-pwa`, Service Worker |
| **Icons** | Lucide React, Google Material Symbols |

## 📁 Project Structure

```bash
client/
├── public/                 # Static assets (PWA icons, manifest)
├── src/
│   ├── api/                # Axios API service calls
│   ├── components/         # Reusable UI components
│   │   ├── common/         # InstallPWA, NIDScanner, SEOHead
│   │   ├── modals/         # AddUnit, EditUnit, AssignTenant, etc.
│   │   └── layout/         # Sidebar, Topbar, Navbar
│   ├── Hook/               # Custom hooks (useAuth, usePWA, usePushNotifications)
│   ├── pages/              # Role-based pages
│   │   ├── admin/          # Admin Dashboard
│   │   ├── tenant/         # Tenant Portal
│   │   └── ...             # Login, Settings, Reports, Properties
│   ├── store/              # Zustand stores (useAuthStore, useTenantAuthStore)
│   ├── schemas/            # Zod validation schemas
│   ├── App.tsx             # Main Router & Layout
│   ├── main.tsx            # React root & Provider wrapping
│   └── sw.ts               # Service Worker for PWA & Push Notifications
├── .env                    # Environment variables
└── vite.config.ts          # Vite & PWA plugin configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- The BariBhara Server (Backend) running locally or remotely.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CodeCommandBD/BariBhara-Client.git
   cd BariBhara-Client
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env

   # Development
   VITE_API_URL=
   
   # Production (Uncomment when deploying)
   # VITE_API_URL=https://your-backend-api.com
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`*

## 🛠️ Build for Production
```bash
npm run build
```

## 🔐 Biometric Login (WebAuthn) Setup

1. Log in with email & password
2. Go to **Settings → বায়োমেট্রিক লগইন**
3. Click **"👆 ফিঙ্গারপ্রিন্ট সেটআপ করুন"** and follow the browser prompt
4. Next time, just enter your email on the login page and click the **fingerprint button** 🟢

## 🌿 Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `clientdev` | Active development branch |
