# News Explorer — Frontend

> **React + Vite frontend for the News Explorer application.**

🗞️ **[Live App](https://news-explorer-sage.vercel.app)** | ⚙️ **[Backend Repo](https://github.com/UffyLane/news-explorer/tree/main/backend)**

---

## About

The frontend for News Explorer — a news search and bookmarking app. Built with React and Vite, served through Nginx in production, and containerized with Docker for consistent local development.

---

## Try It

**Live app:** https://news-explorer-sage.vercel.app

Test credentials:
- **Email:** test@newsexplorer.com
- **Password:** Test1234!

---

## Features

- **News search** — search any topic and get real-time results
- **Authentication** — sign up, log in, JWT token persistence
- **Save articles** — bookmark articles to your personal dashboard
- **Protected routes** — dashboard requires authentication
- **Responsive design** — mobile and desktop layouts
- **Nginx production serving** — optimized static file delivery

---

## Tech Stack

- React
- Vite
- React Router v6
- Context API
- CSS Modules
- Docker
- Nginx

---

## Project Structure

```
frontend/
│
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── SearchForm/
│   │   ├── NewsCard/
│   │   ├── SavedArticles/
│   │   ├── LoginModal/
│   │   ├── RegisterModal/
│   │   └── ProtectedRoute/
│   ├── pages/
│   │   ├── Main/
│   │   └── SavedNews/
│   ├── contexts/
│   │   └── CurrentUserContext.js
│   └── utils/
│       ├── api.js          # Backend API calls
│       └── newsApi.js      # News API calls
│
├── nginx.conf              # Production Nginx config
└── Dockerfile
```

---

## Running Locally

```bash
cd frontend
npm install
```

Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3001
```

```bash
npm run dev
# runs at http://localhost:5173
```

> You'll need the backend running locally too. See the [backend README](../backend/README.md) or use `docker compose up` from the root to start everything at once.

---

## Docker

**Build and run standalone:**
```bash
docker build -t news-explorer-frontend .
docker run -p 8081:80 news-explorer-frontend
```

**Or run the full stack:**
```bash
# from the project root
docker compose up --build
# frontend at http://localhost:8081
```

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Deployment

- **Platform:** Vercel (auto-deploys from `main`)
- **Production server:** Nginx serves the built static files inside the Docker container

---

## Author

**Stuart G. Clark Jr.**
[GitHub](https://github.com/UffyLane)

---

## License

MIT

