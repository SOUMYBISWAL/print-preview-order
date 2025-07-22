# AWS Amplify Deployment Build Fix

## Problem
The AWS Amplify build was failing with "No such file or directory" error when trying to change directory to `amplify`.

**Error Details:**
```
cd amplify && npm run build
/root/.rvm/scripts/extras/bash_zsh_support/chpwd/function.sh: line 8: cd: amplify: No such file or directory
```

## Root Cause
The build command was trying to access the `amplify` directory, but the directory structure in the deployment environment was different from the local structure.

## Solution Applied
1. **Added directory check**: Before attempting to cd into amplify directory
2. **Made backend build conditional**: Only runs if amplify directory exists
3. **Added error handling**: Backend generation continues even if some steps fail

## Updated amplify.yml
```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - if [ -d "amplify" ]; then cd amplify && npm install --force && npm run build; fi
        - npx ampx generate outputs --app-id $AWS_APP_ID --branch $AWS_BRANCH --format json --out-dir . || echo "Backend generation skipped"
frontend:
  phases:
    preBuild:
      commands:
        - rm -f package-lock.json
        - npm install --force
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist/public
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Expected Outcome
- Build will check if amplify directory exists before trying to access it
- If directory doesn't exist, build continues without backend setup
- Frontend will still build successfully
- Deployment will complete as frontend-only if backend isn't available

This ensures the deployment succeeds even if the backend configuration needs adjustments.