import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadData } from 'aws-amplify/storage';

interface AmplifyFileUploaderProps {
  onFilesUploaded: (files: Array<{ 
    key: string; 
    name: string; 
    size: number; 
    type: string; 
    pages: number 
  }>) => void;
  maxFileCount?: number;
  acceptedFileTypes?: string[];
}

interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  pages: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  file?: File;
}

const AmplifyFileUploader: React.FC<AmplifyFileUploaderProps> = ({
  onFilesUploaded,
  maxFileCount = 5,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate PDF pages (basic estimation)
  const calculatePages = (file: File): number => {
    if (file.type === 'application/pdf') {
      // Basic estimation: 1 page per 50KB for PDFs
      return Math.max(1, Math.ceil(file.size / 51200));
    }
    // For images and documents, assume 1 page
    return 1;
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }
    
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(extension)) {
      return `File type ${extension} is not supported`;
    }
    
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (type.includes('image')) {
      return <UploadIcon className="h-5 w-5 text-blue-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Real S3 upload using Amplify Storage
  const uploadToAmplifyStorage = async (file: File, onProgress?: (progress: number) => void): Promise<{ key: string; pages: number }> => {
    try {
      // Check if environment variables are available
      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
      
      if (!accessKeyId || !secretAccessKey) {
        throw new Error('AWS credentials are not properly configured');
      }
      
      // Create a unique key for the file
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `documents/${timestamp}_${cleanFileName}`;
      
      console.log('Uploading file to Amplify Storage:', file.name, 'with key:', key);
      
      if (onProgress) onProgress(25);
      
      // Upload using Amplify Storage
      const result = await uploadData({
        key,
        data: file,
        options: {
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (onProgress && totalBytes) {
              const progress = Math.round((transferredBytes / totalBytes) * 100);
              onProgress(Math.min(progress, 100));
            }
          }
        }
      }).result;
      
      const pages = calculatePages(file);
      
      console.log('File uploaded successfully to Amplify Storage:', result.key);
      
      return { 
        key: result.key, 
        pages 
      };
    } catch (error: any) {
      console.error('Amplify Storage upload error:', error);
      throw new Error(error.message || 'Upload failed');
    }
  };

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (uploadedFiles.length + fileArray.length > maxFileCount) {
      toast.error(`You can only upload up to ${maxFileCount} files`);
      return;
    }

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        continue;
      }

      const tempKey = `temp_${Date.now()}_${file.name}`;
      const newFile: UploadedFile = {
        key: tempKey,
        name: file.name,
        size: file.size,
        type: file.type,
        pages: 1,
        progress: 0,
        status: 'uploading',
        file
      };

      setUploadedFiles(prev => [...prev, newFile]);

      try {
        const result = await uploadToAmplifyStorage(file, (progress) => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.key === tempKey 
                ? { ...f, progress }
                : f
            )
          );
        });

        
        setUploadedFiles(prev => {
          const updated = prev.map(f => 
            f.key === tempKey 
              ? { ...f, key: result.key, status: 'completed' as const, progress: 100, pages: result.pages }
              : f
          );
          
          // Get all completed files
          const completedFiles = updated
            .filter(f => f.status === 'completed')
            .map(f => ({
              key: f.key,
              name: f.name,
              size: f.size,
              type: f.type,
              pages: f.pages
            }));
          
          // Save to localStorage for persistence
          localStorage.setItem('uploadedFiles', JSON.stringify(completedFiles));
          
          // Notify parent component
          setTimeout(() => {
            onFilesUploaded(completedFiles);
          }, 0);
          
          return updated;
        });
        
        toast.success(`${file.name} uploaded to S3 successfully!`);
        
      } catch (error) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.key === tempKey
              ? { ...f, status: 'error' as const }
              : f
          )
        );
        toast.error(`Failed to upload ${file.name} to S3`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (keyToRemove: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(file => file.key !== keyToRemove);
      
      const completedFiles = updated
        .filter(f => f.status === 'completed')
        .map(f => ({
          key: f.key,
          name: f.name,
          size: f.size,
          type: f.type,
          pages: f.pages
        }));
      
      localStorage.setItem('uploadedFiles', JSON.stringify(completedFiles));
      
      setTimeout(() => {
        onFilesUploaded(completedFiles);
      }, 0);
      
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5 text-green-600" />
            Upload Documents to AWS S3
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Drag and drop your files here
            </h3>
            <p className="text-gray-500 mb-4">
              Files will be uploaded to AWS S3 Storage
              <br />
              Support for PDF, Word, JPG, PNG and other formats (max 10MB each)
            </p>
            <Button onClick={handleBrowseClick} className="bg-green-600 hover:bg-green-700">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Uploaded to S3 Storage ({uploadedFiles.filter(f => f.status === 'completed').length}/{uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.pages} page{file.pages !== 1 ? 's' : ''}
                      </p>
                      {file.status === 'completed' && (
                        <p className="text-xs text-green-600">
                          Stored in S3: {file.key}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{file.progress}%</span>
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </span>
                    )}
                    
                    {file.status === 'error' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </span>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AmplifyFileUploader;