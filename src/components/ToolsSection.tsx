import { ChevronRight, Grid, List, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { ToolCard } from './ToolCard';
import { AITool, BookmarkState, ComparisonState } from '../types';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface ToolsSectionProps {
  title: string;
  tools: AITool[];
  bookmarks: BookmarkState;
  comparisonTools?: ComparisonState;
  canAddToComparison?: boolean;
  onBookmark: (toolId: string) => void;
  onInstall: (tool: AITool) => void;
  onCompare?: (toolId: string) => void;
  onAddToCollection?: (toolId: string) => void;
  onToolClick?: (tool: AITool) => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
  layout?: 'grid' | 'list';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  showLayoutToggle?: boolean;
  className?: string;
}

export function ToolsSection({
  title,
  tools,
  bookmarks,
  comparisonTools = {},
  canAddToComparison = true,
  onBookmark,
  onInstall,
  onCompare,
  onAddToCollection,
  onToolClick,
  showViewAll = true,
  onViewAll,
  layout = 'grid',
  onLayoutChange,
  showLayoutToggle = false,
  className
}: ToolsSectionProps) {
  return (
    <div className={cn("px-4 py-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <div className="flex items-center space-x-2">
          {showLayoutToggle && onLayoutChange && (
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  layout === 'grid' && "bg-muted"
                )}
                onClick={() => onLayoutChange('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  layout === 'list' && "bg-muted"
                )}
                onClick={() => onLayoutChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {showViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-6xl opacity-50">🔍</div>
          <h3 className="text-xl font-semibold text-muted-foreground">No tools found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard
              {...{ key: tool.id }}
              tool={tool}
              isBookmarked={bookmarks[tool.id] || false}
              isComparing={comparisonTools[tool.id] || false}
              canAddToComparison={canAddToComparison}
              onBookmark={onBookmark}
              onInstall={onInstall}
              onCompare={onCompare}
              onAddToCollection={onAddToCollection}
              onToolClick={onToolClick}
              layout={layout}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {tools.map((tool) => (
            <ToolCard
              {...{ key: tool.id }}
              tool={tool}
              isBookmarked={bookmarks[tool.id] || false}
              isComparing={comparisonTools[tool.id] || false}
              canAddToComparison={canAddToComparison}
              onBookmark={onBookmark}
              onInstall={onInstall}
              onCompare={onCompare}
              onAddToCollection={onAddToCollection}
              onToolClick={onToolClick}
              layout={layout}
            />
          ))}
        </div>
      )}
    </div>
  );
}