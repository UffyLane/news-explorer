from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str

    class Config:
        from_attributes = True


class ArticleCreate(BaseModel):
    keyword: str
    title: str
    text: str
    date: str
    source: str
    link: str
    image: str | None = None


class ArticleResponse(ArticleCreate):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    token: str      