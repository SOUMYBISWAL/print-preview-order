import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, File, X, Check, Upload, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { uploadData, remove } from 'aws-amplify/storage';

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  pages: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  key?: string; // S3 key for uploaded file
}

interface AmplifyFileUploaderProps {
  onFilesUploaded: (files: Array<{ key: string; name: string; size: number; type: string; pages: number }>) => void;
  maxFileCount?: number;
  acceptedFileTypes?: string[];
}

const AmplifyFileUploader: React.FC<AmplifyFileUploaderProps> = ({
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

  const countPDFPages = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(arrayBuffer);
      
      // Count '/Type /Page' occurrences in PDF
      const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
      if (pageMatches) {
        return pageMatches.length;
      }
      
      // Fallback: count '/Page ' references
      const altPageMatches = text.match(/\/Page\s/g);
      if (altPageMatches) {
        return Math.max(1, Math.floor(altPageMatches.length / 2));
      }
      
      // If no matches found, estimate based on file size (rough estimate)
      return Math.max(1, Math.floor(file.size / 50000));
    } catch (error) {
      console.warn('Error counting PDF pages:', error);
      // Fallback estimate based on file size
      return Math.max(1, Math.floor(file.size / 50000));
    }
  };

  const estimatePageCount = async (file: File): Promise<number> => {
    if (file.type === 'application/pdf') {
      return await countPDFPages(file);
    }
    
    // For Word documents, estimate based on file size
    if (file.type.includes('word') || file.type.includes('document')) {
      return Math.max(1, Math.floor(file.size / 30000)); // ~30KB per page estimate
    }
    
    // For text files, estimate based on content
    if (file.type === 'text/plain') {
      try {
        const text = await file.text();
        const lines = text.split('\n').length;
        return Math.max(1, Math.ceil(lines / 50)); // ~50 lines per page
      } catch {
        return 1;
      }
    }
    
    // For images and other files, default to 1 page
    return 1;
  };

  const isFileTypeAccepted = (fileType: string) => {
    return acceptedFileTypes.some(acceptedType => {
      if (acceptedType === 'image/*') {
        return fileType.startsWith('image/');
      }
      return fileType === acceptedType;
    });
  };

  const uploadToAmplify = async (fileData: UploadedFile) => {
    try {
      // Generate unique file key for S3 using Amplify Gen2 best practices
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const fileExtension = fileData.file.name.split('.').pop();
      const fileKey = `public/documents/${timestamp}-${randomId}.${fileExtension}`;

      // Upload to S3 using Amplify Gen2 Storage
      const result = await uploadData({
        key: fileKey,
        data: fileData.file,
        options: {
          contentType: fileData.file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round((transferredBytes / totalBytes) * 100);
              setUploadedFiles(prev => 
                prev.map(f => 
                  f.id === fileData.id 
                    ? { ...f, progress: Math.min(progress, 95) } // Cap at 95% until completion
                    : f
                )
              );
            }
          }
        }
      }).result;

      // Mark as completed
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileData.id 
            ? { ...f, progress: 100, status: 'completed' as const, key: fileKey }
            : f
        )
      );

      // Store file reference in sessionStorage (temporary for current session)
      const completedFiles = JSON.parse(sessionStorage.getItem('amplifyUploadedFiles') || '[]');
      const newFile = {
        key: fileKey,
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        pages: fileData.pages,
        uploadedAt: new Date().toISOString()
      };
      completedFiles.push(newFile);
      sessionStorage.setItem('amplifyUploadedFiles', JSON.stringify(completedFiles));

      // Notify parent component
      onFilesUploaded([newFile]);

      toast.success(`${fileData.name} uploaded successfully to Amplify Storage! (${fileData.pages} page${fileData.pages > 1 ? 's' : ''})`);
      
    } catch (error) {
      console.error('Amplify upload failed:', error);
      
      // Mark as error
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileData.id 
            ? { ...f, progress: 0, status: 'error' as const }
            : f
        )
      );

      toast.error(`Upload failed for ${fileData.name}. Please check your Amplify backend configuration.`);
    }
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
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
      
      // Count pages for the file
      toast.info(`Analyzing ${file.name}...`);
      const pageCount = await estimatePageCount(file);
      
      const uploadedFile: UploadedFile = {
        file,
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        pages: pageCount,
        progress: 0,
        status: 'uploading'
      };
      
      newFiles.push(uploadedFile);
    }
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Start uploading each file to Amplify
      newFiles.forEach(file => {
        uploadToAmplify(file);
      });
    }
  }, [uploadedFiles.length, maxFileCount, onFilesUploaded]);

  const removeFile = async (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    
    if (fileToRemove && fileToRemove.key && fileToRemove.key.startsWith('public/')) {
      try {
        // Remove from Amplify Storage
        await remove({ key: fileToRemove.key });
        toast.success(`${fileToRemove.name} removed from Amplify Storage`);
      } catch (error) {
        console.warn('Failed to remove from Amplify Storage:', error);
        toast.warning(`${fileToRemove.name} removed locally (Storage removal failed)`);
      }
    }

    // Remove from local state and sessionStorage
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    const storedFiles = JSON.parse(sessionStorage.getItem('amplifyUploadedFiles') || '[]');
    const updatedFiles = storedFiles.filter((f: any) => f.key !== fileToRemove?.key);
    sessionStorage.setItem('amplifyUploadedFiles', JSON.stringify(updatedFiles));
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
    <div className="space-y-4">
      <Card>
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
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Supports PDF, Word documents, images, and text files
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              Maximum {maxFileCount} files, up to 10MB each
            </p>
            
            <input
              type="file"
              multiple
              accept={acceptedFileTypes.join(',')}
              onChange={handleInputChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="cursor-pointer">
                Choose Files
              </Button>
            </label>
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
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.pages} page{file.pages > 1 ? 's' : ''}</span>
                        {file.key?.startsWith('public/') && (
                          <Badge variant="secondary" className="text-xs">
                            Amplify Storage
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{file.progress}%</span>
                      </div>
                    )}

                    {file.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Uploaded</span>
                      </div>
                    )}

                    {file.status === 'error' && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-600">Failed</span>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
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

export default AmplifyFileUploader;