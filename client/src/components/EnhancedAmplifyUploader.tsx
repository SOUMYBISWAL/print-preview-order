import React, { useState } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EnhancedAmplifyUploaderProps {
  onUploadComplete?: (files: any[]) => void;
}

export const EnhancedAmplifyUploader: React.FC<EnhancedAmplifyUploaderProps> = ({ onUploadComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleUploadSuccess = (event: any) => {
    console.log('Upload successful:', event);
    const newFile = {
      key: event.key,
      name: event.key.split('/').pop(),
      url: event.url || event.key,
      size: event.size || 0,
      type: event.contentType || 'unknown',
      pages: estimatePages(event.key.split('/').pop() || '', event.size || 0)
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
    setIsUploading(false);
    
    // Clear progress for this file
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[event.key];
      return newProgress;
    });
    
    if (onUploadComplete) {
      onUploadComplete([...uploadedFiles, newFile]);
    }
    
    toast({
      title: "Upload Successful",
      description: `${newFile.name} uploaded successfully (${newFile.pages} pages)`,
    });
  };

  const handleUploadStart = (event: any) => {
    setIsUploading(true);
    console.log('Upload started:', event);
    toast({
      title: "Upload Started",
      description: "Your file is being uploaded to AWS S3...",
    });
  };

  const handleUploadProgress = (event: any) => {
    console.log('Upload progress:', event);
    if (event.key && event.transferredBytes && event.totalBytes) {
      const progress = Math.round((event.transferredBytes / event.totalBytes) * 100);
      setUploadProgress(prev => ({
        ...prev,
        [event.key]: progress
      }));
    }
  };

  const handleUploadError = (error: any) => {
    console.error('Upload error:', error);
    setIsUploading(false);
    toast({
      title: "Upload Failed",
      description: error.message || "Failed to upload file to S3",
      variant: "destructive",
    });
  };

  // Estimate pages based on file type and size
  const estimatePages = (fileName: string, fileSize: number): number => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!fileSize) return 1;
    
    switch (extension) {
      case 'pdf':
        return Math.max(1, Math.ceil(fileSize / (200 * 1024))); // 200KB per page
      case 'doc':
      case 'docx':
        return Math.max(1, Math.ceil(fileSize / (100 * 1024))); // 100KB per page
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 1; // Images are typically 1 page
      case 'txt':
        return Math.max(1, Math.ceil(fileSize / (5 * 1024))); // 5KB per page
      default:
        return Math.max(1, Math.ceil(fileSize / (150 * 1024))); // 150KB per page
    }
  };

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'txt':
        return '📃';
      default:
        return '📁';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Your Documents to AWS S3</CardTitle>
        <CardDescription>
          Upload files directly to AWS S3 storage for printing. Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUploader
          acceptedFileTypes={[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'text/plain'
          ]}
          path="public/uploads/"
          maxFileCount={10}
          maxFileSize={50000000} // 50MB
          isResumable={true}
          showThumbnails={true}
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onUploadProgress={handleUploadProgress}
        />
        
        {isUploading && Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-blue-700">Uploading to AWS S3...</h4>
            {Object.entries(uploadProgress).map(([key, progress]) => (
              <div key={key} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-700 font-medium">
                    {key.split('/').pop()}
                  </p>
                  <Badge variant="secondary">{progress}%</Badge>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            ))}
          </div>
        )}
        
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Files Uploaded to S3 ({uploadedFiles.length})</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileTypeIcon(file.name)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}</span>
                        <span>•</span>
                        <span>{file.pages} pages</span>
                        <span>•</span>
                        <span className="text-green-600">S3 Storage</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Ready for Print
                  </Badge>
                </div>
              ))}
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 font-medium">
                  Total: {uploadedFiles.length} files, {uploadedFiles.reduce((sum, file) => sum + file.pages, 0)} pages
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Files stored in AWS S3 - Ready to configure print settings
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};