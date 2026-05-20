from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routes.users import get_current_user

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("", response_model=list[schemas.ArticleResponse])
def get_articles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Article)
        .filter(models.Article.owner_id == current_user.id)
        .all()
    )


@router.post("", response_model=schemas.ArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(
    article_data: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    article = models.Article(
        **article_data.model_dump(),
        owner_id=current_user.id,
    )

    db.add(article)
    db.commit()
    db.refresh(article)

    return article


@router.delete("/{article_id}")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    article = (
        db.query(models.Article)
        .filter(models.Article.id == article_id)
        .first()
    )

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    if article.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot delete another user's article")

    db.delete(article)
    db.commit()

    return {"message": "Article deleted"}