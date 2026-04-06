# CoinScope Pro

A full-stack crypto portfolio simulator to track live prices, simulate trades, and manage a virtual portfolio.

---

## 🚀 Live Demo
https://coin-scope-chi.vercel.app

## 💻 GitHub Repo
https://github.com/vivekp345/CoinScope

---

## 📊 Lighthouse SEO Scores

| Performance | Accessibility | Best Practices | SEO |
|------------|-------------|---------------|-----|
| 98         | 96          | 100           | 100 |

---

## ✨ Features

- Live cryptocurrency prices using CoinGecko API  
- Simulated buy/sell with real-time P&L calculation  
- Personal virtual portfolio with trade tracking  
- 7-day interactive price charts (Chart.js)  
- Fear & Greed market sentiment indicator  
- Secure authentication using NextAuth (JWT-based)  
- Protected routes (portfolio, profile, settings)  
- Dark mode support with system preference  
- SEO optimized with SSR, meta tags, and structured data  

---

## 🛠 Tech Stack

- Next.js  
- Tailwind CSS  
- MongoDB Atlas  
- Mongoose  
- NextAuth.js  
- Chart.js  
- CoinGecko API  
- Alternative.me API  
- Vercel  

---

## 🧠 Architecture

- SSR-first approach using Next.js for better SEO and performance  
- Separation of concerns:
  - Mongoose → application data models  
  - MongoDB client → authentication adapter  
- JWT-based authentication with NextAuth for secure sessions  
- Edge middleware for route protection before rendering  
- Client + Server split:
  - Server → data fetching & SEO rendering  
  - Client → charts, UI interactions  
- Dynamic imports used for Chart.js to avoid SSR issues  
- Resilient API handling with fallback data for rate limits  

---

## ⚙️ Setup & Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/coinscope-pro.git
cd coinscope-pro
