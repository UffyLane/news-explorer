# News Explorer

## Overview

News Explorer is a production-style full-stack news application that allows users to:

- Search for real-time news articles
- Create secure user accounts
- Save and manage favorite articles
- Authenticate with JWT-based authorization
- Run the entire stack through Docker and Docker Compose
- Deploy frontend and backend services independently

The project was built with a modern infrastructure-focused architecture using React, FastAPI, PostgreSQL, Docker, GitHub Actions CI, and Nginx.

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Context API
- CSS Modules
- Nginx

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic
- Uvicorn

### Infrastructure / DevOps
- Docker
- Docker Compose
- GitHub Actions
- Render
- Vercel
- Neon PostgreSQL

---

## Features

- User registration and login
- JWT authentication
- Protected routes
- Article bookmarking
- Responsive mobile-first design
- Production environment configuration
- Containerized frontend and backend services
- Persistent PostgreSQL storage
- CI pipeline automation

---

## Local Development

### Clone the repository

```bash
git clone https://github.com/UFFYLANE/news-explorer.git
cd news-explorer
```

---

## Docker Setup

### Start all services

```bash
docker compose up --build
```

### Services

| Service | Port |
|---|---|
| Frontend | 8081 |
| Backend | 3001 |
| PostgreSQL | 5432 |

---

## Environment Variables

### Frontend

```env
VITE_API_BASE_URL=http://localhost:3001
```

### Backend

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/news_explorer
SECRET_KEY=your_secret_key
```

---

## CI/CD

GitHub Actions automatically:
- Builds frontend
- Installs backend dependencies
- Validates backend imports

Workflow location:

```txt
.github/workflows/ci.yml
```

---

## Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- Neon PostgreSQL

---

## Author

Stuart G. Clark Jr.
