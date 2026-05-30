# News Explorer Frontend

## Overview

The frontend is a React + Vite application responsible for:
- News search UI
- User authentication flows
- Article saving/bookmarking
- Responsive layouts
- Client-side routing

The frontend is containerized with Docker and served through Nginx in production.

---

## Tech Stack

- React
- Vite
- React Router
- Context API
- CSS
- Docker
- Nginx

---

## Installation

```bash
cd frontend
npm install
```

---

## Development Server

```bash
npm run dev
```

Default local URL:

```txt
http://localhost:5173
```

---

## Environment Variables

Create:

```txt
.env.local
```

Add:

```env
VITE_API_BASE_URL=http://localhost:3001
```

---

## Production Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Docker

### Build container

```bash
docker build -t news-explorer-frontend .
```

### Run container

```bash
docker run -p 8081:80 news-explorer-frontend
```

---

## Testing Checklist

### Authentication
- User can sign up
- User can sign in
- JWT token persists
- User can log out

### News Features
- Search returns articles
- Articles render correctly
- Saved articles persist

### Responsive Design
- Desktop layout works
- Tablet layout works
- Mobile layout works

---

## Deployment

Frontend is deployed through:
- Vercel
- Nginx production serving

---

## Author

Stuart G. Clark Jr.
