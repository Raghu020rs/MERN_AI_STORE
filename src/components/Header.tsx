import { Search, Menu, User, BellDot, Settings, Sun, Moon, Plus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserProfileDialog } from './UserProfileDialog';
import { SubmitToolDialog } from './SubmitToolDialog';
import { HelpDialog } from './HelpDialog';
import { toast } from 'sonner';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { AITool } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookmarkedTools: AITool[];
}

export function Header({ onMenuClick, searchQuery, onSearchChange, bookmarkedTools }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo - BotShop Branding */}
        <div className="flex items-center space-x-3 mr-4">
          <div className="relative">
            <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group">
              {/* B Letter */}
              <span className="text-white font-bold text-xl">B</span>
              
              {/* Subtle highlight overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">BotShop</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-1">
          <div className="hidden lg:block mr-2">
            <SubmitToolDialog />
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <HelpDialog />
          <Button 
            variant="ghost" 
            size="icon"
            className="hidden md:flex"
            onClick={() => toast.info('Settings feature coming soon! 🎨', {
              description: 'We\'re working on bringing you customization options.'
            })}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hidden md:flex"
            onClick={() => toast.info('Notifications feature coming soon! 🔔', {
              description: 'Stay tuned for real-time updates on your favorite tools.'
            })}
          >
            <BellDot className="h-5 w-5" />
          </Button>
          
          {/* Login/Profile Button */}
          {isAuthenticated ? (
            <UserProfileDialog bookmarkedTools={bookmarkedTools} />
          ) : (
            <Link to="/login">
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}