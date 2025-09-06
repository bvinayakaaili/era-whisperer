import React, { useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ERAS } from './EraSlider';

interface ImageComparisonProps {
  originalImage?: string;
  transformedImage?: string;
  currentEra: number;
  isLoading?: boolean;
  error?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  transformedImage,
  currentEra,
  isLoading = false,
  error,
}) => {
  const [imageComparison, setImageComparison] = useState(50); // Percentage for comparison slider
  const currentEraData = ERAS.find(era => era.year === currentEra) || ERAS[0];

  const handleDownload = () => {
    if (transformedImage) {
      const link = document.createElement('a');
      link.href = transformedImage;
      link.download = `era-blend-${currentEra}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!originalImage) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <CardContent>
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Upload an image to see the transformation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Era Transformation</span>
          {transformedImage && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Comparison container */}
          <div className="relative h-96 overflow-hidden">
            {/* Original image */}
            <div className="absolute inset-0">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                Original (Modern)
              </div>
            </div>

            {/* Transformed image overlay */}
            {transformedImage && (
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-300"
                style={{ clipPath: `inset(0 ${100 - imageComparison}% 0 0)` }}
              >
                <img
                  src={transformedImage}
                  alt={`Transformed to ${currentEra}`}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute bottom-2 right-2 px-2 py-1 bg-${currentEraData.color}/80 text-${currentEraData.color}-foreground text-xs rounded border border-${currentEraData.color}/50`}>
                  {currentEraData.label}
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Transforming to {currentEraData.label}...</p>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-lg">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Comparison slider */}
            {transformedImage && !isLoading && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                <div
                  className="w-0.5 bg-white shadow-lg pointer-events-auto cursor-ew-resize"
                  style={{ left: `${imageComparison}%` }}
                >
                  <div className="w-6 h-6 bg-white rounded-full -ml-3 -mt-3 absolute top-1/2 border-2 border-primary shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={imageComparison}
                  onChange={(e) => setImageComparison(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize pointer-events-auto"
                />
              </div>
            )}
          </div>

          {/* Timeline indicator */}
          {transformedImage && (
            <div className="p-4 bg-muted/30">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Original (2024)</span>
                <span className={`text-${currentEraData.color}-foreground font-medium`}>
                  Transformed ({currentEra})
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};