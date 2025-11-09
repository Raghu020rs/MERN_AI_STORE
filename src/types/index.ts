export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  developer: string;
  rating: number;
  reviewCount?: number; // Changed from totalRatings to match backend
  size?: string;
  price: 'Free' | 'Paid' | 'Freemium';
  actualPrice?: string;
  tags: string[];
  icon: string;
  screenshots: string[];
  featured?: boolean;
  trending?: 'New' | 'Rising' | "Editor's Pick";
  downloadCount?: string;
  lastUpdated?: string;
  version?: string;
  features?: string[];
  integrations?: string[];
  website?: string;
  demoUrl?: string;
  longDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  toolCount: number;
}

export interface BookmarkState {
  [toolId: string]: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bookmarks: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toolId: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface ToolSubmission {
  name: string;
  description: string;
  longDescription: string;
  category: string;
  developer: string;
  website: string;
  demoUrl?: string;
  features: string[];
  integrations: string[];
  price: 'Free' | 'Paid' | 'Freemium';
  actualPrice?: string;
  domainType: 'free' | 'custom';
  customDomain?: string;
  contactEmail: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
  createdAt: string;
  updatedAt: string;
  color?: string;
  icon?: string;
}

export interface ComparisonState {
  [toolId: string]: boolean;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  author: string;
  rating: number;
  totalRatings: number;
  tags: string[];
  icon: string;
  featured?: boolean;
  trending?: 'New' | 'Rising' | "Editor's Pick";
  usageCount?: string;
  lastUpdated?: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  promptCount: number;
}