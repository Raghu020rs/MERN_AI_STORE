import { Plus, MoreVertical, Trash2, Edit, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Collection } from '../types';
import { Folder, Heart, Star, Bookmark, Sparkles, Zap, Target, Palette } from 'lucide-react';
import { cn } from './ui/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface CollectionsDialogProps {
  collections: Collection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNew: () => void;
  onViewCollection: (collection: Collection) => void;
  onEditCollection?: (collection: Collection) => void;
  onDeleteCollection?: (collectionId: string) => void;
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

export function CollectionsDialog({
  collections,
  open,
  onOpenChange,
  onCreateNew,
  onViewCollection,
  onEditCollection,
  onDeleteCollection,
}: CollectionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>My Collections</DialogTitle>
            <Button onClick={onCreateNew} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </div>
          <DialogDescription className="sr-only">
            View and manage your saved collections of AI tools
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Collections Yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                Create collections to organize your favorite AI tools
              </p>
              <Button onClick={onCreateNew} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Collection
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map(collection => {
                const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || Folder;
                
                return (
                  <div
                    key={collection.id}
                    className="group relative border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onViewCollection(collection)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', collection.color)}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {collection.description}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {collection.toolIds.length} {collection.toolIds.length === 1 ? 'tool' : 'tools'}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEditCollection && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onEditCollection(collection);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDeleteCollection && collection.id !== 'favorites' && collection.id !== 'work' && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCollection(collection.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
