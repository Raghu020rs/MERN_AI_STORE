import { useState } from 'react';
import { User, Star, Bookmark, MessageSquare, Activity, Settings, Trophy, Target, Zap, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { useAuth } from '../contexts/AuthContext';
import { AITool } from '../types';
import { AIToolIcon } from './AIToolIcon';

interface UserProfileDialogProps {
  bookmarkedTools: AITool[];
}

const defaultBadges = [
  { id: 1, name: 'Early Adopter', icon: Trophy, color: 'text-yellow-600' },
  { id: 2, name: 'Review Master', icon: Star, color: 'text-blue-600' },
  { id: 3, name: 'Explorer', icon: Target, color: 'text-emerald-600' },
];

const mockActivity = [
  {
    id: 1,
    type: 'install',
    toolName: 'ChatGPT',
    timestamp: '2 hours ago',
    icon: Zap,
  },
  {
    id: 2,
    type: 'review',
    toolName: 'Midjourney',
    rating: 5,
    timestamp: '5 hours ago',
    icon: Star,
  },
  {
    id: 3,
    type: 'bookmark',
    toolName: 'Claude AI',
    timestamp: '1 day ago',
    icon: Bookmark,
  },
  {
    id: 4,
    type: 'install',
    toolName: 'GitHub Copilot',
    timestamp: '2 days ago',
    icon: Zap,
  },
  {
    id: 5,
    type: 'review',
    toolName: 'Runway ML',
    rating: 4,
    timestamp: '3 days ago',
    icon: Star,
  },
  {
    id: 6,
    type: 'bookmark',
    toolName: 'Stable Diffusion',
    timestamp: '4 days ago',
    icon: Bookmark,
  },
];

export function UserProfileDialog({ bookmarkedTools }: UserProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  // If no user, return null (shouldn't happen as Header handles this)
  if (!user) return null;

  const getActivityText = (activity: typeof mockActivity[0]) => {
    switch (activity.type) {
      case 'install':
        return `Installed ${activity.toolName}`;
      case 'review':
        return `Rated ${activity.toolName} ${activity.rating} stars`;
      case 'bookmark':
        return `Bookmarked ${activity.toolName}`;
      default:
        return '';
    }
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  // Format join date
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Get user initials for fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 hover:ring-2 ring-primary transition-all">
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage 
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name}`} 
              alt={user.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-semibold text-xs">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogDescription className="sr-only">
          User profile with statistics, activity feed, favorites, and reviews
        </DialogDescription>
        <ScrollArea className="h-[90vh]">
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-4 mb-6">
              <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg">
                <AvatarImage 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name}`} 
                  alt={user.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-2xl">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-1">{user.name}</DialogTitle>
                <p className="text-muted-foreground mb-2">{user.email}</p>
                {user.bio && (
                  <p className="text-sm text-foreground mb-2">{user.bio}</p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Member since {joinDate}</span>
                  {user.role && user.role !== 'user' && (
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toast.info('Settings feature coming soon! ⚙️', {
                    description: 'Customize your profile and preferences.'
                  })}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{user.stats?.toolsInstalled || 0}</div>
                  <p className="text-xs text-muted-foreground">Tools Installed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{user.stats?.bookmarksCount || bookmarkedTools.length}</div>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{user.stats?.reviewsCount || 0}</div>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{user.stats?.collectionsCount || 0}</div>
                  <p className="text-xs text-muted-foreground">Collections</p>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <div className="mb-6">
              <div 
                className="flex items-center gap-2 mb-3 cursor-pointer"
                onClick={() => toast.info('Achievements feature coming soon! 🏆', {
                  description: 'Unlock badges and earn rewards as you explore AI tools.'
                })}
              >
                <h3>Achievements</h3>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-wrap gap-3">
                {defaultBadges.map((badge) => (
                  <Card key={badge.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center space-x-3">
                      <div className={cn('w-10 h-10 rounded-full bg-muted flex items-center justify-center', badge.color)}>
                        <badge.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{badge.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Tabs */}
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger 
                  value="activity"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Activity feed coming soon! 📊', {
                      description: 'Track your tool usage and engagement history.'
                    });
                  }}
                  className="flex items-center space-x-2"
                >
                  <Activity className="h-4 w-4" />
                  <span>Activity</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center space-x-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Favorites</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Reviews feature coming soon! 📝', {
                      description: 'Write and manage your tool reviews.'
                    });
                  }}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Reviews</span>
                </TabsTrigger>
              </TabsList>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-6">
                <div className="space-y-4">
                  <h3>Recent Activity</h3>
                  {mockActivity.map((activity) => (
                    <Card key={activity.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                            <activity.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{getActivityText(activity)}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                          </div>
                          {activity.rating && (
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-3 w-3',
                                    i < activity.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3>Favorite Tools</h3>
                    <Badge variant="secondary">{bookmarkedTools.length} tools</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {bookmarkedTools.slice(0, 10).map((tool) => (
                      <Card key={tool.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                              <AIToolIcon icon={tool.icon} name={tool.id} size="small" />
                            </div>
                            <div className="flex-1">
                              <p>{tool.name}</p>
                              <p className="text-sm text-muted-foreground">{tool.developer}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{tool.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3>Your Reviews</h3>
                    <Badge variant="secondary">{user.stats?.reviewsCount || 0} reviews</Badge>
                  </div>
                  {mockActivity.filter(a => a.type === 'review').map((review) => (
                    <Card key={review.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <p>{review.toolName}</p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-3 w-3',
                                  i < (review.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Great tool! Really improved my workflow and productivity.
                        </p>
                        <p className="text-xs text-muted-foreground">{review.timestamp}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}