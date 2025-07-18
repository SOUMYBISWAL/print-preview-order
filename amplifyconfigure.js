#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create amplify configuration if it doesn't exist
const amplifyConfigPath = path.join(__dirname, 'src', 'amplifyconfiguration.json');
const clientConfigPath = path.join(__dirname, 'client', 'src', 'amplifyconfiguration.json');

// Default configuration
const defaultConfig = {
  "aws_project_region": process.env.AWS_REGION || "us-east-1",
  "aws_cognito_identity_pool_id": process.env.AWS_COGNITO_IDENTITY_POOL_ID || "",
  "aws_cognito_region": process.env.AWS_REGION || "us-east-1", 
  "aws_user_pools_id": process.env.AWS_COGNITO_USER_POOL_ID || "",
  "aws_user_pools_web_client_id": process.env.AWS_COGNITO_USER_POOL_CLIENT_ID || "",
  "oauth": {},
  "aws_cognito_username_attributes": ["EMAIL"],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": ["EMAIL"],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": ["SMS"],
  "aws_cognito_password_protection_settings": {
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": ["EMAIL"],
  "aws_user_files_s3_bucket": process.env.AWS_S3_BUCKET || "",
  "aws_user_files_s3_bucket_region": process.env.AWS_REGION || "us-east-1",
  "aws_appsync_graphqlEndpoint": process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT || "",
  "aws_appsync_region": process.env.AWS_REGION || "us-east-1",
  "aws_appsync_authenticationType": "AWS_IAM",
  "aws_appsync_apiKey": process.env.AWS_APPSYNC_API_KEY || ""
};

// Update existing configuration with environment variables
try {
  if (fs.existsSync(clientConfigPath)) {
    const existingConfig = JSON.parse(fs.readFileSync(clientConfigPath, 'utf8'));
    const updatedConfig = { ...existingConfig, ...defaultConfig };
    fs.writeFileSync(clientConfigPath, JSON.stringify(updatedConfig, null, 2));
    console.log('Updated amplify configuration with environment variables');
  } else {
    // Create the directory if it doesn't exist
    const dir = path.dirname(clientConfigPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(clientConfigPath, JSON.stringify(defaultConfig, null, 2));
    console.log('Created new amplify configuration');
  }
} catch (error) {
  console.warn('Could not configure amplify:', error.message);
}