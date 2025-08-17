import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, File, X, Check, Upload as UploadIcon } from 'lucide-react';
import { toast } from "sonner";
// File upload functionality using backend API

interface FileUploaderProps {
  onFilesUploaded: (files: Array<{ key: string; name: string; size: number; type: string; pages: number }>) => void;
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

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesUploaded,
  maxFileCount = 10,
  acceptedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/*',
    'text/plain'
  ]
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="w-5 h-5 text-blue-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    // Check file type
    const isValidType = acceptedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return 'File type not supported';
    }

    return null;
  };

  const calculatePages = (file: File): number => {
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
  };

  const uploadFile = async (file: File): Promise<{ key: string; pages: number }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const result = await response.json();
      console.log('File upload successful:', result);
      
      return { 
        key: result.file?.key || result.key || file.name,
        pages: result.file?.pages || calculatePages(file)
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
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
        pages: 1, // Temporary value, will be updated from backend
        progress: 0,
        status: 'uploading',
        file
      };

      setUploadedFiles(prev => [...prev, newFile]);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.key === tempKey 
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            )
          );
        }, 200);

        const result = await uploadFile(file);
        
        clearInterval(progressInterval);
        
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
          
          // Save to localStorage for checkout process
          localStorage.setItem('uploadedFiles', JSON.stringify(completedFiles));
          
          // Schedule parent notification for next tick to avoid setState during render
          setTimeout(() => {
            onFilesUploaded(completedFiles);
          }, 0);
          
          return updated;
        });
        
        toast.success(`${file.name} uploaded successfully!`);
        
      } catch (error) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.key === tempKey
              ? { ...f, status: 'error' as const }
              : f
          )
        );
        toast.error(`Failed to upload ${file.name}`);
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
      
      // Schedule parent notification for next tick to avoid setState during render
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
          <CardTitle>Upload Your Documents</CardTitle>
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
            <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
            <p className="text-gray-500 mb-4">
              Support for PDF, Word, JPG, PNG and other image formats (max 10MB each)
            </p>
            <Button onClick={handleBrowseClick}>
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <Badge variant="secondary">{file.progress}%</Badge>
                      </div>
                    )}
                    {file.status === 'completed' && (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                    {file.status === 'error' && (
                      <Badge variant="destructive">Error</Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.key)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
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

export default FileUploader;