#!/bin/bash

# Manual S3 Setup Script for PrintLite
echo "🚀 Setting up S3 bucket manually..."

BUCKET_NAME="printlite-storage-manual-$(date +%s)"
REGION="ap-south-1"

echo "Creating S3 bucket: $BUCKET_NAME"

# Create the bucket
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION"

if [ $? -eq 0 ]; then
  echo "✅ S3 bucket created successfully: $BUCKET_NAME"
  
  # Set CORS policy
  echo "Setting CORS policy..."
  aws s3api put-bucket-cors \
    --bucket "$BUCKET_NAME" \
    --cors-configuration file://cors-config.json
  
  if [ $? -eq 0 ]; then
    echo "✅ CORS policy applied"
  else
    echo "⚠️ CORS policy failed, but bucket is created"
  fi
  
  # Generate amplify_outputs.json
  cat > amplify_outputs.json << EOF
{
  "version": "1.4",
  "storage": {
    "aws_region": "$REGION",
    "bucket_name": "$BUCKET_NAME"
  },
  "auth": {
    "aws_region": "$REGION",
    "user_pool_id": "manual-setup",
    "user_pool_client_id": "manual-setup",
    "identity_pool_id": "$REGION:manual-setup"
  }
}
EOF
  
  echo "✅ Configuration file generated: amplify_outputs.json"
  echo ""
  echo "🎉 Manual S3 setup complete!"
  echo "Bucket name: $BUCKET_NAME"
  echo "Region: $REGION"
  echo ""
  echo "Next steps:"
  echo "1. Update client/src/lib/amplify-config.ts with bucket name"
  echo "2. Restart your application"
  echo "3. Test file uploads"
  
else
  echo "❌ Failed to create S3 bucket"
  echo "Please check your AWS credentials and try again"
fi