@echo off
echo Starting Hospital Management System...

:: Start Backend
start "Hospital Backend" cmd /k "cd hospital-backend && npm run dev"

:: Start Frontend
start "Hospital Frontend" cmd /k "cd hospitalmanagement && npm start"

echo Services started in separate windows!
