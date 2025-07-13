import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, File, X, Check, Upload, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface LocalFileUploaderProps {
  onFilesUploaded: (files: Array<{ key: string; name: string; size: number; type: string }>) => void;
  maxFileCount?: number;
  acceptedFileTypes?: string[];
}

const LocalFileUploader: React.FC<LocalFileUploaderProps> = ({
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
  const [isDragOver, setIsDragOver] = useState(false);

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

  const isFileTypeAccepted = (fileType: string) => {
    return acceptedFileTypes.some(acceptedType => {
      if (acceptedType === 'image/*') {
        return fileType.startsWith('image/');
      }
      return fileType === acceptedType;
    });
  };

  const handleFileSelect = useCallback((files: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!isFileTypeAccepted(file.type)) {
        toast.error(`File type ${file.type} is not supported`);
        continue;
      }
      
      // Check file count limit
      if (uploadedFiles.length + newFiles.length >= maxFileCount) {
        toast.error(`Maximum ${maxFileCount} files allowed`);
        break;
      }
      
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const uploadedFile: UploadedFile = {
        file,
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      };
      
      newFiles.push(uploadedFile);
    }
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Simulate file upload process
      newFiles.forEach(fileData => {
        simulateUpload(fileData);
      });
    }
  }, [uploadedFiles.length, maxFileCount, acceptedFileTypes]);

  const simulateUpload = (fileData: UploadedFile) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Mark as completed
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, progress: 100, status: 'completed' as const }
              : f
          )
        );
        
        // Create a File object URL for local usage
        const fileKey = `local-${fileData.id}`;
        
        // Store file reference in localStorage for access during checkout
        const completedFiles = JSON.parse(localStorage.getItem('amplifyFiles') || '[]');
        const newFile = {
          key: fileKey,
          name: fileData.name,
          size: fileData.size,
          type: fileData.type
        };
        completedFiles.push(newFile);
        localStorage.setItem('amplifyFiles', JSON.stringify(completedFiles));
        
        // Notify parent component
        onFilesUploaded([newFile]);
        
        toast.success(`${fileData.name} uploaded successfully!`);
      } else {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, progress: Math.min(progress, 100) }
              : f
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    // Remove from localStorage as well
    const amplifyFiles = JSON.parse(localStorage.getItem('amplifyFiles') || '[]');
    const updatedFiles = amplifyFiles.filter((f: any) => !f.key.includes(fileId));
    localStorage.setItem('amplifyFiles', JSON.stringify(updatedFiles));
    
    toast.success("File removed");
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <Upload className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Drop files here or click to browse</h3>
              <p className="text-sm text-gray-500 mt-1">
                Supports PDF, Word documents, images, and text files
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum {maxFileCount} files, up to 10MB each
              </p>
            </div>
            <div>
              <Button asChild>
                <label className="cursor-pointer">
                  Choose Files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept={acceptedFileTypes.join(',')}
                    onChange={handleInputChange}
                  />
                </label>
              </Button>
            </div>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Uploaded Files</h4>
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(file.progress)}%</span>
                      </div>
                    )}
                    {file.status === 'completed' && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                    {file.status === 'error' && (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocalFileUploader;