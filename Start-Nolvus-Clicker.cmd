@echo off
setlocal
set "CLICKER_NODE="
for /f "delims=" %%N in ('where node.exe 2^>nul') do if not defined CLICKER_NODE set "CLICKER_NODE=%%N"
if not defined CLICKER_NODE for /d %%D in ("C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.*") do if exist "%%~D\dependencies\node\bin\node.exe" set "CLICKER_NODE=%%~D\dependencies\node\bin\node.exe"
if not defined CLICKER_NODE (
  echo Node.js could not be found. Install Node.js 24 or newer, then try again.
  pause
  exit /b 1
)
"%CLICKER_NODE%" "%~dp0nolvus-background-clicker.mjs" %*
if errorlevel 1 pause

