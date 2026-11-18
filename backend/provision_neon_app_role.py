"""Provision the least-privilege Neon role after schema migrations; never prints connection secrets."""
from __future__ import annotations

import os
import re
import secrets
import tempfile
from pathlib import Path
from urllib.parse import quote, urlsplit, urlunsplit

import psycopg
from psycopg import sql


def env_value(name: str) -> str | None:
    value = os.environ.get(name)
    if value:
        return value
    root = Path(__file__).resolve().parents[1]
    for line in (root / ".env").read_text(encoding="utf-8-sig").splitlines():
        match = re.match(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$", line)
        if match and match.group(1) == name:
            value = match.group(2)
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            return value
    return None


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    env_path = root / ".env"
    owner_url = env_value("RegDelta_DATABASE_URL")
    if not owner_url or ".neon.tech" not in (urlsplit(owner_url).hostname or ""):
        raise SystemExit("Set RegDelta_DATABASE_URL to the Neon owner connection before provisioning the app role.")
    parts = urlsplit(owner_url)
    if (parts.username or "").lower() == "regdelta_app":
        raise SystemExit("RegDelta_DATABASE_URL must be the Neon owner connection, not the application role.")

    password = secrets.token_urlsafe(36)
    role_name = "regdelta_app"
    psycopg_url = owner_url.replace("postgresql+psycopg://", "postgresql://", 1)
    try:
        with psycopg.connect(psycopg_url, connect_timeout=15, autocommit=True) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", (role_name,))
                if cursor.fetchone() is None:
                    cursor.execute(sql.SQL("CREATE ROLE {} LOGIN").format(sql.Identifier(role_name)))
                cursor.execute(sql.SQL("ALTER ROLE {} WITH LOGIN PASSWORD {}").format(
                    sql.Identifier(role_name), sql.Literal(password)))
                cursor.execute("SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname = %s", (role_name,))
                flags = cursor.fetchone()
                if not flags or flags[0] or flags[1]:
                    raise RuntimeError("app role must not have superuser or row-level security bypass privileges")
    except Exception as exc:  # never include driver exception text; it may contain connection metadata
        raise SystemExit(f"Neon application-role setup failed ({type(exc).__name__}).") from None

    host = parts.hostname or ""
    if ":" in host and not host.startswith("["):
        host = f"[{host}]"
    if parts.port:
        host = f"{host}:{parts.port}"
    netloc = f"{quote(role_name, safe='')}:{quote(password, safe='')}@{host}"
    app_url = urlunsplit(("postgresql+psycopg", netloc, parts.path, parts.query, parts.fragment))

    lines = env_path.read_text(encoding="utf-8-sig").splitlines()
    updates = {"RegDelta_DATABASE_URL": app_url, "RegDelta_ADMIN_DATABASE_URL": owner_url}
    seen: set[str] = set()
    rewritten: list[str] = []
    for line in lines:
        match = re.match(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=", line)
        name = match.group(1) if match else None
        if name in updates:
            if name not in seen:
                rewritten.append(f"{name}={updates[name]}")
                seen.add(name)
            continue
        rewritten.append(line)
    for name, value in updates.items():
        if name not in seen:
            rewritten.append(f"{name}={value}")
    fd, temp_name = tempfile.mkstemp(prefix=".env-", suffix=".tmp", dir=root, text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as target:
            target.write("\n".join(rewritten) + "\n")
        os.replace(temp_name, env_path)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)
    print("Neon application role is limited to the app grants/RLS policies; .env now has separate app and admin URLs. Values were not printed.")


if __name__ == "__main__":
    main()
