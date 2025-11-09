import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Validate API URL
if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.error('⚠️ VITE_API_URL is not defined in production environment!');
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================

export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; bio?: string; avatar?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  },
};

// ==================== TOOLS API ====================

export const toolsAPI = {
  // Get all tools with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minRating?: number;
    maxPrice?: number;
    sortBy?: string;
  }) => {
    const response = await api.get('/tools', { params });
    return response.data;
  },

  // Get featured tools
  getFeatured: async () => {
    const response = await api.get('/tools/featured');
    return response.data;
  },

  // Get trending tools
  getTrending: async () => {
    const response = await api.get('/tools/trending');
    return response.data;
  },

  // Get tools by category
  getByCategory: async (category: string) => {
    const response = await api.get(`/tools/category/${category}`);
    return response.data;
  },

  // Get tool by ID
  getById: async (id: string) => {
    const response = await api.get(`/tools/${id}`);
    return response.data;
  },

  // Search tools
  search: async (query: string) => {
    const response = await api.get(`/tools/search`, { params: { q: query } });
    return response.data;
  },

  // Track view
  incrementView: async (id: string) => {
    try {
      await api.post(`/tools/${id}/view`);
    } catch (error) {
      // Silent fail for tracking
      console.warn('Failed to track view:', error);
    }
  },

  // Track download
  incrementDownload: async (id: string) => {
    try {
      await api.post(`/tools/${id}/download`);
    } catch (error) {
      // Silent fail for tracking
      console.warn('Failed to track download:', error);
    }
  },

  // Submit new tool (requires auth)
  submit: async (toolData: {
    name: string;
    description: string;
    longDescription?: string;
    category: string;
    developer: string;
    website?: string;
    icon?: string;
    tags?: string[];
    features?: string[];
    price?: string;
  }) => {
    const response = await api.post('/tools/submit', toolData);
    return response.data;
  },
};

// ==================== BOOKMARKS API ====================

export const bookmarksAPI = {
  getBookmarks: async () => {
    const response = await api.get('/bookmarks');
    return response.data;
  },

  addBookmark: async (toolId: string) => {
    const response = await api.post('/bookmarks', { toolId });
    return response.data;
  },

  removeBookmark: async (toolId: string) => {
    const response = await api.delete(`/bookmarks/${toolId}`);
    return response.data;
  },
};

// ==================== REVIEWS API ====================

export const reviewsAPI = {
  getToolReviews: async (toolId: string, params?: { sort?: string }) => {
    const response = await api.get(`/reviews/tool/${toolId}`, { params });
    return response.data;
  },

  getUserReviews: async (userId: string) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  createReview: async (data: {
    toolId: string;
    rating: number;
    title: string;
    comment: string;
    pros?: string[];
    cons?: string[];
    userAvatar?: string;
  }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  updateReview: async (
    reviewId: string,
    data: {
      rating?: number;
      title?: string;
      comment?: string;
      pros?: string[];
      cons?: string[];
    }
  ) => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  markHelpful: async (reviewId: string) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  reportReview: async (reviewId: string, reason: string) => {
    const response = await api.post(`/reviews/${reviewId}/report`, { reason });
    return response.data;
  },
};

// ==================== COLLECTIONS API ====================

export const collectionsAPI = {
  getPublicCollections: async (params?: { sort?: string }) => {
    const response = await api.get('/collections', { params });
    return response.data;
  },

  getUserCollections: async (userId: string) => {
    const response = await api.get(`/collections/user/${userId}`);
    return response.data;
  },

  getCollection: async (collectionId: string) => {
    const response = await api.get(`/collections/${collectionId}`);
    return response.data;
  },

  createCollection: async (data: {
    name: string;
    description: string;
    icon?: string;
    isPublic?: boolean;
    tools?: string[];
  }) => {
    const response = await api.post('/collections', data);
    return response.data;
  },

  updateCollection: async (
    collectionId: string,
    data: {
      name?: string;
      description?: string;
      icon?: string;
      isPublic?: boolean;
    }
  ) => {
    const response = await api.put(`/collections/${collectionId}`, data);
    return response.data;
  },

  deleteCollection: async (collectionId: string) => {
    const response = await api.delete(`/collections/${collectionId}`);
    return response.data;
  },

  addTool: async (collectionId: string, toolId: string) => {
    const response = await api.post(`/collections/${collectionId}/tools`, {
      toolId,
    });
    return response.data;
  },

  removeTool: async (collectionId: string, toolId: string) => {
    const response = await api.delete(
      `/collections/${collectionId}/tools/${toolId}`
    );
    return response.data;
  },

  cloneCollection: async (collectionId: string) => {
    const response = await api.post(`/collections/${collectionId}/clone`);
    return response.data;
  },

  toggleFollow: async (collectionId: string) => {
    const response = await api.post(`/collections/${collectionId}/follow`);
    return response.data;
  },
};

// ==================== INSTALLATIONS API ====================

export const installationsAPI = {
  trackInstallation: async (data: {
    toolId: string;
    sessionId: string;
    source?: string;
    referrer?: string;
    device?: string;
    browser?: string;
    os?: string;
  }) => {
    const response = await api.post('/installations', data);
    return response.data;
  },

  getUserInstallations: async () => {
    const response = await api.get('/installations/user');
    return response.data;
  },
};

export default api;
