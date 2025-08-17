import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadFile, useCreateFileMetadata } from '@/hooks/useAmplifyData';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  s3Key?: string;
}

interface AmplifyFileUploadComponentProps {
  onFilesUploaded?: (fileKeys: string[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
}

const AmplifyFileUploadComponent: React.FC<AmplifyFileUploadComponentProps> = ({
  onFilesUploaded,
  maxFiles = 10,
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png']
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadFile();
  const createFileMetadataMutation = useCreateFileMetadata();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      file,
      id: Date.now() + Math.random().toString(),
      progress: 0,
      status: 'uploading' as const
    }));

    if (uploadFiles.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = newFiles.filter(({ file }) => 
      !allowedTypes.some(type => file.name.toLowerCase().endsWith(type.replace('.', '')))
    );

    if (invalidFiles.length > 0) {
      toast.error(`Invalid file types. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    setUploadFiles(prev => [...prev, ...newFiles]);
    uploadNewFiles(newFiles);
  };

  const uploadNewFiles = async (filesToUpload: UploadFile[]) => {
    const uploadPromises = filesToUpload.map(async (uploadFile) => {
      try {
        const s3Key = `${Date.now()}-${uploadFile.file.name}`;
        
        // Update progress to 50% when starting upload
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 50 } : f
        ));

        // Upload to S3
        const uploadResult = await uploadFileMutation.mutateAsync({
          file: uploadFile.file,
          key: s3Key
        });

        // Update progress to 75%
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 75 } : f
        ));

        // Create metadata record in DynamoDB
        await createFileMetadataMutation.mutateAsync({
          fileName: uploadFile.file.name,
          fileSize: uploadFile.file.size,
          fileType: uploadFile.file.type,
          s3Key: s3Key,
          pageCount: getEstimatedPageCount(uploadFile.file)
        });

        // Mark as complete
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, progress: 100, status: 'success', s3Key } 
            : f
        ));

        return s3Key;
      } catch (error) {
        console.error('Upload error:', error);
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, status: 'error' } : f
        ));
        toast.error(`Failed to upload ${uploadFile.file.name}`);
        return null;
      }
    });

    const uploadedKeys = await Promise.all(uploadPromises);
    const successfulKeys = uploadedKeys.filter(key => key !== null) as string[];
    
    if (successfulKeys.length > 0) {
      onFilesUploaded?.(successfulKeys);
      toast.success(`${successfulKeys.length} file(s) uploaded successfully`);
    }
  };

  const getEstimatedPageCount = (file: File): number => {
    // Rough estimation based on file size
    // PDF: ~50KB per page, DOC: ~20KB per page
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const avgSizePerPage = isPdf ? 50000 : 20000;
    return Math.max(1, Math.ceil(file.size / avgSizePerPage));
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports: {allowedTypes.join(', ')} (Max {maxFiles} files)
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* File list */}
        {uploadFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Uploading Files</h4>
            {uploadFiles.map((uploadFile) => (
              <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{uploadFile.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                  {uploadFile.status === 'uploading' && (
                    <Progress value={uploadFile.progress} className="mt-2" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {uploadFile.status === 'success' && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {uploadFile.status === 'error' && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AmplifyFileUploadComponent;