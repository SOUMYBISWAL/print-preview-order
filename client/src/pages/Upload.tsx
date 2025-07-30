import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUploader from "@/components/FileUploader";

const Upload = () => {
  const [, setLocation] = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ key: string; name: string; size: number; type: string; pages: number }>>([]);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const handleFilesUploaded = (files: Array<{ key: string; name: string; size: number; type: string; pages: number }>) => {
    setUploadedFiles(files);
    // Calculate total pages from all uploaded files
    const totalPages = files.reduce((sum, file) => sum + file.pages, 0);
    setTotalPageCount(totalPages);
    
    // Automatically proceed to print settings when files are uploaded
    if (files.length > 0) {
      // Store file information in localStorage for the print settings page
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
        pages: file.pages
      }));
      
      localStorage.setItem('uploadedFiles', JSON.stringify(fileData));
      localStorage.setItem('totalPages', totalPages.toString());

      // Navigate to print settings automatically
      toast.success("Files uploaded successfully! Redirecting to print settings...");
      setTimeout(() => {
        setLocation("/print-settings");
      }, 1000); // Small delay to show the success message
    }
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Upload Your Files</h1>
          
          {/* File Upload Component */}
          <FileUploader
            onFilesUploaded={handleFilesUploaded}
            maxFileCount={10}
            acceptedFileTypes={[
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'image/*',
              'text/plain'
            ]}
          />

          {uploadedFiles.length > 0 && (
            <Card className="mb-6 mt-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="text-lg font-bold text-green-600">
                    Preparing print settings... (Total Pages: {totalPageCount})
                  </div>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Redirecting to print settings...
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={() => setLocation("/")}>
              Cancel
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;