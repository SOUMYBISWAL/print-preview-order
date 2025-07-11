import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, FileImage } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


interface FileWithPages extends File {
  pageCount?: number;
}

const Upload = () => {
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithPages[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCountingPages, setIsCountingPages] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(0);


  const countPagesInFile = async (file: FileWithPages): Promise<number> => {
    return new Promise((resolve) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // For PDF files, we try to count pages
      if (extension === 'pdf') {
        const fileReader = new FileReader();
        fileReader.onload = function() {
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
          
          // Simple page counting heuristic for PDF
          // This is a basic estimation - looking for "obj" patterns in the PDF
          // A real implementation would use a PDF library like PDF.js
          let text = '';
          for (let i = 0; i < typedArray.length; i++) {
            text += String.fromCharCode(typedArray[i]);
          }
          
          // Count pattern /Page objects in PDF
          const pagePattern = /\/Type[\s]*\/Page[^s]/g;
          const matches = text.match(pagePattern);
          const pageCount = matches ? matches.length : 1;
          
          resolve(pageCount);
        };
        fileReader.onerror = () => resolve(5); // Default if error
        fileReader.readAsArrayBuffer(file);
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
        // For images, count as 1 page
        resolve(1);
      } else {
        // For other documents like Word, etc., estimate based on size
        // This is a rough estimate - 3KB per page
        const sizeInKB = file.size / 1024;
        const estimatedPages = Math.max(1, Math.ceil(sizeInKB / 3));
        resolve(Math.min(estimatedPages, 20)); // Cap at 20 pages for estimation
      }
    });
  };

  const processFiles = async (newFiles: FileWithPages[]) => {
    setIsCountingPages(true);
    
    let pageCount = totalPageCount;
    const processedFiles = [...files];
    
    for (const file of newFiles) {
      try {
        const pages = await countPagesInFile(file);
        file.pageCount = pages;
        pageCount += pages;
        processedFiles.push(file);
      } catch (error) {
        console.error("Error counting pages:", error);
        file.pageCount = 5; // Default if error
        pageCount += 5;
        processedFiles.push(file);
      }
    }
    
    setFiles(processedFiles);
    setTotalPageCount(pageCount);
    setIsCountingPages(false);
    
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} uploaded successfully`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as FileWithPages[];
      processFiles(newFiles);
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
      const newFiles = Array.from(e.dataTransfer.files) as FileWithPages[];
      processFiles(newFiles);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    const removedFile = updatedFiles[index];
    const pageCount = removedFile.pageCount || 0;
    
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    setTotalPageCount(totalPageCount - pageCount);
    
    toast.info("File removed");
  };



  const handleContinue = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    // Store file information in localStorage for the print settings page
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      pages: file.pageCount || 1
    }));
    
    localStorage.setItem('uploadedFiles', JSON.stringify(fileData));
    localStorage.setItem('totalPages', totalPageCount.toString());

    // Navigate to print settings with actual page count
    toast.success("Files ready for printing");
    setLocation("/print-settings");
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText className="h-8 w-8 text-red-500" />;
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
          
          {isCountingPages && (
            <div className="text-center py-4">
              <p className="text-blue-600">Analyzing files and counting pages...</p>
            </div>
          )}
          
          {files.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Uploaded Files ({files.length})</h3>
                  <div className="text-sm font-medium">
                    Total Pages: {totalPageCount}
                  </div>
                </div>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <div className="ml-3">
                          <p className="font-medium">{file.name}</p>
                          <div className="flex items-center space-x-4">
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                            <p className="text-sm text-blue-600">
                              {file.pageCount || "-"} pages
                            </p>
                          </div>
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
            <Button onClick={handleContinue} disabled={files.length === 0 || isCountingPages}>
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
