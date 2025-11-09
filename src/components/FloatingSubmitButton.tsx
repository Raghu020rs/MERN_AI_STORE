import { Plus } from 'lucide-react';
import { useState } from 'react';
import { SubmitToolDialog } from './SubmitToolDialog';
import { cn } from './ui/utils';

export function FloatingSubmitButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "fixed bottom-20 right-4 z-40",
          "lg:hidden", // Hide on desktop since header has the button
          "w-14 h-14 rounded-full",
          "bg-gradient-to-r from-emerald-600 to-emerald-700",
          "text-white shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all duration-200 hover:scale-110 active:scale-95",
          "border-2 border-white dark:border-gray-800"
        )}
        aria-label="Submit Your Tool"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Hidden Dialog - controlled by state */}
      <div style={{ display: 'none' }}>
        <SubmitToolDialog />
      </div>
    </>
  );
}
