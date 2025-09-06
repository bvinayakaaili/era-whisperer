import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  onRemoveImage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find(file => file.type.startsWith('image/'));
      
      if (imageFile) {
        onImageUpload(imageFile);
      }
    },
    [onImageUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  if (currentImage) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          <div className="relative group">
            <img
              src={currentImage}
              alt="Uploaded reference"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemoveImage}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Remove Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-300 hover:border-primary/50 cursor-pointer ${
        isDragOver ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`p-4 rounded-full transition-all duration-300 ${isDragOver ? 'bg-primary/20' : 'bg-muted'}`}>
            <ImageIcon className={`w-8 h-8 transition-colors duration-300 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload Reference Image</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop an image here, or click to browse
            </p>
          </div>

          <Button variant="temporal" className="mt-4">
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
          </Button>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </CardContent>
    </Card>
  );
};