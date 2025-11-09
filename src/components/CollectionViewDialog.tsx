import { ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ToolsSection } from './ToolsSection';
import { Collection, AITool, BookmarkState, ComparisonState } from '../types';
import { Folder, Heart, Star, Bookmark, Sparkles, Zap, Target, Palette } from 'lucide-react';
import { cn } from './ui/utils';

interface CollectionViewDialogProps {
  collection: Collection | null;
  tools: AITool[];
  bookmarks: BookmarkState;
  comparisonTools?: ComparisonState;
  canAddToComparison?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onBookmark: (toolId: string) => void;
  onInstall: (tool: AITool) => void;
  onCompare?: (toolId: string) => void;
  onAddToCollection?: (toolId: string) => void;
  onToolClick?: (tool: AITool) => void;
  onRemoveFromCollection?: (collectionId: string, toolId: string) => void;
}

const iconMap = {
  Folder: Folder,
  Heart: Heart,
  Star: Star,
  Bookmark: Bookmark,
  Sparkles: Sparkles,
  Zap: Zap,
  Target: Target,
  Palette: Palette,
};

export function CollectionViewDialog({
  collection,
  tools,
  bookmarks,
  comparisonTools,
  canAddToComparison,
  open,
  onOpenChange,
  onBack,
  onBookmark,
  onInstall,
  onCompare,
  onAddToCollection,
  onToolClick,
  onRemoveFromCollection
}: CollectionViewDialogProps) {
  if (!collection) return null;

  const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || Folder;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="sr-only">{collection.name}</DialogTitle>
          <DialogDescription className="sr-only">
            {collection.description || `View tools in ${collection.name} collection`}
          </DialogDescription>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', collection.color)}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">{collection.name}</h2>
              {collection.description && (
                <p className="text-sm text-muted-foreground">{collection.description}</p>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          {tools.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className={cn('w-24 h-24 rounded-full flex items-center justify-center mb-4', collection.color, 'opacity-20')}>
                <IconComponent className="h-12 w-12" />
              </div>
              <h3 className="font-semibold mb-2">No Tools Yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Add tools to this collection from the tool details page
              </p>
            </div>
          ) : (
            <ToolsSection
              title=""
              tools={tools}
              bookmarks={bookmarks}
              onBookmark={onBookmark}
              onInstall={onInstall}
              onToolClick={onToolClick}
              showViewAll={false}
              showLayoutToggle={false}
              layout="grid"
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
