import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_URL = os.getenv(
    "DB_URL",
    "postgresql+psycopg://vatsalsinghrao@localhost/infybytes"
)

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)
Base = declarative_base()