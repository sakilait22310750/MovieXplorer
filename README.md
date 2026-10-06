# 🎬 MovieXplorer — Discover Your Favorite Films

A full-featured **React** movie explorer app built with **TMDb API**, **Material UI**, and **React Router**.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MUI](https://img.shields.io/badge/MUI-v5-blue?logo=mui)
![TMDb](https://img.shields.io/badge/API-TMDb-green)

---

## ✨ Features

- 🔍 **Search** any movie with filters (genre, year, rating)
- 🔥 **Trending** movies (updated weekly)
- 🎥 **Movie Details** — poster, cast, trailer (YouTube), rating, genres
- ❤️ **Favorites** — saved to localStorage
- 🌙 **Dark / Light Mode** toggle
- 📱 **Mobile-first** responsive design
- ♾️ **Load More** pagination for search results
- 🔁 **Last search restored** on page revisit

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/movie-explorer.git
cd movie-explorer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up TMDb API Key
- Get your free API key at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
- Open `.env` and replace `your_tmdb_api_key_here` with your actual key

### 4. Start the development server
```bash
npm start
```
App runs at `http://localhost:3000`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| React Context API | Global state management |
| Material UI (MUI) v5 | Component library & theming |
| Axios | HTTP requests |
| TMDb API | Movie data source |

---

## 📁 Project Structure

```
src/
├── api/          → TMDb API service (tmdb.js)
├── components/   → Reusable UI components
├── context/      → Global state (MovieContext)
├── pages/        → Route-level page components
└── theme.js      → MUI dark/light theme config
```

---

## 🌍 Deployment

Deploy to **Vercel** in one command:
```bash
npm install -g vercel
vercel
```
Set `REACT_APP_TMDB_KEY` in your Vercel project's **Environment Variables**.

---

## 📄 License

MIT © 2026 — Built for Loons Lab
