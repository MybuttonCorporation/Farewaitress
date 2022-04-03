@echo off
if "%~1"=="" (
    echo commit message empty
    exit /b
)
echo Publishing...
git add .
git rm --cached config/config.json
git commit -m "%*"
git pull
git push origin master
echo Published to Github.