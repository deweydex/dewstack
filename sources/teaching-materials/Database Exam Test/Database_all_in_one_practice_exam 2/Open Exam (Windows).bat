@echo off
:: Database Methods 5N0783 — Exam Launcher
:: Double-click to open the exam in a clean app window.
set EXAM=%~dp0exam_files\exam.html
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set EDGE="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

if exist %CHROME% (
    start "" %CHROME% --app="file:///%EXAM:\=/%" --start-maximized --disable-extensions --allow-file-access-from-files --no-first-run
    goto done
)
if exist %EDGE% (
    start "" %EDGE% --app="file:///%EXAM:\=/%" --start-maximized --disable-extensions --allow-file-access-from-files --no-first-run
    goto done
)
:: Fallback
start "" "%EXAM%"
:done
