import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 client configuration
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = 'printlite-storage-bucket';

// Check if bucket exists, create if not
export const ensureBucketExists = async (): Promise<boolean> => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`Bucket ${BUCKET_NAME} exists`);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') {
      try {
        await s3Client.send(new CreateBucketCommand({ 
          Bucket: BUCKET_NAME,
          CreateBucketConfiguration: {
            LocationConstraint: import.meta.env.VITE_AWS_REGION || 'ap-south-1'
          }
        }));
        console.log(`Bucket ${BUCKET_NAME} created successfully`);
        return true;
      } catch (createError) {
        console.error('Failed to create bucket:', createError);
        return false;
      }
    } else {
      console.error('Error checking bucket:', error);
      return false;
    }
  }
};

// Upload file to S3
export const uploadFileToS3 = async (
  file: File, 
  key: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Ensure bucket exists first
    const bucketExists = await ensureBucketExists();
    if (!bucketExists) {
      return { success: false, error: 'Failed to ensure bucket exists' };
    }

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
    };

    // For now, we'll do a simple upload. For large files, we could implement multipart upload
    const command = new PutObjectCommand(uploadParams);
    
    if (onProgress) onProgress(50); // Simulate progress
    
    const result = await s3Client.send(command);
    
    if (onProgress) onProgress(100);
    
    const url = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;
    
    console.log('File uploaded successfully to S3:', url);
    return { success: true, url };
    
  } catch (error: any) {
    console.error('S3 upload error:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
};

// Generate a unique file key
export const generateFileKey = (fileName: string): string => {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `documents/${timestamp}_${cleanFileName}`;
};

export { s3Client, BUCKET_NAME };