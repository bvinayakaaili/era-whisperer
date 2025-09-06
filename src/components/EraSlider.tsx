import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Era {
  year: number;
  label: string;
  description: string;
  color: 'vintage' | 'classic' | 'modern' | 'future';
}

export const ERAS: Era[] = [
  {
    year: 1900,
    label: '1900s',
    description: 'Victorian Era - Sepia tones, formal portraits',
    color: 'vintage',
  },
  {
    year: 1950,
    label: '1950s',
    description: 'Golden Age - Classic photography, vibrant colors',
    color: 'classic',
  },
  {
    year: 2000,
    label: '2000s',
    description: 'Digital Era - Sharp, modern aesthetics',
    color: 'modern',
  },
  {
    year: 2050,
    label: '2050s',
    description: 'Future Vision - Holographic, enhanced reality',
    color: 'future',
  },
];

interface EraSliderProps {
  currentEra: number;
  onEraChange: (era: number) => void;
  isLoading?: boolean;
}

export const EraSlider: React.FC<EraSliderProps> = ({
  currentEra,
  onEraChange,
  isLoading = false,
}) => {
  const currentEraData = ERAS.find(era => era.year === currentEra) || ERAS[0];

  const handleSliderChange = (values: number[]) => {
    const value = values[0];
    // Map slider value (0-3) to era indices
    const eraIndex = Math.round(value);
    const selectedEra = ERAS[Math.min(eraIndex, ERAS.length - 1)];
    onEraChange(selectedEra.year);
  };

  const getSliderValue = () => {
    const eraIndex = ERAS.findIndex(era => era.year === currentEra);
    return [Math.max(0, eraIndex)];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Time Period</span>
          <span className={`text-sm px-3 py-1 rounded-full bg-${currentEraData.color}/20 text-${currentEraData.color}-foreground border border-${currentEraData.color}/30`}>
            {currentEraData.label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Slider
            value={getSliderValue()}
            onValueChange={handleSliderChange}
            max={ERAS.length - 1}
            step={1}
            className={`w-full ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          />
          
          {/* Era markers */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {ERAS.map((era, index) => (
              <div
                key={era.year}
                className={`flex flex-col items-center transition-all duration-300 ${
                  era.year === currentEra 
                    ? `text-${era.color}-foreground scale-110` 
                    : 'hover:scale-105'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mb-1 bg-${era.color} ${
                  era.year === currentEra ? 'shadow-glow' : ''
                }`} />
                <span>{era.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current era description */}
        <div className="text-center p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-sm text-muted-foreground">
            {currentEraData.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};