import { useState, useEffect } from 'react';
import { Scale, X, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

export function ComparisonTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem('comparison-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('comparison-tutorial-seen', 'true');
    setShowTutorial(false);
  };

  if (!showTutorial) return null;

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 animate-in slide-in-from-top duration-300">
      <Alert className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
            <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                New: Compare Tools
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-2 -mt-1"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AlertDescription className="text-sm text-emerald-800 dark:text-emerald-200">
              Click the <Scale className="h-3 w-3 inline mx-1" /> icon on any tool card to add it to comparison. 
              Compare up to 2 tools side-by-side to find your perfect AI tool!
            </AlertDescription>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                onClick={handleDismiss}
              >
                Got it
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-emerald-700 dark:text-emerald-300"
                onClick={() => {
                  handleDismiss();
                  window.open('/USER_GUIDE.md', '_blank');
                }}
              >
                <Info className="h-3 w-3 mr-1" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}
