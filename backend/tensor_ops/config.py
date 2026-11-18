"""Typed configuration. Fails closed outside the local environment."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from functools import lru_cache


class ConfigError(RuntimeError):
    pass


def _env(name: str, default: str | None = None) -> str | None:
    v = os.environ.get(name)
    return v if v not in (None, "") else default


def _env_first(*names: str, default: str | None = None) -> str | None:
    for name in names:
        value = os.environ.get(name)
        if value not in (None, ""):
            return value
    return default


def _int(name: str, default: int) -> int:
    return int(_env(name, str(default)))  # type: ignore[arg-type]


def _float(name: str, default: float) -> float:
    return float(_env(name, str(default)))  # type: ignore[arg-type]


def _sqlalchemy_url(value: str | None, fallback: str) -> str:
    url = value or fallback
    return url.replace("postgresql://", "postgresql+psycopg://", 1) if url.startswith("postgresql://") else url


@dataclass(frozen=True)
class Settings:
    env: str = "local"  # local | test | staging | production
    database_url: str = "postgresql+psycopg://RegDelta_app:devpass@localhost/RegDelta"
    admin_database_url: str = "postgresql+psycopg://RegDelta_owner:devpass@localhost/RegDelta"

    # Auth
    oidc_issuer: str | None = None
    oidc_audience: str | None = None
    oidc_jwks_url: str | None = None
    dev_jwt_secret: str | None = None
    require_mfa_for_privileged: bool = True

    # Storage / ingestion
    storage_dir: str = "./var/objects"
    max_upload_bytes: int = 25 * 1024 * 1024
    upload_session_ttl_s: int = 900
    scanner: str = "dev"  # dev | clamav
    clamd_host: str = "localhost"
    clamd_port: int = 3310
    extract_timeout_s: int = 30
    extract_memory_mb: int = 512

    # AI
    ai_provider: str = "mock"  # mock | anthropic | openrouter
    anthropic_api_key: str | None = None
    openrouter_api_key: str | None = None
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_referer: str | None = None
    openrouter_app_title: str = "RegDelta"
    ai_model: str = "claude-sonnet-5-5"
    ai_timeout_s: int = 120
    ai_max_output_tokens: int = 4000
    ai_job_budget_usd: float = 0.50
    ai_tenant_daily_budget_usd: float = 20.0
    ai_price_in_per_mtok: float = 3.0
    ai_price_out_per_mtok: float = 15.0

    # Secrets
    secrets_key: str | None = None  # Fernet key for the dev/local secret store

    # Downloads
    download_ttl_s: int = 600

    # Delivery economics (from the business plan; editable)
    engineer_rate_usd: float = 9.0
    expert_rate_usd: float = 75.0
    target_hours_year1: float = 100.0
    target_hours_year2: float = 65.0

    cors_origins: list[str] = field(default_factory=list)
    static_dir: str | None = None

    @property
    def is_local(self) -> bool:
        return self.env in ("local", "test")

    def validate(self) -> None:
        if self.ai_provider not in ("mock", "anthropic", "openrouter"):
            raise ConfigError("RegDelta_AI_PROVIDER must be mock, anthropic, or openrouter")
        if self.ai_provider == "anthropic" and not self.anthropic_api_key:
            raise ConfigError("RegDelta_ANTHROPIC_API_KEY is required for the anthropic provider")
        if self.ai_provider == "openrouter":
            if not self.openrouter_api_key:
                raise ConfigError("RegDelta_OPENROUTER_API_KEY is required for the openrouter provider")
            if not self.ai_model:
                raise ConfigError("RegDelta_AI_MODEL must be set to an OpenRouter model ID")
        if self.is_local:
            return
        missing = [n for n, v in {
            "RegDelta_OIDC_ISSUER": self.oidc_issuer,
            "RegDelta_OIDC_AUDIENCE": self.oidc_audience,
            "RegDelta_OIDC_JWKS_URL": self.oidc_jwks_url,
            "RegDelta_SECRETS_KEY": self.secrets_key,
        }.items() if not v]
        if missing:
            raise ConfigError(f"Refusing to start in {self.env}: missing {', '.join(missing)}")
        if self.dev_jwt_secret:
            raise ConfigError("RegDelta_DEV_JWT_SECRET must not be set outside local")
        if self.scanner == "dev":
            raise ConfigError("The dev malware scanner is not allowed outside local; set RegDelta_SCANNER=clamav")


@lru_cache
def get_settings() -> Settings:
    env = _env("RegDelta_ENV", "local") or "local"
    s = Settings(
        env=env,
        # Neon supplies a pooled DATABASE_URL for application traffic and an unpooled direct URL for migrations.
        database_url=_sqlalchemy_url(_env_first("RegDelta_DATABASE_URL", "DATABASE_URL"), Settings.database_url),
        admin_database_url=_sqlalchemy_url(_env_first("RegDelta_ADMIN_DATABASE_URL", "DATABASE_URL_UNPOOLED", "DATABASE_URL", "RegDelta_DATABASE_URL"),
                                            Settings.admin_database_url),
        oidc_issuer=_env("RegDelta_OIDC_ISSUER"),
        oidc_audience=_env("RegDelta_OIDC_AUDIENCE"),
        oidc_jwks_url=_env("RegDelta_OIDC_JWKS_URL"),
        dev_jwt_secret=_env("RegDelta_DEV_JWT_SECRET", "local-dev-only-secret-change-me-0123456789" if env in ("local", "test") else None),
        require_mfa_for_privileged=_env("RegDelta_REQUIRE_MFA", "true") == "true",
        storage_dir=_env("RegDelta_STORAGE_DIR", Settings.storage_dir),  # type: ignore[arg-type]
        max_upload_bytes=_int("RegDelta_MAX_UPLOAD_BYTES", Settings.max_upload_bytes),
        scanner=_env("RegDelta_SCANNER", "dev"),  # type: ignore[arg-type]
        clamd_host=_env("RegDelta_CLAMD_HOST", "localhost"),  # type: ignore[arg-type]
        clamd_port=_int("RegDelta_CLAMD_PORT", 3310),
        extract_timeout_s=_int("RegDelta_EXTRACT_TIMEOUT_S", 30),
        ai_provider=_env_first("RegDelta_AI_PROVIDER", "TENSOR_AI_PROVIDER", default="mock"),  # type: ignore[arg-type]
        anthropic_api_key=_env("RegDelta_ANTHROPIC_API_KEY") or _env("ANTHROPIC_API_KEY"),
        openrouter_api_key=_env_first("RegDelta_OPENROUTER_API_KEY", "RegDelta_OPENROUTER_API",
                                      "TENSOR_OPENROUTER_API", "TENSOR_OPENROUTER_API_KEY", "OPENROUTER_API_KEY"),
        openrouter_base_url=_env("RegDelta_OPENROUTER_BASE_URL", Settings.openrouter_base_url),  # type: ignore[arg-type]
        openrouter_referer=_env("RegDelta_OPENROUTER_REFERER"),
        openrouter_app_title=_env("RegDelta_OPENROUTER_APP_TITLE", "RegDelta"),  # type: ignore[arg-type]
        ai_model=_env_first("RegDelta_AI_MODEL", "TENSOR_AI_MODEL",
                            default="" if _env_first("RegDelta_AI_PROVIDER", "TENSOR_AI_PROVIDER", default="mock") == "openrouter" else Settings.ai_model),  # type: ignore[arg-type]
        ai_job_budget_usd=_float("RegDelta_AI_JOB_BUDGET_USD", 0.50),
        ai_tenant_daily_budget_usd=_float("RegDelta_AI_TENANT_DAILY_BUDGET_USD", 20.0),
        ai_price_in_per_mtok=_float("RegDelta_AI_PRICE_IN_PER_MTOK", 3.0),
        ai_price_out_per_mtok=_float("RegDelta_AI_PRICE_OUT_PER_MTOK", 15.0),
        secrets_key=_env("RegDelta_SECRETS_KEY"),
        download_ttl_s=_int("RegDelta_DOWNLOAD_TTL_S", 600),
        engineer_rate_usd=_float("RegDelta_ENGINEER_RATE_USD", 9.0),
        expert_rate_usd=_float("RegDelta_EXPERT_RATE_USD", 75.0),
        cors_origins=[o for o in (_env("RegDelta_CORS_ORIGINS", "") or "").split(",") if o],
        static_dir=_env("RegDelta_STATIC_DIR"),
    )
    s.validate()
    return s
