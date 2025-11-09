import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './ui/utils';
import { AITool } from '../types';
import { AIToolIcon } from './AIToolIcon';

interface FeaturedBannerProps {
  tools: AITool[];
  onInstall: (tool: AITool) => void;
  onToolClick: (tool: AITool) => void;
}

export function FeaturedBanner({ tools, onInstall, onToolClick }: FeaturedBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || tools.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tools.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, tools.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % tools.length);
  };

  const prevSlide = () => {
    goToSlide(currentIndex === 0 ? tools.length - 1 : currentIndex - 1);
  };

  if (tools.length === 0) return null;

  const currentTool = tools[currentIndex];

  return (
    <div className="relative mx-4 my-4">
      <Card 
        className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-600 text-white border-0 cursor-pointer"
        onClick={() => onToolClick(currentTool)}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative p-6 flex items-center justify-between">
          <div className="flex-1">
            {currentTool.trending && (
              <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-0">
                {currentTool.trending}
              </Badge>
            )}
            <h2 className="text-xl md:text-2xl mb-2">{currentTool.name}</h2>
            <p className="text-white/90 text-sm mb-4 max-w-md">{currentTool.description}</p>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onInstall(currentTool);
              }}
              className="bg-white text-emerald-600 hover:bg-white/90 rounded-full px-6"
            >
              Install
            </Button>
          </div>
          
          <div className="hidden md:flex items-center justify-center w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm">
            <AIToolIcon icon={currentTool.icon} name={currentTool.id} size="large" />
          </div>
        </div>

        {/* Navigation Arrows */}
        {tools.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </Card>

      {/* Slide Indicators */}
      {tools.length > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-3">
          {tools.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex 
                  ? 'w-8 bg-emerald-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
