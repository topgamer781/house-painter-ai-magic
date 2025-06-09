
import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, FileImage } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (!imageFile) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    
    try {
      const imageUrl = URL.createObjectURL(imageFile);
      setTimeout(() => {
        onImageUpload(imageUrl);
        setIsUploading(false);
      }, 500);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };

  const sampleImages = [
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400"
  ];

  return (
    <div className="space-y-6">
      <Card
        className={`relative border-2 border-dashed transition-all duration-300 cursor-pointer hover:border-primary/50 ${
          isDragging 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-gray-300'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="block p-12 text-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-white" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isUploading ? 'Processing...' : 'Upload Your House Image'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports: JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
            
            {!isUploading && (
              <Button variant="outline" className="mt-4">
                <FileImage className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        </label>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Or try with sample images:</p>
        <div className="flex justify-center space-x-4">
          {sampleImages.map((imageUrl, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 overflow-hidden"
              onClick={() => onImageUpload(imageUrl)}
            >
              <div className="relative w-24 h-24">
                <img
                  src={imageUrl}
                  alt={`Sample house ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
