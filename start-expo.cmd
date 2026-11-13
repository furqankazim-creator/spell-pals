@echo off
rem Starts Spell Pals in Expo with a clean cache. Scan the QR code with Expo Go (same Wi-Fi as this PC).
cd /d "%~dp0"
echo.
echo  Starting Spell Pals... if Expo asks to log in, choose "Proceed anonymously".
echo.
call npx expo start --clear
