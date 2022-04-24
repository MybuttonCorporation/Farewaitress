@echo off
if "%~1"=="" (
    start cmd /c "title Farewaitress ^| 153 Ping ^| 1.2 DEV ^| Running && %~dp0run.bat --load-bot" 
)
if "%~1"=="--load-bot" (
    colorful -s "Farewaitress is starting..." -f 12 -n
    colorful -s "Bot online now" -f 2 -n
    node %~dp0index.js
 pause   
)