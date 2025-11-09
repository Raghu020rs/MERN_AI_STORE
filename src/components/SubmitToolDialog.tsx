import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Globe, Sparkles, X, Upload, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from './ui/utils';
import { ToolSubmission } from '../types';
import { categories } from '../data/mockData';

interface SubmitToolDialogProps {
  onSubmit?: (submission: ToolSubmission) => void;
  autoOpen?: boolean;
  onAutoOpenComplete?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: boolean;
}

const STORAGE_KEY = 'ai-store-submit-tool-shown';

export function SubmitToolDialog({ 
  onSubmit, 
  autoOpen = false, 
  onAutoOpenComplete,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  triggerButton = true
}: SubmitToolDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [formData, setFormData] = useState<Partial<ToolSubmission>>({
    price: 'Free',
    category: '',
    tags: [],
    features: [],
  });

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  // Auto-open logic on first visit
  useEffect(() => {
    if (autoOpen) {
      const hasBeenShown = localStorage.getItem(STORAGE_KEY);
      if (!hasBeenShown) {
        // Delay the dialog opening slightly for better UX
        const timer = setTimeout(() => {
          setOpen(true);
          localStorage.setItem(STORAGE_KEY, 'true');
          onAutoOpenComplete?.();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [autoOpen, onAutoOpenComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit && formData.name && formData.description) {
      onSubmit(formData as ToolSubmission);
    }
    
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setFormData({
        price: 'Free',
        category: '',
        tags: [],
        features: [],
      });
    }, 2500);
  };

  const addTag = () => {
    if (currentTag.trim() && formData.tags && formData.tags.length < 10) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index),
    });
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-in zoom-in duration-300" />
            <DialogTitle>Submission Received!</DialogTitle>
            <DialogDescription>
              Thank you for submitting your AI tool. Our team will review it and get back to you within 2-3 business days.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton && (
        <Button 
          onClick={() => setOpen(true)}
          className="rounded-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit Your Tool
        </Button>
      )}

      <DialogContent className="max-w-2xl max-h-[90vh]">
        {/* Close button */}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Submit Your AI Tool</DialogTitle>
          <DialogDescription>
            Share your AI tool with thousands of users. Fill out the form below to get started.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tool Name */}
            <div className="space-y-2">
              <Label htmlFor="toolName">Tool Name *</Label>
              <Input
                id="toolName"
                placeholder="e.g., ChatGPT, Midjourney"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your tool does and its key features..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="website">Website URL *</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourtool.com"
                  className="pl-9"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Developer/Company */}
            <div className="space-y-2">
              <Label htmlFor="developer">Developer/Company Name *</Label>
              <Input
                id="developer"
                placeholder="e.g., OpenAI, Anthropic"
                value={formData.developer || ''}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                required
              />
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <Label>Pricing Model *</Label>
              <RadioGroup
                value={formData.price}
                onValueChange={(value) => setFormData({ ...formData, price: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Free" id="free" />
                  <Label htmlFor="free" className="cursor-pointer">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Freemium" id="freemium" />
                  <Label htmlFor="freemium" className="cursor-pointer">Freemium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Paid" id="paid" />
                  <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Logo/Icon Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Tool Logo/Icon</Label>
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or SVG (max. 2MB)</p>
                  </div>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag (e.g., AI, Writing, Design)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 rounded-full"
                disabled={!formData.name || !formData.description || !formData.category || !formData.website || !formData.developer}
              >
                Submit Tool
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}