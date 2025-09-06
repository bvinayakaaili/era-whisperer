import React, { useState, useCallback } from 'react';
import { TextInput } from '@/components/TextInput';
import { EraSlider } from '@/components/EraSlider';
import { ImageComparison } from '@/components/ImageComparison';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import heroBackground from '@/assets/hero-background.jpg';

const Index = () => {
  const [currentText, setCurrentText] = useState<string>();
  const [generatedImages, setGeneratedImages] = useState<{ [era: number]: string }>({});
  const [currentEra, setCurrentEra] = useState<number>(2000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleTextSubmit = useCallback(async (text: string) => {
    setCurrentText(text);
    setGeneratedImages({});
    setError(undefined);
    
    // Generate images for all eras
    const eras = [1900, 1950, 2000, 2050];
    
    for (const era of eras) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            era: era,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate image for ${era}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setGeneratedImages(prev => ({
          ...prev,
          [era]: data.imageUrl
        }));
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to generate image for ${era}`;
        setError(errorMessage);
        toast.error(errorMessage);
        break; // Stop generating if one fails
      }
    }
    
    setIsLoading(false);
    if (!error) {
      toast.success('All era images generated successfully!');
    }
  }, []);

  const handleEraChange = useCallback((era: number) => {
    setCurrentEra(era);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Clock className="w-12 h-12 text-primary animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-vintage via-modern to-future bg-clip-text text-transparent">
                Era Blender
              </h1>
              <Sparkles className="w-12 h-12 text-future animate-bounce" />
            </div>
            
            <h2 className="text-2xl text-foreground/90 font-light">
              Transform Any Image Across Time Periods
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Powered by Google Gemini 2.5 Flash, describe any scene and watch it come to life 
              across different eras - from vintage 1900s to futuristic 2050s.
            </p>

            <div className="flex items-center justify-center gap-6 pt-8">
              <div className="flex items-center gap-2 text-vintage-foreground">
                <div className="w-3 h-3 rounded-full bg-vintage shadow-[0_0_10px_hsl(var(--vintage))]" />
                <span className="text-sm">1900s Vintage</span>
              </div>
              <div className="flex items-center gap-2 text-modern-foreground">
                <div className="w-3 h-3 rounded-full bg-modern shadow-[0_0_10px_hsl(var(--modern))]" />
                <span className="text-sm">2000s Digital</span>
              </div>
              <div className="flex items-center gap-2 text-future-foreground">
                <div className="w-3 h-3 rounded-full bg-future shadow-[0_0_10px_hsl(var(--future))]" />
                <span className="text-sm">2050s Future</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <div className="container mx-auto px-6 py-16 space-y-12">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Describe Your Vision
            </h3>
            <p className="text-muted-foreground">
              Describe any scene, location, or setting and watch it materialize across different time periods
            </p>
          </div>
          
          <TextInput
            onTextSubmit={handleTextSubmit}
            currentText={currentText}
            isLoading={isLoading}
          />
        </div>

        {/* Controls and Results */}
        {currentText && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Era Slider */}
            <div className="xl:col-span-1">
              <EraSlider
                currentEra={currentEra}
                onEraChange={handleEraChange}
                isLoading={isLoading}
              />
            </div>

            {/* Image Gallery */}
            <div className="xl:col-span-2">
              <ImageComparison
                generatedImages={generatedImages}
                currentEra={currentEra}
                isLoading={isLoading}
                error={error}
                currentText={currentText}
              />
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-6xl mx-auto pt-16">
          <h3 className="text-2xl font-bold text-center mb-12">Powered by Advanced AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-vintage" />
                  Historical Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI-powered image generation that captures the authentic aesthetics, 
                  lighting, and architectural styles of each historical period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-modern" />
                  Seamless Continuity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced text-to-image generation that maintains thematic consistency 
                  while adapting visual elements to match different time periods.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-future" />
                  Instant Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fast processing powered by Google Gemini 2.5 Flash for 
                  instant era-specific image generation with stunning quality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
