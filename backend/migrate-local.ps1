param([switch]$SeedDemo)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$dotenvPath = Join-Path $projectRoot '.env'
$pythonExe = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $pythonExe)) { throw 'Backend virtual environment is missing.' }

if (Test-Path -LiteralPath $dotenvPath) {
  foreach ($line in [System.IO.File]::ReadLines($dotenvPath)) {
    if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$') {
      $name = $Matches[1]
      $value = $Matches[2]
      if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'")))) {
        $value = $value.Substring(1, $value.Length - 2)
      }
      if (-not (Test-Path "Env:$name")) { [Environment]::SetEnvironmentVariable($name, $value, 'Process') }
    }
  }
}

# When a Neon owner URL was pasted into the app setting and the old admin setting is still local,
# use that Neon owner only for this migration command. The API must later use the limited app role.
if ($env:RegDelta_DATABASE_URL -match '\.neon\.tech' -and $env:RegDelta_ADMIN_DATABASE_URL -notmatch '\.neon\.tech') {
  $env:RegDelta_ADMIN_DATABASE_URL = $env:RegDelta_DATABASE_URL
}

Push-Location $PSScriptRoot
try {
  & $pythonExe -m alembic upgrade head
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  if ($SeedDemo) {
    & $pythonExe -m RegDelta_ops.seed --demo
    exit $LASTEXITCODE
  }
}
finally {
  Pop-Location
}
