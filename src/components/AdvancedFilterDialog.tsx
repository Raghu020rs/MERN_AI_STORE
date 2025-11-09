import { Settings2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface AdvancedFilterDialogProps {
  activeFilters: {
    pricing: string[];
    features: string[];
    integrations: string[];
    trending: string[];
  };
  onFilterChange: (filters: {
    pricing: string[];
    features: string[];
    integrations: string[];
    trending: string[];
  }) => void;
}

const pricingOptions = [
  { id: 'free', label: 'Free' },
  { id: 'freemium', label: 'Freemium' },
  { id: 'paid', label: 'Paid' },
];

const featureOptions = [
  { id: 'api-access', label: 'API Access' },
  { id: 'custom-training', label: 'Custom Training' },
  { id: 'team-collaboration', label: 'Team Collaboration' },
  { id: 'offline-mode', label: 'Offline Mode' },
  { id: 'mobile-app', label: 'Mobile App' },
  { id: 'white-label', label: 'White Label' },
  { id: 'analytics', label: 'Analytics & Insights' },
  { id: 'multi-language', label: 'Multi-language Support' },
  { id: 'data-export', label: 'Data Export' },
  { id: 'sso', label: 'SSO/SAML' },
];

const integrationOptions = [
  { id: 'slack', label: 'Slack' },
  { id: 'discord', label: 'Discord' },
  { id: 'google-workspace', label: 'Google Workspace' },
  { id: 'microsoft-365', label: 'Microsoft 365' },
  { id: 'notion', label: 'Notion' },
  { id: 'zapier', label: 'Zapier' },
  { id: 'salesforce', label: 'Salesforce' },
  { id: 'hubspot', label: 'HubSpot' },
  { id: 'shopify', label: 'Shopify' },
  { id: 'wordpress', label: 'WordPress' },
  { id: 'api', label: 'REST API' },
  { id: 'webhook', label: 'Webhooks' },
];

const trendingOptions = [
  { id: 'new', label: 'New' },
  { id: 'rising', label: 'Rising' },
  { id: 'editors-pick', label: "Editor's Pick" },
  { id: 'trending', label: 'Trending' },
];

export function AdvancedFilterDialog({ activeFilters, onFilterChange }: AdvancedFilterDialogProps) {
  const toggleFilter = (category: keyof typeof activeFilters, filterId: string) => {
    const currentFilters = activeFilters[category];
    const newFilters = currentFilters.includes(filterId)
      ? currentFilters.filter(f => f !== filterId)
      : [...currentFilters, filterId];
    
    onFilterChange({
      ...activeFilters,
      [category]: newFilters,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      pricing: [],
      features: [],
      integrations: [],
      trending: [],
    });
  };

  const totalActiveFilters = Object.values(activeFilters).flat().length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Settings2 className="h-4 w-4 mr-2" />
          Advanced Filters
          {totalActiveFilters > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-xs">
              {totalActiveFilters}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogDescription className="sr-only">
          Advanced filters for searching AI tools
        </DialogDescription>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Advanced Filters</DialogTitle>
            {totalActiveFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Pricing */}
            <div>
              <h3 className="mb-3">Pricing Model</h3>
              <div className="space-y-2">
                {pricingOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pricing-${option.id}`}
                      checked={activeFilters.pricing.includes(option.id)}
                      onCheckedChange={() => toggleFilter('pricing', option.id)}
                    />
                    <Label htmlFor={`pricing-${option.id}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h3 className="mb-3">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {featureOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${option.id}`}
                      checked={activeFilters.features.includes(option.id)}
                      onCheckedChange={() => toggleFilter('features', option.id)}
                    />
                    <Label htmlFor={`feature-${option.id}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Integrations */}
            <div>
              <h3 className="mb-3">Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {integrationOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`integration-${option.id}`}
                      checked={activeFilters.integrations.includes(option.id)}
                      onCheckedChange={() => toggleFilter('integrations', option.id)}
                    />
                    <Label htmlFor={`integration-${option.id}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Trending */}
            <div>
              <h3 className="mb-3">Special Categories</h3>
              <div className="space-y-2">
                {trendingOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`trending-${option.id}`}
                      checked={activeFilters.trending.includes(option.id)}
                      onCheckedChange={() => toggleFilter('trending', option.id)}
                    />
                    <Label htmlFor={`trending-${option.id}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}