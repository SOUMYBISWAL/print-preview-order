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
    console.error('Error checking bucket:', error);
    
    if (error.name === 'NotFound' || error.name === 'NoSuchBucket') {
      try {
        const createParams: any = { Bucket: BUCKET_NAME };
        
        // Only add LocationConstraint if not us-east-1
        const region = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
        if (region !== 'us-east-1') {
          createParams.CreateBucketConfiguration = {
            LocationConstraint: region
          };
        }
        
        await s3Client.send(new CreateBucketCommand(createParams));
        console.log(`Bucket ${BUCKET_NAME} created successfully`);
        return true;
      } catch (createError: any) {
        console.error('Failed to create bucket:', createError);
        if (createError.name === 'BucketAlreadyExists' || createError.name === 'BucketAlreadyOwnedByYou') {
          console.log('Bucket already exists, proceeding...');
          return true;
        }
        return false;
      }
    } else if (error.name === 'AccessDenied') {
      console.error('Access denied - check AWS credentials and permissions');
      return false;
    } else if (error.name === 'CredentialsError' || error.name === 'InvalidAccessKeyId') {
      console.error('Invalid AWS credentials');
      return false;
    } else {
      console.error('Unknown S3 error:', error.name, error.message);
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
    if (onProgress) onProgress(10);
    
    // Check AWS credentials first
    const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
    const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
    const region = import.meta.env.VITE_AWS_REGION;
    
    if (!accessKeyId || !secretAccessKey || !region) {
      console.error('Missing AWS credentials:', { accessKeyId: !!accessKeyId, secretAccessKey: !!secretAccessKey, region: !!region });
      return { success: false, error: 'AWS credentials not configured properly' };
    }
    
    if (onProgress) onProgress(25);
    
    // Ensure bucket exists first
    const bucketExists = await ensureBucketExists();
    if (!bucketExists) {
      return { success: false, error: 'Failed to access or create S3 bucket. Please check AWS credentials and permissions.' };
    }

    if (onProgress) onProgress(50);

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    
    if (onProgress) onProgress(75);
    
    const result = await s3Client.send(command);
    
    if (onProgress) onProgress(100);
    
    const url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
    
    console.log('File uploaded successfully to S3:', url);
    return { success: true, url };
    
  } catch (error: any) {
    console.error('S3 upload error:', error);
    
    let errorMessage = 'Upload failed';
    if (error.name === 'AccessDenied') {
      errorMessage = 'Access denied - check AWS permissions for S3';
    } else if (error.name === 'InvalidAccessKeyId') {
      errorMessage = 'Invalid AWS Access Key ID';
    } else if (error.name === 'SignatureDoesNotMatch') {
      errorMessage = 'Invalid AWS Secret Access Key';
    } else if (error.name === 'CredentialsError') {
      errorMessage = 'AWS credentials error';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Generate a unique file key
export const generateFileKey = (fileName: string): string => {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `documents/${timestamp}_${cleanFileName}`;
};

export { s3Client, BUCKET_NAME };