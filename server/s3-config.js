// AWS S3 Configuration for PrintLite
const AWS = require('aws-sdk');

// Configure AWS S3 with environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION || 'ap-south-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'uploadedfile25';

// Upload file to S3
async function uploadFileToS3(fileBuffer, fileName, contentType) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploads/${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return {
      success: true,
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get signed URL for file access
async function getSignedUrl(fileKey) {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Expires: 3600 // URL expires in 1 hour
    };
    
    const url = await s3.getSignedUrlPromise('getObject', params);
    return { success: true, url };
  } catch (error) {
    console.error('S3 Signed URL Error:', error);
    return { success: false, error: error.message };
  }
}

// List files in bucket
async function listFiles(prefix = 'uploads/') {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: prefix
    };
    
    const result = await s3.listObjectsV2(params).promise();
    return {
      success: true,
      files: result.Contents.map(file => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        url: `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${file.Key}`
      }))
    };
  } catch (error) {
    console.error('S3 List Files Error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  s3,
  BUCKET_NAME,
  uploadFileToS3,
  getSignedUrl,
  listFiles
};