import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Bug, AlertCircle } from 'lucide-react';

// Component that throws an error when clicked
const BuggyComponent = () => {
  throw new Error('This is a test error from BuggyComponent!');
};

export const ErrorBoundaryTest = () => {
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleTestError = () => {
    setShowBuggyComponent(true);
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className="gap-2"
      >
        <Bug className="h-4 w-4" />
        Test Error Boundary
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Error Boundary Test
            </DialogTitle>
            <DialogDescription>
              Click the button below to trigger a test error and see the Error Boundary in action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Warning
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This will intentionally crash the component to test error handling.
                    The Error Boundary will catch it and show a nice error screen.
                  </p>
                </div>
              </div>
            </div>

            {showBuggyComponent && <BuggyComponent />}

            <div className="flex gap-2">
              <Button
                onClick={handleTestError}
                variant="destructive"
                className="flex-1"
              >
                <Bug className="mr-2 h-4 w-4" />
                Trigger Error
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
