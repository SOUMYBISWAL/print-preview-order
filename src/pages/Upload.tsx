
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, FileImage, FilePdf } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} uploaded successfully`);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
      toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} uploaded successfully`);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    toast.info("File removed");
  };

  const handleContinue = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    // In a real application, we would upload files to a server here
    // For now, we'll simulate success and navigate to print settings
    toast.success("Files ready for printing");
    navigate("/print-settings", { state: { fileCount: files.length, totalPages: files.length * 5 } }); // Mocking page count
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FilePdf className="h-8 w-8 text-red-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Upload Your Files</h1>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp"
                />
                
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
                <p className="text-gray-500 mb-4">
                  Support for PDF, Word, JPG, PNG and other image formats
                </p>
                <Button onClick={handleTriggerFileInput}>
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {files.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Uploaded Files ({files.length})</h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <div className="ml-3">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button onClick={handleContinue} disabled={files.length === 0}>
              Continue to Print Settings
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
