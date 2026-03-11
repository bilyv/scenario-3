@echo off
setlocal

set DB_NAME=CWSMS
set SCHEMA_FILE=%~dp0..\db\schema.sql

if not exist "%SCHEMA_FILE%" (
  echo Schema file not found: %SCHEMA_FILE%
  exit /b 1
)

REM Check if MySQL is available
where mysql >nul 2>nul
if errorlevel 1 (
  echo mysql client not found in PATH.
  echo Please install MySQL client or add it to PATH.
  exit /b 1
)

REM Create database if it does not exist
mysql -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;" 
if errorlevel 1 (
  echo Failed to create database.
  exit /b 1
)

REM Check if tables already exist
for /f "usebackq tokens=*" %%A in (`mysql -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='%DB_NAME%' AND table_name='users';"`) do set TABLE_EXISTS=%%A

if "%TABLE_EXISTS%"=="1" (
  echo Database schema already done.
  exit /b 0
)

REM Load schema
mysql %DB_NAME% < "%SCHEMA_FILE%"
if errorlevel 1 (
  echo Failed to load schema.
  exit /b 1
)

echo Database schema created successfully.
endlocal
