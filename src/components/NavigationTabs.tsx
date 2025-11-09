import { cn } from './ui/utils';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'for-you', label: 'For you' },
  { id: 'top-charts', label: 'Top charts' },
  { id: 'categories', label: 'Categories' },
  { id: 'premium', label: 'Premium' },
];

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="border-b bg-background">
      <div className="flex space-x-8 px-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-3 px-1 border-b-2 whitespace-nowrap text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}