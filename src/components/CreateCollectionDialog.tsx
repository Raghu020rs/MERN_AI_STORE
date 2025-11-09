import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Folder, Heart, Star, Bookmark, Sparkles, Zap, Target, Palette } from 'lucide-react';
import { cn } from './ui/utils';

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (collection: { name: string; description: string; toolIds: string[]; color: string; icon: string }) => void;
}

const colorOptions = [
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-gray-500', label: 'Gray' },
];

const iconOptions = [
  { value: 'Folder', Icon: Folder },
  { value: 'Heart', Icon: Heart },
  { value: 'Star', Icon: Star },
  { value: 'Bookmark', Icon: Bookmark },
  { value: 'Sparkles', Icon: Sparkles },
  { value: 'Zap', Icon: Zap },
  { value: 'Target', Icon: Target },
  { value: 'Palette', Icon: Palette },
];

export function CreateCollectionDialog({ open, onOpenChange, onCreate }: CreateCollectionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const [selectedIcon, setSelectedIcon] = useState('Folder');

  const handleCreate = () => {
    if (name.trim()) {
      onCreate({
        name: name.trim(),
        description: description.trim(),
        toolIds: [],
        color: selectedColor,
        icon: selectedIcon,
      });
      // Reset form
      setName('');
      setDescription('');
      setSelectedColor('bg-blue-500');
      setSelectedIcon('Folder');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to organize your AI tools
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              placeholder="e.g., My Favorite Tools"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this collection for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map(({ value, Icon }) => (
                <button
                  key={value}
                  onClick={() => setSelectedIcon(value)}
                  className={cn(
                    'w-full aspect-square rounded-lg border-2 flex items-center justify-center transition-all hover:border-emerald-600',
                    selectedIcon === value ? 'border-emerald-600 bg-emerald-50' : 'border-border'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSelectedColor(value)}
                  className={cn(
                    'w-full aspect-square rounded-lg border-2 transition-all hover:scale-105',
                    value,
                    selectedColor === value ? 'border-foreground ring-2 ring-foreground ring-offset-2' : 'border-transparent'
                  )}
                  title={label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', selectedColor)}>
              {iconOptions.find(opt => opt.value === selectedIcon)?.Icon && (
                <div className="text-white">
                  {(() => {
                    const IconComponent = iconOptions.find(opt => opt.value === selectedIcon)!.Icon;
                    return <IconComponent className="h-6 w-6" />;
                  })()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{name || 'Collection Name'}</h4>
              <p className="text-sm text-muted-foreground">
                {description || 'Add a description...'}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
