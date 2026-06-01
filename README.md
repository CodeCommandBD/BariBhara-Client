<div align="center">

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
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
  A highly responsive, animated, and installable Progressive Web App (PWA) built for Landlords, Tenants, and Admins to manage properties effortlessly.
</p>

</div>

---

## 📖 Introduction

Welcome to the **BariBhara Frontend Repository**. This client-side application is built using **React 18** and **Vite** to ensure blazing-fast performance. It connects to the BariBhara Node.js backend to deliver a seamless real estate management experience.

## ✨ Key Features

- 🏠 **Interactive Marketplace:** Infinite scrolling, dynamic search, and filtering for rental units.
- 📱 **Progressive Web App (PWA):** Installable on mobile and desktop with offline caching support.
- 🔔 **Real-Time Notifications:** Live updates via WebSockets (Socket.io) for maintenance, rent, and chats.
- 📊 **Dynamic Dashboards:** Dedicated dashboards for Admins, Landlords, and Tenants with interactive charts.
- 🌙 **Modern UI/UX:** Styled with Tailwind CSS and animated using Framer Motion.
- 📄 **PDF Viewing & Downloads:** Seamless viewing and downloading of digital rental invoices.

## ⚙️ Tech Stack

- **Core:** React.js, Vite
- **Styling:** Tailwind CSS, Radix UI, Framer Motion
- **State Management:** Zustand, React Query (TanStack)
- **Routing:** React Router DOM v6
- **Real-Time:** Socket.io-client
- **Icons & Assets:** Lucide React, React Icons

## 📁 Project Structure

```bash
client/
├── public/                 # Static assets (PWA icons, etc.)
├── src/
│   ├── api/                # Axios instances and API service calls
│   ├── assets/             # Images and local styles
│   ├── components/         # Reusable UI components (Modals, Cards, Navbars)
│   ├── Hook/               # Custom React hooks (usePWA, useAuth, usePushNotifications)
│   ├── pages/              # Role-based pages (Admin, Landlord, Tenant, Public)
│   ├── store/              # Zustand global state (useAuthStore, useSavedPropertiesStore)
│   ├── App.tsx             # Main Router and Layout configuration
│   ├── main.tsx            # React root and Provider wrapping
│   └── sw.ts               # Service Worker logic for PWA
├── .env                    # Environment variables
├── vite.config.ts          # Vite & PWA configuration
└── tailwind.config.js      # Tailwind theme configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- The BariBhara Server (Backend) running locally or remotely.

### Installation

1. **Clone the repository and enter the client folder:**
   ```bash
   git clone https://github.com/CodeCommandBD/BariBhara-Client.git
   cd BariBhara-Client
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root of the client directory:
   ```env
   # Development
   VITE_API_URL=http://localhost:4000
   
   # Production (Uncomment when deploying)
   # VITE_API_URL=https://your-backend-api.com
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`*

## 🛠️ Build for Production
To build the app and generate the PWA service workers:
```bash
npm run build
```
