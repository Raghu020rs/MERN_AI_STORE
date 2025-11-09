import { Filter, Settings2, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AdvancedFilterDialog } from './AdvancedFilterDialog';

interface FilterBarProps {
  activeFilters: string[];
  advancedFilters?: {
    pricing: string[];
    features: string[];
    integrations: string[];
    trending: string[];
  };
  sortBy: string;
  onFilterChange: (filters: string[]) => void;
  onAdvancedFilterChange?: (filters: {
    pricing: string[];
    features: string[];
    integrations: string[];
    trending: string[];
  }) => void;
  onSortChange: (sort: string) => void;
}

const filterOptions = [
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
  { id: 'freemium', label: 'Freemium' },
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New' },
  { id: 'editors-pick', label: "Editor's Pick" },
];

const sortOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Rating' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'newest', label: 'Newest' },
  { id: 'name', label: 'Name A-Z' },
];

export function FilterBar({ 
  activeFilters, 
  advancedFilters,
  sortBy, 
  onFilterChange, 
  onAdvancedFilterChange,
  onSortChange 
}: FilterBarProps) {
  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(f => f !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background/50 backdrop-blur">
      <div className="flex items-center space-x-2 overflow-x-auto">
        {/* Advanced Filters */}
        {onAdvancedFilterChange && advancedFilters && (
          <AdvancedFilterDialog
            activeFilters={advancedFilters}
            onFilterChange={onAdvancedFilterChange}
          />
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => toggleFilter(option.id)}
                className="flex items-center justify-between"
              >
                {option.label}
                {activeFilters.includes(option.id) && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilters.map((filterId) => {
          const option = filterOptions.find(o => o.id === filterId);
          return option ? (
            <Badge
              key={filterId}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleFilter(filterId)}
            >
              {option.label}
              <span className="ml-1 text-xs">×</span>
            </Badge>
          ) : null;
        })}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOptions.find(o => o.id === sortBy)?.label || 'Sort'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => onSortChange(option.id)}
              className="flex items-center justify-between"
            >
              {option.label}
              {sortBy === option.id && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}