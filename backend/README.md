# News Explorer Backend

## Overview

The backend is a FastAPI service responsible for:
- User authentication
- JWT token generation
- Database management
- Saved article persistence
- API routing
- PostgreSQL integration

The backend runs inside a Docker container and connects to Neon PostgreSQL in production.

---

## Tech Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- Docker
- Uvicorn

---

## Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Environment Variables

Create:

```txt
.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/news_explorer
SECRET_KEY=your_secret_key
```

---

## Run Local Server

```bash
uvicorn app.main:app --reload
```

Default backend URL:

```txt
http://localhost:3000
```

Swagger docs:

```txt
http://localhost:3000/docs
```

---

## Docker

### Build backend image

```bash
docker build -t news-explorer-backend .
```

### Run backend container

```bash
docker run --env-file .env -p 3001:3000 news-explorer-backend
```

---

## Database

### Local Development
- PostgreSQL container through Docker Compose

### Production
- Neon PostgreSQL

---

## API Features

- User registration
- User login
- JWT validation
- Protected routes
- Saved articles CRUD
- SQLAlchemy ORM integration

---

## Testing Checklist

### Authentication
- User registration succeeds
- Login returns JWT
- Invalid credentials fail properly

### Database
- PostgreSQL connection works
- Tables generate correctly
- Saved articles persist

### API
- Routes return expected status codes
- Protected endpoints require auth
- Swagger docs load successfully

---

## Deployment

Backend is deployed through:
- Render
- Docker containers
- PostgreSQL cloud database

---

## Author

Stuart G. Clark Jr.
