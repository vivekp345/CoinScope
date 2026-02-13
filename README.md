# 🪙 CoinScope | Real-Time Crypto Analytics

A high-performance, SEO-optimized cryptocurrency tracking platform built with **Next.js**, **Tailwind CSS**, and the **CoinGecko API**.

## Key Features
* **Server-Side Rendering (SSR):** Powered by `getServerSideProps` to ensure data is fetched on the server, providing lightning-fast speeds and instant search engine indexability.
* **Programmatic SEO:** Uses dynamic routing (`/crypto/[id]`) to automatically generate unique, optimized pages for every cryptocurrency.
* **Structured Data (JSON-LD):** Implements `FinancialProduct` schema to help search engines provide rich snippets like live price and availability.
* **Social Optimization:** Full OpenGraph (OG) integration, ensuring professional link previews with titles, descriptions, and coin images when shared.
* **Robust Data Layer:** Features a custom fetcher with built-in API rate-limit detection and an automatic fallback to mock data to ensure 100% uptime.

## 📈 SEO Strategy & Keyword Research
The project is designed to capture high-intent organic traffic from crypto investors.

### **Research Process**:
1.  **Target Keywords:** Focused on high-volume terms such as "Live Crypto Prices," "Bitcoin Price Today," and "Market Cap Analytics".
2.  **Search Intent:** Targeted users looking for immediate, real-time data and "snapshot" information.
3.  **On-Page Implementation:** * **Dynamic Titles:** Used the template `{Name} ({Symbol}) Price Today | CoinScope` to rank for specific asset searches.
    * **Semantic HTML:** Structured the UI with `<header>`, `<main>`, and `<nav>` to help crawlers understand the page hierarchy.

## 🛠️ Technical Implementation & Challenges
### **Why Next.js?**
By using SSR instead of traditional Client-Side Rendering (CSR), we eliminate the "blank page" problem. Search engines receive fully rendered HTML, which is crucial for SEO-heavy applications.

### **Overcoming Hydration Errors**
A key challenge was a "Hydration Mismatch" caused by server-client locale differences (e.g., India vs. US number formatting). I solved this by forcing a consistent `en-US` locale string for all financial data, ensuring the server and client HTML match perfectly.



## 📦 Installation
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/](https://github.com/)[your-username]/[your-repo-name].git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run locally:**
    ```bash
    npm run dev
    ```

---
