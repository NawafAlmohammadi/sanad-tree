@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.13+ from https://nodejs.org/en/download
  pause
  exit /b 1
)
node scripts/setup.mjs
if errorlevel 1 (pause & exit /b 1)
call npm.cmd ci
if errorlevel 1 (pause & exit /b 1)
echo Setup complete. Open API.env to add your key, then run START.cmd.
pause
