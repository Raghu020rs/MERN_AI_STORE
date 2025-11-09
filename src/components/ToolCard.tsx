import { Star, Bookmark, Download, MoreHorizontal, Scale, FolderPlus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/utils';
import { AITool } from '../types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AIToolIcon } from './AIToolIcon';

interface ToolCardProps {
  tool: AITool;
  isBookmarked: boolean;
  isComparing?: boolean;
  canAddToComparison?: boolean;
  onBookmark: (toolId: string) => void;
  onInstall: (tool: AITool) => void;
  onCompare?: (toolId: string) => void;
  onAddToCollection?: (toolId: string) => void;
  onToolClick?: (tool: AITool) => void;
  layout?: 'grid' | 'list';
}

export function ToolCard({ 
  tool, 
  isBookmarked,
  isComparing = false,
  canAddToComparison = true,
  onBookmark, 
  onInstall, 
  onCompare,
  onAddToCollection,
  onToolClick,
  layout = 'grid' 
}: ToolCardProps) {
  const formatRating = (rating: number) => rating.toFixed(1);
  const formatDownloads = (count: string) => count.replace(/\d+/, (match) => 
    parseInt(match).toLocaleString()
  );

  if (layout === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onToolClick?.(tool)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <AIToolIcon icon={tool.icon} name={tool.id} size="medium" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{tool.developer}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{formatRating(tool.rating)}</span>
                    </div>
                    {tool.downloadCount && (
                      <span className="text-xs text-muted-foreground">
                        {formatDownloads(tool.downloadCount)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{tool.size}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookmark(tool.id);
                        }}
                      >
                        <Bookmark className={cn("h-4 w-4 mr-2", isBookmarked && "fill-current")} />
                        {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                      </DropdownMenuItem>
                      {onCompare && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompare(tool.id);
                          }}
                          disabled={!canAddToComparison && !isComparing}
                        >
                          <Scale className="h-4 w-4 mr-2" />
                          {isComparing ? 'Remove from Compare' : 'Add to Compare'}
                        </DropdownMenuItem>
                      )}
                      {onAddToCollection && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCollection(tool.id);
                          }}
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Add to Collection
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInstall(tool);
                    }}
                    size="sm"
                    className={cn(
                      "min-w-[80px] rounded-full",
                      tool.price === 'Free' 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                        : "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    )}
                    variant={tool.price === 'Free' ? 'default' : 'outline'}
                  >
                    {tool.price === 'Free' ? 'Install' : tool.actualPrice || 'View'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow group cursor-pointer",
      isComparing && "ring-2 ring-emerald-600"
    )} onClick={() => onToolClick?.(tool)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
            <AIToolIcon icon={tool.icon} name={tool.id} size="small" />
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(tool.id);
              }}
              className={cn(
                "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                isBookmarked && "opacity-100 text-emerald-600"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onCompare && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompare(tool.id);
                    }}
                    disabled={!canAddToComparison && !isComparing}
                  >
                    <Scale className="h-4 w-4 mr-2" />
                    {isComparing ? 'Remove from Compare' : 'Add to Compare'}
                  </DropdownMenuItem>
                )}
                {onAddToCollection && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCollection(tool.id);
                    }}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Add to Collection
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="font-semibold truncate">{tool.name}</h3>
            <p className="text-sm text-muted-foreground">{tool.developer}</p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {tool.description}
          </p>

          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{formatRating(tool.rating)}</span>
            <span className="text-xs text-muted-foreground">
              ({(tool.reviewCount || 0).toLocaleString()})
            </span>
          </div>

          {tool.trending && (
            <Badge variant="secondary" className="text-xs">
              {tool.trending}
            </Badge>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {tool.price === 'Free' ? 'Free' : tool.actualPrice}
            </span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onInstall(tool);
              }}
              size="sm"
              className={cn(
                "min-w-[60px] rounded-full text-xs",
                tool.price === 'Free' 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                  : "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              )}
              variant={tool.price === 'Free' ? 'default' : 'outline'}
            >
              {tool.price === 'Free' ? 'Install' : 'View'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}