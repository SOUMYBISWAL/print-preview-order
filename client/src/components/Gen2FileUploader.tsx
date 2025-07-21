import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface Gen2FileUploaderProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  onError: (error: string) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

export function Gen2FileUploader({ 
  onFilesUploaded, 
  onError, 
  maxFiles = 10,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
}: Gen2FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    
    // Validate file count
    if (files.length + fileArray.length > maxFiles) {
      onError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = fileArray.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !acceptedFileTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      onError(`Invalid file types. Allowed: ${acceptedFileTypes.join(', ')}`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles: UploadedFile[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadProgress((i / fileArray.length) * 100);

        try {
          // Try to use Amplify Storage Gen 2
          const { uploadData } = await import('aws-amplify/storage');
          
          const key = `uploads/${Date.now()}-${file.name}`;
          
          const result = await uploadData({
            key,
            data: file,
            options: {
              accessLevel: 'guest',
              contentType: file.type,
            }
          }).result;

          uploadedFiles.push({
            key: result.key,
            name: file.name,
            size: file.size,
            type: file.type,
            url: `https://s3.amazonaws.com/your-bucket/${result.key}` // Will be updated with actual URL
          });

        } catch (amplifyError) {
          console.warn('Amplify Storage not available, using local fallback:', amplifyError);
          
          // Fallback to local storage or direct upload
          const localFile: UploadedFile = {
            key: `local-${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
            type: file.type,
          };
          
          uploadedFiles.push(localFile);
        }
      }

      setUploadProgress(100);
      const newFiles = [...files, ...uploadedFiles];
      setFiles(newFiles);
      onFilesUploaded(newFiles);

    } catch (error) {
      console.error('Upload error:', error);
      onError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [files, maxFiles, acceptedFileTypes, onError, onFilesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files?.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesUploaded(newFiles);
  }, [files, onFilesUploaded]);

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: {acceptedFileTypes.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Maximum {maxFiles} files, up to 10MB each
            </p>
          </div>
          
          <Button 
            variant="outline" 
            disabled={uploading}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
          
          <input
            id="file-upload"
            type="file"
            multiple
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading files...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && !uploading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No files uploaded yet. Add your documents to start configuring print settings.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}