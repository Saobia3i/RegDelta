param(
  [switch]$Migrate,
  [switch]$SeedDemo,
  [int]$ApiPort = 8004
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$dotenvPath = Join-Path $projectRoot '.env'
$pythonExe = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'

if (-not (Test-Path -LiteralPath $pythonExe)) {
  throw 'Backend virtual environment is missing. Create it with: python -m venv backend/.venv; backend/.venv/Scripts/python -m pip install -r backend/requirements.lock'
}

# The project-root .env is authoritative for local runs and overrides inherited
# shell values that may point at an unrelated/local database. Values stay in
# this process only and are never printed.
if (Test-Path -LiteralPath $dotenvPath) {
  foreach ($line in [System.IO.File]::ReadLines($dotenvPath)) {
    if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$') {
      $name = $Matches[1]
      $value = $Matches[2]
      if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'")))) {
        $value = $value.Substring(1, $value.Length - 2)
      }
      [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
  }
}

Push-Location $PSScriptRoot
try {
  if ($Migrate) {
    & $pythonExe -m alembic upgrade head
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
  if ($SeedDemo) {
    & $pythonExe -m RegDelta_ops.seed --demo
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
  & $pythonExe -m uvicorn RegDelta_ops.api.main:app --host 127.0.0.1 --port $ApiPort --reload
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}



