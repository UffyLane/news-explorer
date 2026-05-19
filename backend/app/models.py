from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    articles = relationship("Article", back_populates="owner")


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, nullable=False)
    title = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    date = Column(String, nullable=False)
    source = Column(String, nullable=False)
    link = Column(String, nullable=False)
    image = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="articles")