import { useState } from 'react';
import { Star, Download, DollarSign, Check, X, Users, Calendar, Sparkles, TrendingUp, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { AITool } from '../types';
import { cn } from './ui/utils';
import { AIToolIcon } from './AIToolIcon';

interface ComparisonDialogProps {
  tools: AITool[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstall: (tool: AITool) => void;
}

export function ComparisonDialog({ tools, open, onOpenChange, onInstall }: ComparisonDialogProps) {
  const [view, setView] = useState<'side-by-side' | 'detailed'>('side-by-side');
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tools.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tools.length) % tools.length);
  };

  // Show helpful message if no tools selected
  if (tools.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Compare Tools</DialogTitle>
            <DialogDescription>
              Add tools to comparison by clicking the comparison icon in tool cards or detail views.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3>No tools selected</h3>
              <p className="text-muted-foreground">
                Select at least 2 tools to start comparing their features, pricing, and ratings.
              </p>
            </div>
            <Button onClick={() => onOpenChange(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Find best values for highlighting
  const bestRating = Math.max(...tools.map(t => t.rating));
  const bestDownloads = Math.max(...tools.map(t => parseInt(t.downloadCount?.replace(/\D/g, '') || '0')));
  const hasFree = tools.some(t => t.price === 'Free');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] md:max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-4 md:px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Compare AI Tools</DialogTitle>
              <DialogDescription className="mt-1">
                Side-by-side comparison of {tools.length} tools
              </DialogDescription>
            </div>
            {/* Mobile Tabs */}
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="md:hidden">
              <TabsList className="grid w-[200px] grid-cols-2 h-8">
                <TabsTrigger value="side-by-side" className="text-xs">Side by Side</TabsTrigger>
                <TabsTrigger value="detailed" className="text-xs">Detailed</TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Desktop Tabs */}
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="hidden md:block">
              <TabsList className="grid w-[240px] grid-cols-2">
                <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          {view === 'side-by-side' ? (
            <div className="p-4 md:p-6">
              {/* Desktop: Side by Side Cards */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
                {tools.map((tool) => {
                  const isBestRating = tool.rating === bestRating;
                  const downloads = parseInt(tool.downloadCount?.replace(/\D/g, '') || '0');
                  const isBestDownloads = downloads === bestDownloads;
                  const isFree = tool.price === 'Free';

                  return (
                    <div
                      key={tool.id}
                      className={cn(
                        "relative rounded-lg border-2 bg-card overflow-hidden transition-all",
                        isBestRating && "border-yellow-400/50 shadow-lg shadow-yellow-400/10"
                      )}
                    >
                      {/* Best Badge */}
                      {isBestRating && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-yellow-400 text-yellow-900 border-0 gap-1 text-xs px-1.5 py-0.5">
                            <Crown className="h-2.5 w-2.5" />
                            Top
                          </Badge>
                        </div>
                      )}

                      <div className="p-3 space-y-2">
                        {/* Tool Header */}
                        <div className="text-center space-y-2">
                          <div className="mx-auto w-14 h-14 bg-white dark:bg-gray-800 border rounded-xl flex items-center justify-center text-2xl shadow-sm">
                            <AIToolIcon icon={tool.icon} name={tool.id} size="small" />
                          </div>
                          <div>
                            <h3 className="mb-0.5 text-xs font-semibold truncate">{tool.name}</h3>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        {/* Key Stats */}
                        <div className="space-y-1.5">
                          {/* Rating */}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[10px]">Rating</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                              <span className={cn("text-[10px]", isBestRating && "font-semibold text-yellow-600 dark:text-yellow-400")}>
                                {tool.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[10px]">Price</span>
                            <Badge
                              variant={isFree ? 'default' : 'outline'}
                              className={cn(
                                "text-[9px] px-1.5 py-0 h-4",
                                isFree && hasFree && "bg-emerald-600 hover:bg-emerald-700 text-white"
                              )}
                            >
                              {tool.price === 'Free' ? 'Free' : tool.actualPrice?.replace('/month', '') || tool.price}
                            </Badge>
                          </div>

                          {/* Downloads */}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[10px]">Downloads</span>
                            <span className={cn("text-[10px]", isBestDownloads && "font-semibold text-emerald-600 dark:text-emerald-400")}>
                              {tool.downloadCount?.replace('downloads', '') || 'N/A'}
                            </span>
                          </div>

                          {/* Category */}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-[10px]">Category</span>
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 truncate max-w-[100px]">
                              {tool.category}
                            </Badge>
                          </div>
                        </div>

                        <Separator className="my-1" />

                        {/* Features */}
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-[10px] font-medium">Features</span>
                          <div className="space-y-0.5">
                            {tool.features?.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-1">
                                <Check className="h-2.5 w-2.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="text-[9px] line-clamp-1" title={feature}>{feature}</span>
                              </div>
                            )) || (
                              <span className="text-[9px] text-muted-foreground italic">No features</span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={() => onInstall(tool)}
                          size="sm"
                          className={cn(
                            'w-full rounded-full text-[10px] h-7 px-2',
                            tool.price === 'Free'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                          )}
                          variant={tool.price === 'Free' ? 'default' : 'outline'}
                        >
                          {tool.price === 'Free' ? 'Install' : 'View'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile: Horizontal Scroll Cards */}
              <div className="md:hidden">
                <ScrollArea className="w-full">
                  <div className="flex gap-3 pb-4 px-1">
                    {tools.map((tool) => {
                      const isBestRating = tool.rating === bestRating;
                      const isFree = tool.price === 'Free';

                      return (
                        <div
                          key={tool.id}
                          className={cn(
                            "relative w-[240px] shrink-0 rounded-lg border-2 bg-card overflow-hidden",
                            isBestRating && "border-yellow-400/50 shadow-lg shadow-yellow-400/10"
                          )}
                        >
                          {isBestRating && (
                            <div className="absolute top-2 right-2 z-10">
                              <Badge className="bg-yellow-400 text-yellow-900 border-0 gap-1 text-xs px-1.5 py-0.5">
                                <Crown className="h-2.5 w-2.5" />
                                Top
                              </Badge>
                            </div>
                          )}

                          <div className="p-3 space-y-2.5">
                            <div className="text-center space-y-1.5">
                              <div className="mx-auto w-12 h-12 bg-white dark:bg-gray-800 border rounded-xl flex items-center justify-center text-xl shadow-sm">
                                <AIToolIcon icon={tool.icon} name={tool.id} size="small" />
                              </div>
                              <div>
                                <h3 className="mb-0.5 text-sm font-semibold">{tool.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {tool.description}
                                </p>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-xs">Rating</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{tool.rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-xs">Price</span>
                                <Badge variant={isFree ? 'default' : 'outline'} className="text-xs px-2 py-0 h-5">
                                  {tool.price === 'Free' ? 'Free' : tool.actualPrice?.replace('/month', '/mo') || tool.price}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-xs">Downloads</span>
                                <span className="text-xs">{tool.downloadCount?.replace('downloads', '') || 'N/A'}</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => onInstall(tool)}
                              size="sm"
                              className="w-full rounded-full text-xs h-8"
                              variant={isFree ? 'default' : 'outline'}
                            >
                              {isFree ? 'Install' : 'View'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            // Detailed Table View
            <div className="p-4 md:p-6">
              {/* Desktop: Full Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left p-4 w-48">Feature</th>
                      {tools.map(tool => (
                        <th key={tool.id} className="p-4 min-w-[200px]">
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 border rounded-xl flex items-center justify-center text-xl">
                              <AIToolIcon icon={tool.icon} name={tool.id} size="small" />
                            </div>
                            <div>
                              <span className="font-semibold">{tool.name}</span>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Name */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">Name</td>
                      {tools.map(tool => (
                        <td key={tool.id} className="p-4 text-center font-medium">
                          {tool.name}
                        </td>
                      ))}
                    </tr>

                    {/* Description */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">Description</td>
                      {tools.map(tool => (
                        <td key={tool.id} className="p-4 text-center text-sm text-muted-foreground">
                          {tool.description}
                        </td>
                      ))}
                    </tr>
                    {/* Rating */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Rating</span>
                        </div>
                      </td>
                      {tools.map(tool => {
                        const isBest = tool.rating === bestRating;
                        return (
                          <td key={tool.id} className="p-4 text-center">
                            <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full", isBest && "bg-yellow-100 dark:bg-yellow-900/30")}>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className={cn(isBest && "font-semibold")}>{tool.rating.toFixed(1)}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Price */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Price</span>
                        </div>
                      </td>
                      {tools.map(tool => {
                        const isFree = tool.price === 'Free';
                        return (
                          <td key={tool.id} className="p-4 text-center">
                            <Badge
                              variant={isFree ? 'default' : 'outline'}
                              className={cn(isFree && hasFree && "bg-emerald-600 text-white")}
                            >
                              {isFree ? 'Free' : tool.actualPrice || tool.price}
                            </Badge>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Downloads */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Downloads</span>
                        </div>
                      </td>
                      {tools.map(tool => {
                        const downloads = parseInt(tool.downloadCount?.replace(/\D/g, '') || '0');
                        const isBest = downloads === bestDownloads;
                        return (
                          <td key={tool.id} className="p-4 text-center">
                            <span className={cn(isBest && "font-semibold text-emerald-600 dark:text-emerald-400")}>
                              {tool.downloadCount || 'N/A'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Category */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">Category</td>
                      {tools.map(tool => (
                        <td key={tool.id} className="p-4 text-center">
                          <Badge variant="secondary">{tool.category}</Badge>
                        </td>
                      ))}
                    </tr>

                    {/* Features */}
                    <tr className="border-b">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Features</span>
                        </div>
                      </td>
                      {tools.map(tool => (
                        <td key={tool.id} className="p-4">
                          <div className="space-y-2">
                            {tool.features?.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-left">
                                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            )) || (
                              <span className="text-sm text-muted-foreground italic">No features listed</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Actions */}
                    <tr>
                      <td className="p-4"></td>
                      {tools.map(tool => (
                        <td key={tool.id} className="p-4">
                          <Button
                            onClick={() => onInstall(tool)}
                            className={cn(
                              'w-full rounded-full',
                              tool.price === 'Free'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                            )}
                            variant={tool.price === 'Free' ? 'default' : 'outline'}
                          >
                            {tool.price === 'Free' ? 'Install Now' : 'View'}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile: Slide Mode */}
              <div className="md:hidden">
                <div className="relative">
                  {/* Slider Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevSlide}
                      disabled={tools.length <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                      {currentSlide + 1} / {tools.length}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextSlide}
                      disabled={tools.length <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Slider Content */}
                  <div className="overflow-hidden">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {tools.map((tool, index) => {
                        const isBestRating = tool.rating === bestRating;
                        const downloads = parseInt(tool.downloadCount?.replace(/\D/g, '') || '0');
                        const isBestDownloads = downloads === bestDownloads;
                        const isFree = tool.price === 'Free';

                        return (
                          <div key={tool.id} className="w-full shrink-0 px-1">
                            <div className="border-2 rounded-lg p-4 bg-card space-y-4">
                              {/* Header */}
                              <div className="text-center space-y-2 pb-3 border-b">
                                <div className="mx-auto w-16 h-16 bg-white dark:bg-gray-800 border-2 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                  <AIToolIcon icon={tool.icon} name={tool.id} size="medium" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{tool.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                                </div>
                              </div>

                              {/* Details Table */}
                              <div className="space-y-3">
                                {/* Rating */}
                                <div className="flex items-center justify-between py-2 border-b">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">Rating</span>
                                  </div>
                                  <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full", isBestRating && "bg-yellow-100 dark:bg-yellow-900/30")}>
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className={cn("text-sm", isBestRating && "font-semibold")}>{tool.rating.toFixed(1)}</span>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between py-2 border-b">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">Price</span>
                                  </div>
                                  <Badge
                                    variant={isFree ? 'default' : 'outline'}
                                    className={cn(isFree && hasFree && "bg-emerald-600 text-white")}
                                  >
                                    {isFree ? 'Free' : tool.actualPrice || tool.price}
                                  </Badge>
                                </div>

                                {/* Downloads */}
                                <div className="flex items-center justify-between py-2 border-b">
                                  <div className="flex items-center gap-2">
                                    <Download className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">Downloads</span>
                                  </div>
                                  <span className={cn("text-sm", isBestDownloads && "font-semibold text-emerald-600 dark:text-emerald-400")}>
                                    {tool.downloadCount || 'N/A'}
                                  </span>
                                </div>

                                {/* Category */}
                                <div className="flex items-center justify-between py-2 border-b">
                                  <span className="font-medium text-sm">Category</span>
                                  <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                                </div>

                                {/* Features */}
                                <div className="py-2">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">Features</span>
                                  </div>
                                  <div className="space-y-2 pl-6">
                                    {tool.features?.map((feature, idx) => (
                                      <div key={idx} className="flex items-start gap-2">
                                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                      </div>
                                    )) || (
                                      <span className="text-sm text-muted-foreground italic">No features listed</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <Button
                                onClick={() => onInstall(tool)}
                                className={cn(
                                  'w-full rounded-full h-11',
                                  isFree
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                                )}
                                variant={isFree ? 'default' : 'outline'}
                              >
                                {isFree ? 'Install Now' : 'View'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex justify-center gap-2 mt-4">
                    {tools.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          index === currentSlide 
                            ? "w-6 bg-emerald-600" 
                            : "w-2 bg-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
