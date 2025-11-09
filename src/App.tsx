import { useState, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Plus, Loader2, FolderOpen, Bookmark } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { FeaturedBanner } from './components/FeaturedBanner';
import { CategorySection } from './components/CategorySection';
import { ToolsSection } from './components/ToolsSection';
import { FilterBar } from './components/FilterBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import ToolDetailDialog from './components/ToolDetailDialog';
import { SubmitToolDialog } from './components/SubmitToolDialog';
import { ComparisonBar } from './components/ComparisonBar';
import { ComparisonDialog } from './components/ComparisonDialog';
import { ComparisonTutorial } from './components/ComparisonTutorial';
import { CollectionsDialog } from './components/CollectionsDialog';
import { CollectionViewDialog } from './components/CollectionViewDialog';
import { AddToCollectionDialog } from './components/AddToCollectionDialog';
import { CreateCollectionDialog } from './components/CreateCollectionDialog';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { useBookmarks } from './hooks/useBookmarks';
import { useComparison } from './hooks/useComparison';
import { useCollections } from './hooks/useCollections';
import { toolsAPI } from './lib/api';
import { categories, allPrompts, promptCategories } from './data/mockData';
import { AITool, Collection, Prompt } from './types';
import { toast } from 'sonner';

// Main App Content Component (must be inside AuthProvider)
export function AppContent() {
  // API state
  const [allAITools, setAllAITools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('for-you');
  const [mobileTab, setMobileTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filters, setFilters] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    pricing: [] as string[],
    features: [] as string[],
    integrations: [] as string[],
    trending: [] as string[],
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [toolDetailOpen, setToolDetailOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  
  // Comparison state
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  
  // Collections state
  const [collectionsDialogOpen, setCollectionsDialogOpen] = useState(false);
  const [collectionViewDialogOpen, setCollectionViewDialogOpen] = useState(false);
  const [addToCollectionDialogOpen, setAddToCollectionDialogOpen] = useState(false);
  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const { bookmarks, toggleBookmark, getBookmarkedTools } = useBookmarks();
  const { comparisonTools, toggleComparison, clearComparison, removeFromComparison, getComparisonCount } = useComparison();
  const { 
    collections, 
    createCollection, 
    deleteCollection, 
    addToolToCollection, 
    removeToolFromCollection,
    getCollectionTools 
  } = useCollections();

  // Fetch tools from API on mount
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all tools from backend API
        const response = await toolsAPI.getAll({ limit: 1000 });
        
        if (response.data && response.data.tools) {
          setAllAITools(response.data.tools);
          toast.success(`Loaded ${response.data.tools.length} AI tools`);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch tools:', err);
        }
        setError(err.message || 'Failed to load AI tools');
        toast.error('Failed to load tools. Using fallback data.');
        
        // Fallback to mock data if API fails
        import('./data/mockData').then(({ allAITools: mockTools }) => {
          setAllAITools(mockTools);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let result = allAITools;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        (tool.subcategory && tool.subcategory.toLowerCase().includes(query)) ||
        tool.developer.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (tool.longDescription && tool.longDescription.toLowerCase().includes(query)) ||
        (tool.features && tool.features.some(f => f.toLowerCase().includes(query))) ||
        (tool.integrations && tool.integrations.some(i => i.toLowerCase().includes(query)))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(tool => tool.category === selectedCategory);
    }

    // Basic price filters
    if (filters.includes('free')) {
      result = result.filter(tool => tool.price === 'Free');
    }
    if (filters.includes('paid')) {
      result = result.filter(tool => tool.price === 'Paid');
    }
    if (filters.includes('freemium')) {
      result = result.filter(tool => tool.price === 'Freemium');
    }

    // Advanced pricing filters
    if (advancedFilters.pricing.length > 0) {
      result = result.filter(tool => {
        const priceType = tool.price.toLowerCase();
        return advancedFilters.pricing.some(filter => filter === priceType);
      });
    }

    // Feature filters
    if (advancedFilters.features.length > 0) {
      result = result.filter(tool => {
        if (!tool.features) return false;
        return advancedFilters.features.some(filter => 
          tool.features?.some(feature => 
            feature.toLowerCase().includes(filter.replace('-', ' '))
          )
        );
      });
    }

    // Integration filters
    if (advancedFilters.integrations.length > 0) {
      result = result.filter(tool => {
        if (!tool.integrations) return false;
        return advancedFilters.integrations.some(filter => 
          tool.integrations?.some(integration => 
            integration.toLowerCase().includes(filter.replace('-', ' '))
          )
        );
      });
    }

    // Trending filters
    if (filters.includes('trending')) {
      result = result.filter(tool => tool.trending);
    }
    if (filters.includes('new')) {
      result = result.filter(tool => tool.trending === 'New');
    }
    if (filters.includes('editors-pick')) {
      result = result.filter(tool => tool.trending === "Editor's Pick");
    }

    // Advanced trending filters
    if (advancedFilters.trending.length > 0) {
      result = result.filter(tool => {
        if (!tool.trending && !advancedFilters.trending.includes('trending')) return false;
        if (advancedFilters.trending.includes('new') && tool.trending === 'New') return true;
        if (advancedFilters.trending.includes('rising') && tool.trending === 'Rising') return true;
        if (advancedFilters.trending.includes('editors-pick') && tool.trending === "Editor's Pick") return true;
        if (advancedFilters.trending.includes('trending') && tool.trending) return true;
        return false;
      });
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        result.sort((a, b) => {
          const aDownloads = parseInt(a.downloadCount?.replace(/\D/g, '') || '0');
          const bDownloads = parseInt(b.downloadCount?.replace(/\D/g, '') || '0');
          return bDownloads - aDownloads;
        });
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime());
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, filters, advancedFilters, sortBy]);

  // Handle search query change and switch to search tab
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // If user types something, switch to search tab
    if (query.trim()) {
      setActiveTab('search');
      setMobileTab('search');
    }
  };

  const handleInstall = async (tool: AITool) => {
    // Track download in backend
    try {
      await toolsAPI.incrementDownload(tool.id);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Failed to track download:', err);
      }
    }

    if (tool.demoUrl) {
      window.open(tool.demoUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${tool.name}...`, {
        description: 'Launching in a new tab'
      });
    } else {
      toast.info(`${tool.name} opened!`, {
        description: 'This is a demo. In production, this would install the tool.'
      });
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('categories');
  };

  const handleToolClick = async (tool: AITool) => {
    setSelectedTool(tool);
    setToolDetailOpen(true);
    
    // Track view in backend
    try {
      await toolsAPI.incrementView(tool.id);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Failed to track view:', err);
      }
    }
  };

  // Comparison handlers
  const handleOpenComparison = () => {
    const count = getComparisonCount();
    if (count < 2) {
      toast.error('Select at least 2 tools to compare');
      return;
    }
    setComparisonDialogOpen(true);
  };

  // Collections handlers
  const handleOpenCollections = () => {
    setCollectionsDialogOpen(true);
  };

  const handleViewCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setCollectionsDialogOpen(false);
    setCollectionViewDialogOpen(true);
  };

  const handleBackToCollections = () => {
    setCollectionViewDialogOpen(false);
    setCollectionsDialogOpen(true);
  };

  const handleAddToCollection = (collectionId: string, toolId: string) => {
    addToolToCollection(collectionId, toolId);
    toast.success('Tool added to collection!');
  };

  const handleCreateCollection = (collectionData: { name: string; description: string; toolIds: string[]; color: string; icon: string }) => {
    createCollection(collectionData);
    toast.success('Collection created!');
  };

  const featuredTools = allAITools.filter(tool => tool.featured);
  const trendingTools = allAITools.filter(tool => tool.trending);
  const topRatedTools = [...allAITools].sort((a, b) => b.rating - a.rating).slice(0, 20);
  const bookmarkedTools = getBookmarkedTools(allAITools);
  const comparedTools = allAITools.filter(tool => comparisonTools[tool.id]);

  // Get featured tools for auto-sliding banner (ChatGPT, Claude, Gemini, Grok, Midjourney, Perplexity)
  const featuredBannerTools = allAITools.filter(tool => 
    ['chatgpt', 'claude', 'gemini', 'grok', 'midjourney', 'perplexity'].includes(tool.id)
  );

  // Helper to render prompt cards
  const renderPromptCard = (prompt: Prompt) => (
    <div key={prompt.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{prompt.icon}</span>
        {prompt.trending && (
          <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
            {prompt.trending}
          </span>
        )}
      </div>
      <h4 className="mb-2">{prompt.title}</h4>
      <p className="text-muted-foreground mb-4 text-sm">{prompt.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">⭐ {prompt.rating.toFixed(1)} ({prompt.totalRatings})</span>
        <span className="text-muted-foreground">{prompt.usageCount} uses</span>
      </div>
    </div>
  );

  const renderContent = () => {
    const currentTab = window.innerWidth < 768 ? mobileTab : activeTab;
    
    switch (currentTab) {
      case 'premium':
        return (
          <div className="pb-20 md:pb-0">
            <div className="px-4 py-6 space-y-8">
              {/* Premium Header */}
              <div className="text-center py-8 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-2xl border border-amber-200 dark:border-amber-900">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <span className="text-4xl">👑</span>
                  </div>
                </div>
                <h2 className="mb-2">Premium Prompts Library</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover professional prompts crafted by experts to enhance your AI workflows
                </p>
              </div>

              {/* Featured Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Featured Prompts</h3>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.featured).length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.featured).map(renderPromptCard)}
                </div>
              </div>

              {/* Text Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    <h3>Text Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'text').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'text').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Image Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    <h3>Image Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'images').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'images').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Video Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎬</span>
                    <h3>Video Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'video').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'video').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Voice Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎙️</span>
                    <h3>Voice Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'voice').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'voice').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Analysis Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <h3>Analysis Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'analysis').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'analysis').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Marketing Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📢</span>
                    <h3>Marketing Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'marketing').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'marketing').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Chatbot Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <h3>Chatbot Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'chatbots').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'chatbots').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Productivity Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <h3>Productivity Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'productivity').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'productivity').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>

              {/* Design Assistant Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <h3>Design Assistant Prompts</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{allPrompts.filter(p => p.category === 'design').length} prompts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPrompts.filter(p => p.category === 'design').slice(0, 6).map(renderPromptCard)}
                </div>
              </div>
            </div>
          </div>
        );

      case 'collections':
        return (
          <div className="pb-20 md:pb-0 px-4 py-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                <FolderOpen className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Collections</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Organize your favorite AI tools into collections. Tap the button below to manage your collections.
              </p>
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => {
                    handleOpenCollections();
                    toast.info('Opening Collections Dialog...', {
                      description: 'Manage and organize your AI tools'
                    });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  <FolderOpen className="h-5 w-5 mr-2" />
                  Open Collections
                </Button>
                {collections.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    You have {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'bookmarks':
        return (
          <div className="pb-20 md:pb-0">
            {bookmarkedTools.length === 0 ? (
              <div className="px-4 py-6">
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Bookmark className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">No Bookmarks Yet</h2>
                  <p className="text-muted-foreground text-center max-w-md">
                    Start bookmarking AI tools to save them here for quick access.
                  </p>
                </div>
              </div>
            ) : (
              <ToolsSection
                title="Your Bookmarks"
                tools={bookmarkedTools}
                bookmarks={bookmarks}
                comparisonTools={comparisonTools}
                canAddToComparison={getComparisonCount() < 2}
                onBookmark={toggleBookmark}
                onInstall={handleInstall}
                onCompare={toggleComparison}
                onToolClick={handleToolClick}
                showViewAll={false}
                layout={layout}
                onLayoutChange={setLayout}
                showLayoutToggle={true}
              />
            )}
          </div>
        );

      case 'search':
      case 'trending':
        return (
          <div className="pb-20 md:pb-0">
            <FilterBar
              activeFilters={filters}
              advancedFilters={advancedFilters}
              sortBy={sortBy}
              onFilterChange={setFilters}
              onAdvancedFilterChange={setAdvancedFilters}
              onSortChange={setSortBy}
            />
            <ToolsSection
              title={currentTab === 'trending' ? "Trending Tools" : "Search Results"}
              tools={currentTab === 'trending' ? trendingTools : filteredTools}
              bookmarks={bookmarks}
              comparisonTools={comparisonTools}
              canAddToComparison={getComparisonCount() < 2}
              onBookmark={toggleBookmark}
              onInstall={handleInstall}
              onCompare={toggleComparison}
              onToolClick={handleToolClick}
              showViewAll={false}
              layout={layout}
              onLayoutChange={setLayout}
              showLayoutToggle={true}
            />
          </div>
        );

      case 'top-charts':
        return (
          <div className="pb-20 md:pb-0">
            <FilterBar
              activeFilters={filters}
              advancedFilters={advancedFilters}
              sortBy={sortBy}
              onFilterChange={setFilters}
              onAdvancedFilterChange={setAdvancedFilters}
              onSortChange={setSortBy}
            />
            <ToolsSection
              title="Top Charts"
              tools={topRatedTools}
              bookmarks={bookmarks}
              comparisonTools={comparisonTools}
              canAddToComparison={getComparisonCount() < 2}
              onBookmark={toggleBookmark}
              onInstall={handleInstall}
              onCompare={toggleComparison}
              onToolClick={handleToolClick}
              showViewAll={false}
              layout={layout}
              onLayoutChange={setLayout}
              showLayoutToggle={true}
            />
          </div>
        );

      case 'categories':
        return (
          <div className="pb-20 md:pb-0">
            {selectedCategory ? (
              <>
                <FilterBar
                  activeFilters={filters}
                  advancedFilters={advancedFilters}
                  sortBy={sortBy}
                  onFilterChange={setFilters}
                  onAdvancedFilterChange={setAdvancedFilters}
                  onSortChange={setSortBy}
                />
                <ToolsSection
                  title={categories.find(c => c.id === selectedCategory)?.name || 'Category Tools'}
                  tools={filteredTools}
                  bookmarks={bookmarks}
                  comparisonTools={comparisonTools}
                  canAddToComparison={getComparisonCount() < 2}
                  onBookmark={toggleBookmark}
                  onInstall={handleInstall}
                  onCompare={toggleComparison}
                  onToolClick={handleToolClick}
                  showViewAll={false}
                  layout={layout}
                  onLayoutChange={setLayout}
                  showLayoutToggle={true}
                />
              </>
            ) : (
              <CategorySection 
                categories={categories} 
                onCategoryClick={handleCategoryClick}
              />
            )}
          </div>
        );

      default: // 'for-you' or 'home'
        return (
          <div className="pb-20 md:pb-0">
            {/* Featured Banner */}
            {featuredBannerTools.length > 0 && (
              <FeaturedBanner
                tools={featuredBannerTools}
                onInstall={handleInstall}
                onToolClick={handleToolClick}
              />
            )}

            {/* Categories */}
            <CategorySection 
              categories={categories} 
              onCategoryClick={handleCategoryClick}
            />

            {/* Trending Tools */}
            <ToolsSection
              title="Trending Now"
              tools={trendingTools.slice(0, 8)}
              bookmarks={bookmarks}
              comparisonTools={comparisonTools}
              canAddToComparison={getComparisonCount() < 2}
              onBookmark={toggleBookmark}
              onInstall={handleInstall}
              onCompare={toggleComparison}
              onToolClick={handleToolClick}
              onViewAll={() => setActiveTab('trending')}
            />

            {/* Top Rated */}
            <ToolsSection
              title="Top Rated"
              tools={topRatedTools.slice(0, 8)}
              bookmarks={bookmarks}
              comparisonTools={comparisonTools}
              canAddToComparison={getComparisonCount() < 2}
              onBookmark={toggleBookmark}
              onInstall={handleInstall}
              onCompare={toggleComparison}
              onToolClick={handleToolClick}
              onViewAll={() => setActiveTab('top-charts')}
            />

            {/* Recently Added */}
            <ToolsSection
              title="Recently Added"
              tools={allAITools.filter(tool => tool.trending === 'New').slice(0, 8)}
              bookmarks={bookmarks}
              comparisonTools={comparisonTools}
              canAddToComparison={getComparisonCount() < 2}
              onBookmark={toggleBookmark}
              onInstall={handleInstall}
              onCompare={toggleComparison}
              onToolClick={handleToolClick}
              className="mb-6"
            />
          </div>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Loading AI Tools...</h2>
            <p className="text-muted-foreground">Fetching the latest tools from our database</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error && allAITools.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold">Failed to Load Tools</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-background">
        <Header
          onMenuClick={() => {}}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          bookmarkedTools={bookmarkedTools}
        />
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-120px)]">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
      />

      {/* Floating Submit Button for Mobile */}
      <button
        onClick={() => setSubmitDialogOpen(true)}
        className="fixed bottom-20 right-4 z-40 lg:hidden w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white dark:border-gray-800"
        aria-label="Submit Your Tool"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Comparison Tutorial */}
      <ComparisonTutorial />

      {/* Comparison Bar */}
      <ComparisonBar
        tools={comparedTools}
        comparisonTools={comparisonTools}
        onRemove={removeFromComparison}
        onCompare={handleOpenComparison}
        onClear={clearComparison}
      />

      {/* Tool Detail Dialog */}
      <ToolDetailDialog
        tool={selectedTool}
        open={toolDetailOpen}
        onOpenChange={setToolDetailOpen}
        isBookmarked={selectedTool ? bookmarks[selectedTool.id] || false : false}
        isComparing={selectedTool ? comparisonTools[selectedTool.id] || false : false}
        canAddToComparison={getComparisonCount() < 2}
        onBookmark={toggleBookmark}
        onInstall={handleInstall}
        onCompare={toggleComparison}
      />

      {/* Comparison Dialog */}
      <ComparisonDialog
        tools={comparedTools}
        open={comparisonDialogOpen}
        onOpenChange={setComparisonDialogOpen}
        onInstall={handleInstall}
      />

      {/* Collections Dialog */}
      <CollectionsDialog
        collections={collections}
        open={collectionsDialogOpen}
        onOpenChange={setCollectionsDialogOpen}
        onCreateNew={() => {
          setCollectionsDialogOpen(false);
          setCreateCollectionDialogOpen(true);
        }}
        onViewCollection={handleViewCollection}
        onDeleteCollection={deleteCollection}
      />

      {/* Collection View Dialog */}
      <CollectionViewDialog
        collection={selectedCollection}
        tools={selectedCollection ? allAITools.filter(tool => 
          getCollectionTools(selectedCollection.id).includes(tool.id)
        ) : []}
        bookmarks={bookmarks}
        open={collectionViewDialogOpen}
        onOpenChange={setCollectionViewDialogOpen}
        onBack={handleBackToCollections}
        onBookmark={toggleBookmark}
        onInstall={handleInstall}
        onToolClick={handleToolClick}
        onRemoveFromCollection={removeToolFromCollection}
      />

      {/* Add to Collection Dialog */}
      <AddToCollectionDialog
        tool={selectedTool}
        collections={collections}
        open={addToCollectionDialogOpen}
        onOpenChange={setAddToCollectionDialogOpen}
        onAddToCollection={handleAddToCollection}
        onCreateNew={() => {
          setAddToCollectionDialogOpen(false);
          setCreateCollectionDialogOpen(true);
        }}
      />

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        open={createCollectionDialogOpen}
        onOpenChange={setCreateCollectionDialogOpen}
        onCreate={handleCreateCollection}
      />

      {/* Auto-opening Submit Tool Dialog */}
      <SubmitToolDialog autoOpen={true} />

      {/* Toast Notifications */}
      <Toaster position="top-center" />
      </div>
  );
}

// Root App component that provides AuthContext
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AuthProvider>
  );
}
