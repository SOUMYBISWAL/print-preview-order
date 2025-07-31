import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export interface FileUploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export async function uploadFileToS3(file: File, folder: string = 'uploads'): Promise<FileUploadResult> {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to S3
    const result = await uploadData({
      path: filePath,
      data: file,
      options: {
        contentType: file.type,
        contentDisposition: `attachment; filename="${file.name}"`,
      }
    }).result;

    // Get the URL for the uploaded file
    const urlResult = await getUrl({ path: filePath });

    return {
      success: true,
      fileUrl: urlResult.url.toString(),
      fileName: fileName,
      fileSize: file.size,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function getFileUrl(filePath: string): Promise<string | null> {
  try {
    const result = await getUrl({ path: filePath });
    return result.url.toString();
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await remove({ path: filePath });
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export function calculatePages(file: File): number {
  const fileType = file.type;
  const fileSize = file.size;

  // Estimate pages based on file type and size
  if (fileType === 'application/pdf') {
    // PDFs: approximately 200KB per page
    return Math.max(1, Math.ceil(fileSize / (200 * 1024)));
  } else if (fileType.includes('word') || fileType.includes('document')) {
    // Word documents: approximately 100KB per page
    return Math.max(1, Math.ceil(fileSize / (100 * 1024)));
  } else if (fileType.startsWith('image/')) {
    // Images: 1 page per file
    return 1;
  } else if (fileType === 'text/plain') {
    // Text files: approximately 5KB per page
    return Math.max(1, Math.ceil(fileSize / (5 * 1024)));
  } else {
    // Other documents: approximately 150KB per page
    return Math.max(1, Math.ceil(fileSize / (150 * 1024)));
  }
}