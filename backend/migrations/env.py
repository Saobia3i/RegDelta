"""Alembic env: migrations always run with the owner role (RegDelta_ADMIN_DATABASE_URL)."""
from alembic import context
from sqlalchemy import create_engine

from RegDelta_ops.config import get_settings
from RegDelta_ops.models import Base

target_metadata = Base.metadata


def run_migrations_online() -> None:
    engine = create_engine(get_settings().admin_database_url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()
