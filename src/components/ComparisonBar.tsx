import { X, Scale, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AITool, ComparisonState } from '../types';
import { cn } from './ui/utils';

interface ComparisonBarProps {
  tools: AITool[];
  comparisonTools: ComparisonState;
  onRemove: (toolId: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export function ComparisonBar({ tools, comparisonTools, onRemove, onCompare, onClear }: ComparisonBarProps) {
  const selectedTools = tools.filter(tool => comparisonTools[tool.id]);
  
  if (selectedTools.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-card border-t shadow-lg z-40 animate-in slide-in-from-bottom duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-600" />
            <span className="font-medium hidden sm:inline">Compare Tools ({selectedTools.length}/2)</span>
            <span className="font-medium sm:hidden">Compare ({selectedTools.length}/2)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    Add tools by clicking the <Scale className="h-3 w-3 inline mx-1" /> icon in the tool card menu or detail view. 
                    Compare up to 2 tools side-by-side to find the best fit for your needs.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {selectedTools.map(tool => (
              <div
                key={tool.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
              >
                <span className="text-sm truncate max-w-[120px]">{tool.name}</span>
                <button
                  onClick={() => onRemove(tool.id)}
                  className="hover:bg-background rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={onCompare}
              disabled={selectedTools.length < 2}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Compare Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
