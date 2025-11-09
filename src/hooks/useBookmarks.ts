import { useState, useCallback, useEffect } from 'react';
import { bookmarksAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { BookmarkState } from '../types';

export function useBookmarks() {
  const { isAuthenticated, user } = useAuth();
  const [bookmarks, setBookmarks] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load bookmarks from backend when user logs in
  useEffect(() => {
    const loadBookmarks = async () => {
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);
          const response = await bookmarksAPI.getBookmarks();
          
          // Convert array of bookmarked tools to bookmark state object
          const bookmarkState = {} as any;
          if (response.data.bookmarks) {
            response.data.bookmarks.forEach((tool: any) => {
              bookmarkState[tool._id] = true;
            });
          }
          setBookmarks(bookmarkState);
        } catch (error) {
          console.error('Failed to load bookmarks:', error);
          // Fall back to localStorage if API fails
          const saved = localStorage.getItem('bookmarks');
          if (saved) {
            setBookmarks(JSON.parse(saved));
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // Load from localStorage for non-authenticated users
        const saved = localStorage.getItem('bookmarks');
        if (saved) {
          setBookmarks(JSON.parse(saved));
        }
      }
    };

    loadBookmarks();
  }, [isAuthenticated, user]);
  
  const toggleBookmark = useCallback(async (toolId: string) => {
    const wasBookmarked = bookmarks[toolId];
    
    // Optimistic update
    setBookmarks((prev: any) => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));

    if (isAuthenticated) {
      try {
        if (wasBookmarked) {
          await bookmarksAPI.removeBookmark(toolId);
          toast.success('Removed from bookmarks');
        } else {
          await bookmarksAPI.addBookmark(toolId);
          toast.success('Added to bookmarks');
        }
      } catch (error: any) {
        // Revert on error
        setBookmarks((prev: any) => ({
          ...prev,
          [toolId]: wasBookmarked
        }));
        
        const message = error.response?.data?.message || 'Failed to update bookmark';
        toast.error(message);
      }
    } else {
      // Save to localStorage for non-authenticated users
      const newBookmarks = {
        ...bookmarks,
        [toolId]: !wasBookmarked
      };
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      
      if (!wasBookmarked) {
        toast.success('Added to bookmarks (login to sync across devices)');
      } else {
        toast.success('Removed from bookmarks');
      }
    }
  }, [bookmarks, isAuthenticated]);
  
  const isBookmarked = useCallback((toolId: string) => {
    return bookmarks[toolId] || false;
  }, [bookmarks]);
  
  const getBookmarkedTools = useCallback((allTools: any[]) => {
    return allTools.filter((tool: any) => bookmarks[tool.id] || bookmarks[tool._id]);
  }, [bookmarks]);
  
  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    getBookmarkedTools,
    isLoading
  };
}