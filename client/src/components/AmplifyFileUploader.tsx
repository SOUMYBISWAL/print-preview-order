import React, { useState } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, File, X, Check } from 'lucide-react';
import { toast } from "sonner";

interface AmplifyFileUploaderProps {
  onFilesUploaded: (files: Array<{ key: string; name: string; size: number; type: string }>) => void;
  maxFileCount?: number;
  acceptedFileTypes?: string[];
}

interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
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

  const handleUploadSuccess = ({ key }: { key?: string }) => {
    if (key) {
      setUploadedFiles(prev => {
        const updated = prev.map(file => 
          file.key === key 
            ? { ...file, status: 'completed' as const, progress: 100 }
            : file
        );
        
        // Get all completed files
        const completedFiles = updated
          .filter(f => f.status === 'completed')
          .map(f => ({
            key: f.key,
            name: f.name,
            size: f.size,
            type: f.type
          }));
        
        // Save to localStorage for checkout process
        localStorage.setItem('amplifyFiles', JSON.stringify(completedFiles));
        
        // Notify parent component
        onFilesUploaded(completedFiles);
        
        return updated;
      });
      
      toast.success("File uploaded successfully!");
    }
  };

  const handleUploadError = (error: string, { key }: { key?: string }) => {
    console.error('Upload error:', error);
    if (key) {
      setUploadedFiles(prev =>
        prev.map(file =>
          file.key === key
            ? { ...file, status: 'error' as const }
            : file
        )
      );
    }
    toast.error("Failed to upload file. Please try again.");
  };

  const handleUploadStart = ({ key, file }: { key?: string; file?: File }) => {
    if (key && file) {
      const newFile: UploadedFile = {
        key,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      };
      setUploadedFiles(prev => [...prev, newFile]);
    }
  };

  const removeFile = (keyToRemove: string) => {
    setUploadedFiles(prev => prev.filter(file => file.key !== keyToRemove));
    const remainingFiles = uploadedFiles.filter(f => f.key !== keyToRemove);
    onFilesUploaded(remainingFiles);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploader
            acceptedFileTypes={acceptedFileTypes}
            path="uploads/"
            maxFileCount={maxFileCount}
            isResumable
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            onUploadStart={handleUploadStart}
          />
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
                      <Badge variant="secondary">Uploading...</Badge>
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

export default AmplifyFileUploader;