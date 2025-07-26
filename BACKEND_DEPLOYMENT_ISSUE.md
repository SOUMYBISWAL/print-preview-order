# Backend Deployment Issue Resolution

## Problem
AWS Amplify backend deployment failing due to Node.js version conflicts:
- Build environment using Node.js v18.20.8 
- Amplify backend packages require Node.js >=20
- EBADENGINE errors for multiple packages (minimatch@10.0.1, glob@11.0.3, etc.)

## Error Details
```
npm warn EBADENGINE Unsupported engine {
  npm warn EBADENGINE   package: 'minimatch@10.0.1',
  npm warn EBADENGINE   required: { node: '20 || >=22' },
  npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
}
```

## Temporary Solution Applied
1. **Disabled backend deployment** in amplify.yml to allow frontend deployment
2. **Added Node.js version specifications**:
   - Root .nvmrc: Node 20
   - amplify/.nvmrc: Node 20
   - amplify/package.json: engines field specifying Node >=20

## Current State
- Frontend deployment: ✅ Configured and working
- Backend deployment: ❌ Temporarily disabled

## Next Steps for Backend Deployment
1. **Wait for Amplify Node.js update**: AWS Amplify needs to support Node.js 20 in build environment
2. **Alternative approach**: Use AWS CDK or Serverless Framework for backend deployment
3. **Downgrade dependencies**: Consider using older versions compatible with Node.js 18

## Re-enable Backend Later
Uncomment backend section in amplify.yml once Node.js 20 is available:
```yaml
backend:
  phases:
    build:
      commands:
        - nvm use 20
        - cd amplify && npm install --legacy-peer-deps --engine-strict=false
        - cd amplify && npm run build
        - npx ampx generate outputs --app-id $AWS_APP_ID --branch $AWS_BRANCH --format json --out-dir .
```