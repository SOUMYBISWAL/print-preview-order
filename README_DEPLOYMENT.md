# AWS Amplify Deployment Guide

This guide explains how to deploy your PrintLite application to AWS Amplify from GitHub.

## Prerequisites

1. Your code is pushed to a GitHub repository
2. You have an AWS account with Amplify access

## Deployment Steps

### 1. Create New Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select the branch to deploy (usually `main` or `master`)

### 2. Configure Build Settings

Amplify should automatically detect the `amplify.yml` file in your repository root. If not, use these settings:

**Build Command**: `npm run build`
**Base Directory**: leave empty
**Build Output Directory**: `dist/public`

### 3. Environment Variables (Optional)

If you want to use a PostgreSQL database in production:
- Add `DATABASE_URL` environment variable in Amplify Console
- Go to App Settings → Environment Variables
- Add your database connection string

### 4. Advanced Settings

#### For Single Page Application (SPA) Support:
The `_redirects` file in `client/public/` handles client-side routing automatically.

#### Custom Domain (Optional):
- Go to App Settings → Domain Management
- Add your custom domain
- Follow the DNS configuration steps

## Build Configuration

The `amplify.yml` file contains:
- Build commands for the frontend
- Correct output directory (`dist/public`)
- Cache settings for faster builds

## Troubleshooting

### 404 Errors on Page Refresh
- Ensure `_redirects` file exists in `client/public/`
- Check that build output goes to `dist/public/`

### Build Failures
- Check build logs in Amplify Console
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility

### Performance Issues
- Build caching is enabled in `amplify.yml`
- Consider optimizing bundle size if needed

## File Structure for Deployment

```
your-project/
├── amplify.yml              # Build configuration
├── client/
│   └── public/
│       └── _redirects       # SPA routing rules
├── dist/
│   └── public/             # Build output (created after build)
└── package.json            # Dependencies and scripts
```

## Security Notes

- Database credentials should use environment variables
- API keys should be stored in Amplify environment variables
- Never commit sensitive data to GitHub

## Monitoring

- Check build logs in Amplify Console
- Monitor application performance
- Set up CloudWatch alarms if needed