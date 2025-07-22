# Amplify Deployment Fix

## Issue
AWS Amplify deployment was failing due to npm dependency conflicts and missing packages in package-lock.json.

## Error Messages
- npm error: Missing multiple @smithy/* packages from lock file
- npm error: Missing @aws-sdk/* packages from lock file  
- Build failed with exit code 1

## Solution Applied

1. **Updated amplify.yml configuration**:
   - Changed from `npm ci` to `npm install --legacy-peer-deps`
   - Added package-lock.json removal before install
   - Applied to both frontend and backend builds

2. **Removed corrupted lock files**:
   - Deleted existing package-lock.json files
   - Let npm generate fresh lock files during build

3. **Added Node.js version specification**:
   - Created .nvmrc file specifying Node.js 20
   - Ensures consistent Node version across environments

## Current amplify.yml Configuration

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - cd amplify && rm -f package-lock.json && npm install --legacy-peer-deps
        - cd amplify && npm run build
        - npx ampx generate outputs --app-id $AWS_APP_ID --branch $AWS_BRANCH --format json --out-dir .
frontend:
  phases:
    preBuild:
      commands:
        - rm -f package-lock.json
        - npm install --legacy-peer-deps
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
      - amplify/node_modules/**/*
```

## Next Steps
- Deploy to AWS Amplify with the updated configuration
- The build should now complete successfully without dependency conflicts