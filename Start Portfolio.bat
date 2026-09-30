@echo off
title Aleesha Portfolio - keep this window open
cd /d D:\aleesha-portfolio

rem Install packages the first time (or if node_modules was deleted)
if not exist node_modules (
  echo Installing packages, please wait...
  call npm install
)

rem Open the website in the browser after the server has had a few seconds to start
start "" cmd /c "timeout /t 3 >nul & start http://localhost:3000"

echo.
echo  Your portfolio is starting at http://localhost:3000
echo  Keep this window open while you use the website.
echo  Close this window to stop the website.
echo.
call npm start
pause
