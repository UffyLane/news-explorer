from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routes.users import get_current_user
from app.services.article_text import fetch_article_text
from app.services.summarizer import summarize_article

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
    existing_article = (
        db.query(models.Article)
        .filter(
            models.Article.owner_id == current_user.id,
            models.Article.link == article_data.link,
        )
        .first()
    )

    if existing_article:
        raise HTTPException(
            status_code=409,
            detail="Article already saved",
        )

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


@router.post("/{article_id}/summary", response_model=schemas.SummaryResponse)
def summarize_saved_article(
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
        raise HTTPException(status_code=403, detail="You cannot summarize another user's article")

    # Generate once, then serve from the database. Summaries only exist for
    # articles a signed-in user saved, and repeat clicks cost nothing.
    if article.summary:
        return {
            "summary": article.summary,
            "summary_basis": article.summary_basis or "snippet",
            "cached": True,
        }

    full_text = fetch_article_text(article.link)
    basis = "full_text" if full_text else "snippet"
    text = full_text or article.text

    summary = summarize_article(article.title, article.source, text, basis)

    article.summary = summary
    article.summary_basis = basis
    db.commit()

    return {"summary": summary, "summary_basis": basis, "cached": False}
