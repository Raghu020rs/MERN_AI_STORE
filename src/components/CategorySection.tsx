import { 
  ChevronRight, 
  MessageSquare, 
  Image, 
  Video, 
  Mic, 
  BarChart3, 
  Bot, 
  Zap, 
  Palette, 
  Code, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Category } from '../types';
import type { LucideIcon } from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  'MessageSquare': MessageSquare,
  'Image': Image,
  'Video': Video,
  'Mic': Mic,
  'BarChart3': BarChart3,
  'Bot': Bot,
  'Zap': Zap,
  'Palette': Palette,
  'Code': Code,
  'TrendingUp': TrendingUp,
  'Sparkles': Sparkles,
};

export function CategorySection({ categories, onCategoryClick }: CategorySectionProps) {
  // Gradient colors for each category
  const gradients = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600', 
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-lime-500 to-green-600',
    'from-fuchsia-500 to-purple-600',
  ];

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Browse by Category
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Explore AI tools by category</p>
        </div>
        <Button variant="ghost" size="sm" className="hidden md:flex">
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {categories.slice(0, 10).map((category, index) => {
          const IconComponent = iconMap[category.icon] || Sparkles;
          const gradient = gradients[index % gradients.length];
          
          return (
            <Card 
              key={category.id}
              className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-emerald-500/50 overflow-hidden relative"
              onClick={() => {
                console.log('Category clicked:', category.id, category.name);
                onCategoryClick(category.id);
              }}
            >
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <CardContent className="p-4 md:p-5 text-center relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 rounded-2xl bg-muted/30 dark:bg-muted/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-border/50">
                  <IconComponent className="h-7 w-7 md:h-8 md:w-8 text-foreground" />
                </div>
                <h3 className="text-sm md:text-base font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.toolCount.toLocaleString()} tools
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}