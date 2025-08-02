import React, { useState } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Image, File, X, Check, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { uploadFileToS3, calculatePages, type FileUploadResult } from "@/lib/amplify-storage";
import '@aws-amplify/ui-react/styles.css';

interface AmplifyFileUploaderProps {
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
  const [isUploading, setIsUploading] = useState(false);

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

  const handleUploadSuccess = (result: { key: string }) => {
    console.log('Upload successful:', result);
    toast.success('File uploaded successfully to S3!');
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    toast.error(`Upload failed: ${error}`);
  };

  const handleUploadStart = (file: File) => {
    const pages = calculatePages(file);
    const timestamp = Date.now();
    const key = `uploads/${timestamp}-${file.name}`;
    
    const newFile: UploadedFile = {
      key,
      name: file.name,
      size: file.size,
      type: file.type,
      pages,
      progress: 0,
      status: 'uploading'
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setIsUploading(true);
  };

  const handleUploadProgress = (progress: { transferredBytes: number; totalBytes: number; key: string }) => {
    const percentage = Math.round((progress.transferredBytes / progress.totalBytes) * 100);
    
    setUploadedFiles(prev => prev.map(file => 
      file.key === progress.key 
        ? { ...file, progress: percentage }
        : file
    ));
  };

  const processCompletedFiles = () => {
    const completedFiles = uploadedFiles
      .filter(file => file.status === 'completed')
      .map(file => ({
        key: file.key,
        name: file.name,
        size: file.size,
        type: file.type,
        pages: file.pages
      }));

    if (completedFiles.length > 0) {
      onFilesUploaded(completedFiles);
    }
  };

  const removeFile = (key: string) => {
    setUploadedFiles(prev => prev.filter(file => file.key !== key));
    
    // Update the parent component
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
        <CardTitle>Upload Your Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AWS Amplify FileUploader Component */}
        <FileUploader
          acceptedFileTypes={acceptedFileTypes}
          path="uploads/"
          maxFileCount={maxFileCount}
          isResumable
          autoUpload
          showThumbnails
          onUploadSuccess={({ key }: { key: string }) => {
            console.log('Upload successful:', key);
            setUploadedFiles(prev => prev.map(file => 
              file.key === key 
                ? { ...file, status: 'completed' as const, progress: 100 }
                : file
            ));
            setIsUploading(false);
            toast.success('File uploaded successfully to AWS S3!');
            processCompletedFiles();
          }}
          onUploadError={(error: string) => {
            console.error('Upload error:', error);
            toast.error(`Upload failed: ${error}`);
            setIsUploading(false);
          }}
          onUploadStart={({ file }: { file: File }) => handleUploadStart(file)}
          onUploadProgress={({ progress, key }: { progress: number; key: string }) => {
            setUploadedFiles(prev => prev.map(f => 
              f.key === key 
                ? { ...f, progress: Math.round(progress * 100) }
                : f
            ));
          }}
          components={{
            Container: ({ children, ...props }) => (
              <div 
                {...props}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              >
                {children}
              </div>
            ),
            FileList: ({ children, ...props }) => (
              <div {...props} className="mt-4 space-y-2">
                {children}
              </div>
            ),
            FilePicker: ({ children, ...props }) => (
              <div {...props} className="space-y-4">
                <div className="text-lg font-medium text-gray-700">
                  Drag and drop your files here
                </div>
                <div className="text-sm text-gray-500">
                  Support for PDF, Word, JPG, PNG and other image formats (max 10MB each)
                </div>
                {children}
              </div>
            )
          }}
        />

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Uploaded Files ({uploadedFiles.length})</h3>
            {uploadedFiles.map((file) => (
              <div key={file.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.pages} page{file.pages !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <>
                      <Progress value={file.progress} className="w-20" />
                      <Badge variant="secondary">{file.progress}%</Badge>
                    </>
                  )}
                  
                  {file.status === 'completed' && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Uploaded
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
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Files Button */}
        {uploadedFiles.some(file => file.status === 'completed') && (
          <Button 
            onClick={processCompletedFiles}
            className="w-full"
            disabled={isUploading}
          >
            Continue with {uploadedFiles.filter(f => f.status === 'completed').length} File{uploadedFiles.filter(f => f.status === 'completed').length !== 1 ? 's' : ''}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AmplifyFileUploader;