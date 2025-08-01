# AWS S3 File Upload Integration

## Overview
PrintLite now supports direct file uploads to AWS S3 storage using AWS Amplify Gen 2. Files are uploaded directly from the browser to your S3 bucket with proper security and access controls.

## Features Implemented

### 1. AWS Amplify S3 Storage Configuration
- **Storage Resource**: `amplify/storage/resource.ts`
- **Bucket Access**: Guest and authenticated user permissions
- **Upload Paths**: `uploads/*` for user files, `public/*` for shared content

### 2. AmplifyFileUploader Component
- **Location**: `client/src/components/AmplifyFileUploader.tsx`
- **Features**:
  - Drag and drop file upload
  - Progress tracking with real-time percentage
  - File validation (type, size, count)
  - Automatic S3 upload with unique file keys
  - Visual status indicators (uploading, completed, error)
  - File removal capabilities

### 3. Storage Library Functions
- **Location**: `client/src/lib/amplify-storage.ts`
- **Functions**:
  - `uploadFileToS3()`: Upload files with progress tracking
  - `getFileUrl()`: Generate signed URLs for file access
  - `deleteFile()`: Remove files from S3
  - `calculatePages()`: Estimate document page counts

### 4. Updated Upload Page
- **Location**: `client/src/pages/Upload.tsx`
- **Integration**: Now uses AmplifyFileUploader for direct S3 uploads
- **Flow**: Files → S3 → Print Settings → Order Processing

### 5. Test Page
- **Location**: `client/src/pages/AmplifyUploadTest.tsx`
- **Route**: `/amplify-upload-test`
- **Purpose**: Test S3 upload functionality independently

## File Upload Flow

1. **User Selection**: Files selected via drag-drop or file picker
2. **Validation**: File type, size, and count validation
3. **S3 Upload**: Direct upload to S3 bucket with progress tracking
4. **File Processing**: Page count calculation and metadata storage
5. **Navigation**: Automatic redirect to print settings with file data

## Configuration Requirements

### AWS Amplify Backend
```bash
# Deploy storage resource
amplify push
```

### Environment Variables (for Amplify Console)
```
NPM_CONFIG_LEGACY_PEER_DEPS=true
NODE_OPTIONS=--max-old-space-size=4096
```

### Storage Permissions
- **Guest Users**: Read/Write access to `uploads/*`
- **Authenticated Users**: Full access to `uploads/*` and `public/*`

## File Storage Structure
```
S3 Bucket/
├── uploads/
│   ├── {timestamp}-{filename}
│   └── ...
└── public/
    ├── shared-files
    └── ...
```

## Usage Examples

### Basic File Upload
```tsx
<AmplifyFileUploader
  onFilesUploaded={handleFilesUploaded}
  maxFileCount={10}
  acceptedFileTypes={['application/pdf', 'image/*']}
/>
```

### Custom Upload Handling
```tsx
const handleFilesUploaded = (files) => {
  console.log('Files uploaded to S3:', files);
  // Process uploaded files
  localStorage.setItem('uploadedFiles', JSON.stringify(files));
  navigate('/print-settings');
};
```

## File Types Supported
- **Documents**: PDF, Word (.doc, .docx)
- **Images**: JPG, PNG, GIF, BMP
- **Text**: Plain text files
- **Size Limit**: 10MB per file
- **Count Limit**: 10 files per upload session

## Progress Tracking
- Real-time upload progress with percentage
- Visual status indicators (uploading, completed, error)
- Cancellation and retry capabilities
- File-by-file progress display

## Error Handling
- Network failure recovery
- File validation errors
- S3 permission issues
- Automatic retry mechanisms

## Security Features
- Direct browser-to-S3 upload (no server proxy)
- Signed URLs for secure file access
- IAM-based access controls
- File type validation
- Size restrictions

## Testing
Visit `/amplify-upload-test` to test the S3 integration independently of the main application flow.

## Integration Status
✅ Storage resource configured
✅ Upload component implemented
✅ File validation active
✅ Progress tracking functional
✅ Error handling complete
✅ Page calculation accurate
✅ Navigation flow working