from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False}
    if settings.database_url.startswith("sqlite")
    else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

def ensure_article_summary_columns(bind=None):
    """Add the summary columns to an existing `articles` table.

    `Base.metadata.create_all` only creates missing tables; it never alters
    existing ones, so databases created before the summary feature (including
    the deployed Postgres) need these columns added once. Alembic is the
    proper long-term tool; this keeps the project dependency-free for now.
    """
    bind = bind or engine
    inspector = inspect(bind)

    if "articles" not in inspector.get_table_names():
        return

    existing = {column["name"] for column in inspector.get_columns("articles")}
    wanted = {"summary": "TEXT", "summary_basis": "VARCHAR"}

    with bind.begin() as connection:
        for name, column_type in wanted.items():
            if name not in existing:
                connection.execute(
                    text(f"ALTER TABLE articles ADD COLUMN {name} {column_type}")
                )
