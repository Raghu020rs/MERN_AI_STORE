import { Plus, Check } from 'lucide-react';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Collection, AITool } from '../types';
import { Folder, Heart, Star, Bookmark, Sparkles, Zap, Target, Palette } from 'lucide-react';
import { cn } from './ui/utils';

interface AddToCollectionDialogProps {
  tool: AITool | null;
  collections: Collection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCollection: (collectionId: string, toolId: string) => void;
  onCreateNew: () => void;
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

export function AddToCollectionDialog({
  tool,
  collections,
  open,
  onOpenChange,
  onAddToCollection,
  onCreateNew,
}: AddToCollectionDialogProps) {
  if (!tool) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Save "{tool.name}" to a collection
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {collections.map(collection => {
              const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || Folder;
              const isInCollection = collection.toolIds.includes(tool.id);
              
              return (
                <button
                  key={collection.id}
                  onClick={() => !isInCollection && onAddToCollection(collection.id, tool.id)}
                  disabled={isInCollection}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 border rounded-lg transition-all',
                    isInCollection
                      ? 'bg-muted cursor-not-allowed'
                      : 'hover:shadow-md hover:border-emerald-600'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', collection.color)}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-medium truncate">{collection.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {collection.toolIds.length} {collection.toolIds.length === 1 ? 'tool' : 'tools'}
                    </p>
                  </div>
                  {isInCollection && (
                    <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}

            <Button
              onClick={onCreateNew}
              variant="outline"
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Collection
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
