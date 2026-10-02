@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.13+ from https://nodejs.org/en/download
  pause
  exit /b 1
)
if not exist node_modules/vinext/dist/cli.js (
  echo Run SETUP.cmd once before starting.
  pause
  exit /b 1
)
node scripts/setup.mjs
if errorlevel 1 (pause & exit /b 1)
echo Open http://127.0.0.1:5173 after the server starts.
echo Keep this window open. Press Ctrl+C to stop.
node scripts/run.mjs dev
if errorlevel 1 pause
