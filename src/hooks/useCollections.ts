import { useState, useCallback } from 'react';
import { Collection } from '../types';

const defaultCollections: Collection[] = [
  {
    id: 'favorites',
    name: 'Favorites',
    description: 'My favorite AI tools',
    toolIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: 'bg-red-500',
    icon: 'Heart',
  },
  {
    id: 'work',
    name: 'Work Tools',
    description: 'Essential tools for productivity',
    toolIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: 'bg-blue-500',
    icon: 'Folder',
  },
];

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('collections');
    return saved ? JSON.parse(saved) : defaultCollections;
  });

  const createCollection = useCallback((collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCollection: Collection = {
      ...collection,
      id: `collection-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCollections(prev => {
      const updated = [...prev, newCollection];
      localStorage.setItem('collections', JSON.stringify(updated));
      return updated;
    });
    
    return newCollection;
  }, []);

  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    setCollections(prev => {
      const updated = prev.map(col =>
        col.id === id
          ? { ...col, ...updates, updatedAt: new Date().toISOString() }
          : col
      );
      localStorage.setItem('collections', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections(prev => {
      const updated = prev.filter(col => col.id !== id);
      localStorage.setItem('collections', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addToolToCollection = useCallback((collectionId: string, toolId: string) => {
    setCollections(prev => {
      const updated = prev.map(col => {
        if (col.id === collectionId && !col.toolIds.includes(toolId)) {
          return {
            ...col,
            toolIds: [...col.toolIds, toolId],
            updatedAt: new Date().toISOString(),
          };
        }
        return col;
      });
      localStorage.setItem('collections', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeToolFromCollection = useCallback((collectionId: string, toolId: string) => {
    setCollections(prev => {
      const updated = prev.map(col => {
        if (col.id === collectionId) {
          return {
            ...col,
            toolIds: col.toolIds.filter(id => id !== toolId),
            updatedAt: new Date().toISOString(),
          };
        }
        return col;
      });
      localStorage.setItem('collections', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getCollectionTools = useCallback((collectionId: string) => {
    const collection = collections.find(col => col.id === collectionId);
    return collection?.toolIds || [];
  }, [collections]);

  return {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addToolToCollection,
    removeToolFromCollection,
    getCollectionTools,
  };
}
