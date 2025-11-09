import { useState, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import { ComparisonState } from '../types';

export function useComparison() {
  const [comparisonTools, setComparisonTools] = useState<ComparisonState>(() => {
    const saved = localStorage.getItem('comparison-tools');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleComparison = useCallback((toolId: string) => {
    setComparisonTools(prev => {
      const current = { ...prev };
      const comparedCount = Object.values(current).filter(Boolean).length;
      
      // Limit to 2 tools for comparison
      if (!current[toolId] && comparedCount >= 2) {
        toast.error('Maximum 2 tools can be compared', {
          description: 'Remove a tool to add another'
        });
        return prev; // Don't add if already at max
      }
      
      const isAdding = !current[toolId];
      current[toolId] = !current[toolId];
      localStorage.setItem('comparison-tools', JSON.stringify(current));
      
      if (isAdding) {
        toast.success('Added to comparison', {
          description: `${comparedCount + 1}/2 tools selected`
        });
      } else {
        toast.info('Removed from comparison');
      }
      
      return current;
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonTools({});
    localStorage.setItem('comparison-tools', JSON.stringify({}));
  }, []);

  const removeFromComparison = useCallback((toolId: string) => {
    setComparisonTools(prev => {
      const current = { ...prev };
      delete current[toolId];
      localStorage.setItem('comparison-tools', JSON.stringify(current));
      return current;
    });
  }, []);

  const getComparisonCount = useCallback(() => {
    return Object.values(comparisonTools).filter(Boolean).length;
  }, [comparisonTools]);

  return {
    comparisonTools,
    toggleComparison,
    clearComparison,
    removeFromComparison,
    getComparisonCount,
  };
}
