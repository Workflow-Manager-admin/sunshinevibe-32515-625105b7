#!/bin/bash
cd /home/kavia/workspace/code-generation/sunshinevibe-32515-625105b7/sunshinevibe
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

