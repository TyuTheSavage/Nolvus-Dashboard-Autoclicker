@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 24 or newer from https://nodejs.org/
  echo Then reopen this launcher.
  pause
  exit /b 1
)
if not exist "%~dp0nolvus-background-clicker.mjs" (
  echo Keep this launcher in the same folder as nolvus-background-clicker.mjs.
  pause
  exit /b 1
)
node "%~dp0nolvus-background-clicker.mjs"
pause
