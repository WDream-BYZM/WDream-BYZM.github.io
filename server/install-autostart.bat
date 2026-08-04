@echo off
cd /d "%~dp0"
echo ========================================
echo   BYZM Multi Server - Autostart Install
echo ========================================
echo.

REM stop old node to avoid port conflict
taskkill /f /im node.exe >nul 2>&1

echo [1/2] Register autostart task (on login, hidden)...
schtasks /create /tn "BYZM_Multi" /tr "wscript.exe \"%~dp0start-hidden.vbs\"" /sc onlogon /f

echo [2/2] Start server in background now...
start "" wscript.exe "%~dp0start-hidden.vbs"
echo.

echo Done! Server is running in background (no window).
echo Verify: open https://byzm-desktop.tail2a2672.ts.net/health
echo Should show {"ok":true,"service":"byzm-multi"}
echo.
echo Note: if [1/2] still says Access denied, right-click this bat
echo       and choose "Run as administrator", then run again.
echo.
pause

