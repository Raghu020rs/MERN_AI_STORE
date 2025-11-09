import { useState } from 'react';
import { HelpCircle, Scale, Bookmark, FolderPlus, Filter, MoreHorizontal, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

export function HelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9 hidden md:flex"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>How to Use AI Store</DialogTitle>
          <DialogDescription className="sr-only">
            Learn how to use the comparison, collections, bookmarks, and filter features
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-80px)]">
          <Tabs defaultValue="comparison" className="w-full p-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
            </TabsList>

            {/* Comparison Guide */}
            <TabsContent value="comparison" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emerald-600" />
                  Tool Comparison
                </h3>
                <p className="text-muted-foreground mb-4">
                  Compare up to 4 AI tools side-by-side to make informed decisions
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Add Tools to Compare</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Click the three dots menu <MoreHorizontal className="h-3 w-3 inline mx-1" /> on any tool card
                      </p>
                      <div className="bg-muted p-3 rounded-md space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span>→</span>
                          <Scale className="h-4 w-4" />
                          <span className="font-medium">Add to Compare</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Or open tool details and click "Add to Compare" button
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Manage Your Selection</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        The comparison bar appears at the bottom when you add tools
                      </p>
                      <div className="bg-muted p-3 rounded-md space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium">Compare Tools (2/4)</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs">Clear All</Button>
                            <Button size="sm" className="h-7 text-xs bg-emerald-600">Compare Now</Button>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            ChatGPT <X className="h-3 w-3 ml-1 inline" />
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Claude <X className="h-3 w-3 ml-1 inline" />
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">View Comparison</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Click "Compare Now" with at least 2 tools selected
                      </p>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-xs text-muted-foreground mb-2">The comparison view shows:</p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li>• Rating & reviews</li>
                          <li>• Pricing details</li>
                          <li>• Features comparison</li>
                          <li>• Download counts</li>
                          <li>• Last updated dates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold mb-1 text-blue-900 dark:text-blue-100">💡 Pro Tips</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Maximum 4 tools can be compared at once</li>
                  <li>• Your selections persist across browsing sessions</li>
                  <li>• Compare tools in the same category for better insights</li>
                  <li>• Use filters to narrow down options before comparing</li>
                </ul>
              </div>
            </TabsContent>

            {/* Collections Guide */}
            <TabsContent value="collections" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FolderPlus className="h-5 w-5 text-purple-600" />
                  Collections
                </h3>
                <p className="text-muted-foreground mb-4">
                  Organize your favorite tools into custom collections
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Creating Collections</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Go to the Collections tab and click "Create Collection"
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Choose a name and description</li>
                    <li>• Select a color and icon</li>
                    <li>• Add tools to your collection</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Adding Tools</h4>
                  <p className="text-sm text-muted-foreground">
                    Click <FolderPlus className="h-3 w-3 inline mx-1" /> on any tool and select a collection
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Bookmarks Guide */}
            <TabsContent value="bookmarks" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-amber-600" />
                  Bookmarks
                </h3>
                <p className="text-muted-foreground mb-4">
                  Save tools for quick access later
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">How to Bookmark</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click the bookmark icon <Bookmark className="h-3 w-3 inline mx-1" /> on any tool card
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="text-muted-foreground">
                      Bookmarks are saved locally and will persist across sessions
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">View Bookmarks</h4>
                  <p className="text-sm text-muted-foreground">
                    Access all your bookmarked tools from the Bookmarks tab or your profile
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Filters Guide */}
            <TabsContent value="filters" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-indigo-600" />
                  Advanced Filters
                </h3>
                <p className="text-muted-foreground mb-4">
                  Find exactly what you need with powerful filters
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Filter by Pricing</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge>Free</Badge>
                    <Badge>Paid</Badge>
                    <Badge>Freemium</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Filter by Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">New</Badge>
                    <Badge variant="secondary">Rising</Badge>
                    <Badge variant="secondary">Editor's Pick</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Sort Options</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Relevance</li>
                    <li>• Rating (High to Low)</li>
                    <li>• Downloads</li>
                    <li>• Newest First</li>
                    <li>• Name (A-Z)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
