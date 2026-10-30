# MyJamii Store

A small e-commerce store: React front end, Flask API, and Groq for the parts of running a shop that nobody enjoys writing by hand.

Live: https://myjamii-store-client.onrender.com/

## Why I built it

Two reasons. I wanted a store with a real cart and checkout flow rather than a product grid with a fake button. And I wanted to find out whether AI could do the tedious part of running one: product descriptions and page metadata that a search engine will actually index, without somebody rewriting every line afterwards.

## What it does

- Catalogue with categories, search and individual product pages
- Cart and cart items stored server-side against a user
- AI-generated product copy and SEO metadata, cached so repeat requests do not re-bill the API
- Installable PWA with offline support

## How it is put together

```
client/     React + Vite, PWA via vite-plugin-pwa
server/     Flask + SQLAlchemy + Alembic
  models.py                      User, Product, Cart, CartItem, Category,
                                 ProductCategory, AIGeneratedContent, SEOMetadata
  services/groq_ai_service.py    content generation, caching, usage analytics
  services/intelligent_ai_service.py  prompt construction and output cleanup
  migrations/                    Alembic revisions
```

The database URL comes from `DATABASE_URL`, so it runs on SQLite locally and on Postgres in deployment without a code change.

The decision worth pointing at is caching. Generated copy is stored against the product and the prompt that produced it, so the same request costs nothing twice, and a bad generation can be traced back to the prompt that created it rather than guessed at.

## Running it

```bash
# API
cd server
python -m venv .venv && source .venv/bin/activate
pip install flask flask-sqlalchemy flask-migrate groq python-dotenv
export DATABASE_URL=sqlite:///myjamii.db
export GROQ_API_KEY=your_key
flask db upgrade
python seed.py
python app.py

# Client
cd client
npm install
npm run dev
```

## What is rough

- **The dependency manifest is empty.** `Pipfile` exists but its `[packages]` section has nothing in it, and there is no `requirements.txt`, so the install line above is reconstructed from the imports rather than declared. This is the first thing I would fix: pin the versions.
- **No tests.** Everything was checked by hand against a seeded database.
- **Generated copy is cached but not scored.** Quality control is a human reading it, not an automated check.
- **The SEO notes are gone.** Several hundred lines of planning documents accumulated here while I was building the AI SEO work. They described intentions, not the code, so they were removed and replaced with this file.
- **Committed build output.** `__pycache__` and the PWA dev build had been committed before there was a `.gitignore`. Both are now ignored.

## Stack

React, Vite, Flask, SQLAlchemy, Alembic, Groq API, PWA.
