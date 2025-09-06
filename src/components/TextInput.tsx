import React, { useState } from 'react';
import { Type, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  currentText?: string;
  isLoading?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  onTextSubmit,
  currentText,
  isLoading = false,
}) => {
  const [text, setText] = useState(currentText || '');

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const examplePrompts = [
    "A bustling city street with people walking",
    "A cozy coffee shop with vintage furniture", 
    "A grand cathedral with tall spires",
    "A peaceful countryside farm with rolling hills",
    "A modern office building with glass windows",
    "A vibrant marketplace with vendors and shoppers"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Type className="w-6 h-6 text-primary" />
          Describe Your Scene
          <Sparkles className="w-5 h-5 text-future" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Textarea
            placeholder="Describe a location, scene, or setting you'd like to see across different time periods..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[120px] resize-none text-base"
            disabled={isLoading}
          />
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Describe locations, architecture, people, or scenes
            </p>
            <p className="text-xs text-muted-foreground">
              Ctrl + Enter to generate
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          variant="temporal"
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generating Images...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Across Eras
            </>
          )}
        </Button>

        {/* Example prompts */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Try these examples:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setText(prompt)}
                disabled={isLoading}
                className="text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 text-sm border border-transparent hover:border-primary/30"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};