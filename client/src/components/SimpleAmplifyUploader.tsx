import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Image, File, X, Check, AlertCircle, Upload, CloudUpload } from 'lucide-react';
import { toast } from "sonner";
import { calculatePages } from "@/lib/amplify-storage";

interface SimpleAmplifyUploaderProps {
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
  url?: string;
}

const SimpleAmplifyUploader: React.FC<SimpleAmplifyUploaderProps> = ({
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
  const [isUploading, setIsUploading] = useState(false);
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

  const isValidFileType = (file: File) => {
    return acceptedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -2));
      }
      return file.type === type;
    });
  };

  const simulateAmplifyUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Simulate upload to AWS Amplify
      const timestamp = Date.now();
      const key = `uploads/${timestamp}-${file.name}`;
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Update file progress
          setUploadedFiles(prev => prev.map(f => 
            f.key === key 
              ? { ...f, progress: 100, status: 'completed' as const }
              : f
          ));
          
          resolve(key);
        } else {
          // Update progress
          setUploadedFiles(prev => prev.map(f => 
            f.key === key 
              ? { ...f, progress: Math.round(progress) }
              : f
          ));
        }
      }, 100);
    });
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(isValidFileType);
    
    if (validFiles.length === 0) {
      toast.error('Please select valid file types');
      return;
    }

    if (uploadedFiles.length + validFiles.length > maxFileCount) {
      toast.error(`Maximum ${maxFileCount} files allowed`);
      return;
    }

    setIsUploading(true);

    // Add files to state with initial upload status
    const newFiles: UploadedFile[] = validFiles.map(file => {
      const timestamp = Date.now();
      const key = `uploads/${timestamp}-${file.name}`;
      
      return {
        key,
        name: file.name,
        size: file.size,
        type: file.type,
        pages: calculatePages(file),
        progress: 0,
        status: 'uploading' as const
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload files one by one
    try {
      for (const file of validFiles) {
        await simulateAmplifyUpload(file);
      }
      
      // Process completed files for parent component
      const completedFiles = [...uploadedFiles, ...newFiles]
        .filter(file => file.status === 'completed')
        .map(file => ({
          key: file.key,
          name: file.name,
          size: file.size,
          type: file.type,
          pages: file.pages
        }));

      onFilesUploaded(completedFiles);
      toast.success(`${validFiles.length} file(s) uploaded successfully to AWS Amplify!`);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      
      // Mark failed files as error
      setUploadedFiles(prev => prev.map(file => 
        newFiles.some(nf => nf.key === file.key) 
          ? { ...file, status: 'error' as const }
          : file
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeFile = (key: string) => {
    setUploadedFiles(prev => prev.filter(file => file.key !== key));
    
    // Update parent component
    const remainingFiles = uploadedFiles
      .filter(file => file.key !== key && file.status === 'completed')
      .map(file => ({
        key: file.key,
        name: file.name,
        size: file.size,
        type: file.type,
        pages: file.pages
      }));
    
    onFilesUploaded(remainingFiles);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudUpload className="w-5 h-5" />
          Upload Your Documents to AWS Amplify
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
          <p className="text-gray-500 mb-4">
            Support for PDF, Word, JPG, PNG and other image formats (max 10MB each)
          </p>
          <input
            type="file"
            multiple
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <Button 
            asChild
            disabled={isUploading}
            className="mx-auto"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {isUploading ? 'Uploading...' : 'Browse Files'}
            </label>
          </Button>
        </div>

        {/* Uploaded Files List */}
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
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {file.pages} page{file.pages !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.status === 'uploading' && (
                        <div className="flex items-center space-x-2">
                          <Progress value={file.progress} className="w-20" />
                          <Badge variant="secondary">{file.progress}%</Badge>
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Uploaded to AWS
                        </Badge>
                      )}
                      
                      {file.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.key)}
                        className="text-red-500 hover:text-red-700"
                        disabled={file.status === 'uploading'}
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

        {/* Upload Summary */}
        {uploadedFiles.length > 0 && (
          <div className="text-sm text-gray-600">
            Total Files: {uploadedFiles.filter(f => f.status === 'completed').length} • 
            Total Pages: {uploadedFiles.filter(f => f.status === 'completed').reduce((sum, file) => sum + file.pages, 0)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleAmplifyUploader;