#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
EXAM="$DIR/exam_files/exam.html"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
EDGE="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
if [ -f "$CHROME" ]; then
    "$CHROME" --app="file://$EXAM" --start-maximized --disable-extensions --allow-file-access-from-files --no-first-run &
elif [ -f "$EDGE" ]; then
    "$EDGE" --app="file://$EXAM" --start-maximized --disable-extensions --allow-file-access-from-files --no-first-run &
else
    open "$EXAM"
fi
