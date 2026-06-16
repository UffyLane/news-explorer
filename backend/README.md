# News Explorer — Backend

> **FastAPI backend for the News Explorer application.**

⚙️ **[Live API](https://news-explorer-7bgk.onrender.com)** | 📖 **[Swagger Docs](https://news-explorer-7bgk.onrender.com/docs)** | 🗞️ **[Frontend App](https://news-explorer-sage.vercel.app)**

---

## About

REST API for News Explorer built with Python and FastAPI. Handles user authentication, JWT token management, and saved article persistence using PostgreSQL. Deployed on Render as a Docker container.

> Note: Hosted on Render's free tier — first request may take ~50 seconds to wake up.

---

## Interactive API Docs

FastAPI auto-generates live Swagger documentation:

**https://news-explorer-7bgk.onrender.com/docs**

You can explore and test every endpoint directly in the browser without Postman.

---

## Test Credentials

- **Email:** test@newsexplorer.com
- **Password:** Test1234!

---

## Tech Stack

- Python
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Pydantic
- JWT authentication
- Uvicorn
- Docker

---

## Project Structure

```
backend/
│
├── app/
│   ├── main.py            # App entry point, route registration
│   ├── models/            # SQLAlchemy database models
│   ├── routes/            # API route handlers
│   │   ├── auth.py        # /signup, /login
│   │   ├── users.py       # /users/me
│   │   ├── news.py        # /news/search
│   │   └── articles.py    # /articles CRUD
│   ├── schemas/           # Pydantic request/response schemas
│   └── auth/              # JWT token logic
│
├── requirements.txt
└── Dockerfile
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Create account |
| POST | `/login` | No | Log in, receive JWT |
| GET | `/users/me` | Yes | Get current user |
| GET | `/news/search` | No | Search news articles |
| GET | `/articles` | Yes | Get saved articles |
| POST | `/articles` | Yes | Save an article |
| DELETE | `/articles/{id}` | Yes | Delete saved article |

---

## Running Locally

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/news_explorer
SECRET_KEY=your_secret_key
```

```bash
uvicorn app.main:app --reload
# runs at http://localhost:3000
# docs at http://localhost:3000/docs
```

**Or run the full stack with Docker from the project root:**
```bash
docker compose up --build
```

---

## Deployment

- **Platform:** Render (Docker container deployment)
- **Database:** Neon PostgreSQL (serverless cloud PostgreSQL)

---

## Author

**Stuart G. Clark Jr.**
[GitHub](https://github.com/UffyLane)

---

## License

MIT

