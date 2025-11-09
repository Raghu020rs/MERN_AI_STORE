import { useState, useEffect } from 'react';
import { Star, Bookmark, ExternalLink, ThumbsUp, Send, Play, Scale, FolderPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { AITool, Review } from '../types';
import { AIToolIcon } from './AIToolIcon';
import { useAuth } from '../contexts/AuthContext';
import { reviewsAPI } from '../lib/api';

interface ToolDetailDialogProps {
  tool: AITool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBookmarked: boolean;
  isComparing?: boolean;
  canAddToComparison?: boolean;
  onBookmark: (toolId: string) => void;
  onInstall: (tool: AITool) => void;
  onCompare?: (toolId: string) => void;
  onAddToCollection?: (toolId: string) => void;
}

export default function ToolDetailDialog({
  tool,
  open,
  onOpenChange,
  isBookmarked,
  isComparing = false,
  canAddToComparison = true,
  onBookmark,
  onInstall,
  onCompare,
  onAddToCollection,
}: ToolDetailDialogProps) {
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([] as any[]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (tool && open) {
      setLoadingReviews(true);
      reviewsAPI.getToolReviews(tool.id)
        .then((res) => {
          setReviews(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
        })
        .catch(() => {
          setReviews([]);
          toast.error('Failed to load reviews');
        })
        .finally(() => setLoadingReviews(false));
    }
  }, [tool, open]);

  const handleSubmitReview = async (e?: any) => {
    if (e) e.preventDefault();
    if (!tool || !newComment.trim() || userRating === 0 || submittingReview) return;
    setSubmittingReview(true);
    try {
      const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;
      const res = await reviewsAPI.createReview({
        toolId: tool.id,
        rating: userRating,
        title: 'Review',
        comment: newComment,
        userAvatar: avatarUrl,
      });
      // If backend doesn't return avatar, inject it for display
      const reviewWithAvatar = { ...(res.data || res), userAvatar: avatarUrl };
      setReviews([reviewWithAvatar, ...reviews]);
      setNewComment('');
      setUserRating(0);
      toast.success('Review submitted!');
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const displayReviews = reviews;
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = displayReviews.filter((r: any) => r.rating === stars).length;
    const percentage = displayReviews.length > 0 ? (count / displayReviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  // Guard: don't render if no tool
  if (!tool) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogDescription className="sr-only">
          Detailed information about {tool?.name || 'the tool'} including reviews, ratings, and features
        </DialogDescription>
        <ScrollArea className="h-[90vh]">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-20 h-20 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                <AIToolIcon icon={tool.icon} name={tool.id} size="large" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl mb-1">{tool.name}</DialogTitle>
                <p className="text-muted-foreground mb-2">{tool.developer}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{tool.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">
                      ({(tool.reviewCount || 0).toLocaleString()} reviews)
                    </span>
                  </div>
                  {tool.downloadCount && (
                    <span className="text-sm text-muted-foreground">
                      {tool.downloadCount} downloads
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onBookmark(tool.id)}
                  className={cn(isBookmarked && 'text-emerald-600')}
                >
                  <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <div className="flex space-x-3">
                <Button
                  onClick={() => onInstall(tool)}
                  className={cn(
                    'flex-1 rounded-full',
                    tool.price === 'Free'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                  )}
                  variant={tool.price === 'Free' ? 'default' : 'outline'}
                >
                  {tool.price === 'Free' ? 'Install Now' : tool.actualPrice || 'Get Started'}
                </Button>
                {tool.demoUrl && (
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => window.open(tool.demoUrl, '_blank', 'noopener,noreferrer')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                )}
                {tool.website && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => window.open(tool.website, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                {onCompare && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => onCompare(tool.id)}
                    disabled={!canAddToComparison && !isComparing}
                  >
                    <Scale className="h-4 w-4 mr-2" />
                    {isComparing ? 'Remove from Compare' : 'Add to Compare'}
                  </Button>
                )}
                {onAddToCollection && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => onAddToCollection(tool.id)}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Add to Collection
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Reviews feature coming soon! ⭐', {
                      description: 'Share your experience and help others discover great AI tools.'
                    });
                  }}
                >
                  Reviews
                </TabsTrigger>
                {tool.demoUrl && (
                  <TabsTrigger 
                    value="demo"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(tool.demoUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Try Now
                  </TabsTrigger>
                )}
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6 mt-6">
                <div>
                  <h3 className="mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {tool.longDescription || tool.description}
                  </p>
                </div>

                {tool.features && tool.features.length > 0 && (
                  <div>
                    <h3 className="mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tool.integrations && tool.integrations.length > 0 && (
                  <div>
                    <h3 className="mb-3">Integrations</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.integrations.map((integration, index) => (
                        <Badge key={index} variant="secondary">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Category</p>
                    <p>{tool.category}</p>
                  </div>
                  {tool.size && (
                    <div>
                      <p className="text-muted-foreground mb-1">Size</p>
                      <p>{tool.size}</p>
                    </div>
                  )}
                  {tool.version && (
                    <div>
                      <p className="text-muted-foreground mb-1">Version</p>
                      <p>{tool.version}</p>
                    </div>
                  )}
                  {tool.lastUpdated && (
                    <div>
                      <p className="text-muted-foreground mb-1">Updated</p>
                      <p>{tool.lastUpdated}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                {/* Rating Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-5xl mb-2">{tool.rating.toFixed(1)}</div>
                      <div className="flex items-center justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'h-4 w-4',
                              star <= Math.round(tool.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(tool.reviewCount || 0).toLocaleString()} reviews
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ratingDistribution.map(({ stars, count, percentage }) => (
                      <div key={stars} className="flex items-center space-x-3">
                        <span className="text-sm w-4">{stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Write a Review - Authentication Required */}
                <div className="space-y-3">
                  <h3>Write a Review</h3>
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Your rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'h-5 w-5 cursor-pointer transition-colors',
                              star <= userRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-400'
                            )}
                            onClick={() => setUserRating(star)}
                          />
                        ))}
                      </div>
                      <Textarea
                        placeholder="Share your experience with this tool..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!newComment.trim() || userRating === 0}
                        className="rounded-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Review
                      </Button>
                    </>
                  ) : (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        Please log in to write a review and share your experience with this tool.
                      </p>
                      <Button
                        onClick={() => {
                          onOpenChange(false);
                          navigate('/login', { state: { from: window.location.pathname } });
                        }}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login to Write Review
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Reviews List */}
                <div className="space-y-4">
                  <h3>User Reviews</h3>
                  {displayReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback>{review.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{review.userName}</p>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-3 w-3',
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Demo Tab */}
              {tool.demoUrl && (
                <TabsContent value="demo" className="mt-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Play className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Demo will be embedded here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        URL: {tool.demoUrl}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}