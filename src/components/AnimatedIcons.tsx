import { motion } from 'motion/react';
import { 
  Crown, 
  MessageSquare, 
  Image, 
  Video, 
  Mic, 
  BarChart3, 
  TrendingUp, 
  Bot, 
  Zap, 
  Palette,
  Star,
  Heart,
  Bookmark,
  Download,
  Share2,
  Check,
  X,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Settings,
  Bell,
  type LucideProps
} from 'lucide-react';

// Animation variants
const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.9
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeOut"
    }
  },
  spin: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  },
  wiggle: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

interface AnimatedIconProps extends LucideProps {
  animation?: 'hover' | 'tap' | 'pulse' | 'bounce' | 'spin' | 'wiggle' | 'none';
}

// Base animated icon wrapper
const AnimatedIcon = ({ 
  Icon, 
  animation = 'hover',
  className = '',
  ...props 
}: AnimatedIconProps & { Icon: React.ComponentType<LucideProps> }) => {
  const MotionIcon = motion(Icon);
  
  const getAnimationProps = () => {
    if (animation === 'none') return {};
    
    switch (animation) {
      case 'pulse':
      case 'bounce':
      case 'spin':
        return { animate: animation };
      case 'hover':
      case 'tap':
        return { 
          whileHover: animation === 'hover' ? 'hover' : undefined,
          whileTap: animation === 'tap' ? 'tap' : undefined 
        };
      default:
        return { whileHover: 'hover', whileTap: 'tap' };
    }
  };

  return (
    <MotionIcon
      variants={iconVariants}
      {...getAnimationProps()}
      className={className}
      {...props}
    />
  );
};

// Premium Crown Icon with gold glow
export const AnimatedCrown = ({ className = '', ...props }: AnimatedIconProps) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover={{ scale: 1.1 }}
      animate={{
        filter: [
          'drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))',
          'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
          'drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))',
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Crown {...props} className="text-amber-500" />
    </motion.div>
  );
};

// Bookmarked heart animation
export const AnimatedHeart = ({ isActive = false, className = '', ...props }: AnimatedIconProps & { isActive?: boolean }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={isActive ? {
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0],
        } : {}}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <Heart 
          {...props} 
          className={isActive ? 'fill-red-500 text-red-500' : ''} 
        />
      </motion.div>
    </motion.div>
  );
};

// Bookmark toggle animation
export const AnimatedBookmark = ({ isActive = false, className = '', ...props }: AnimatedIconProps & { isActive?: boolean }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.15, rotate: -5 }}
      whileTap={{ scale: 0.95 }}
      animate={isActive ? {
        y: [0, -5, 0],
      } : {}}
      transition={{
        duration: 0.3,
      }}
    >
      <Bookmark 
        {...props} 
        className={isActive ? 'fill-emerald-600 text-emerald-600' : ''} 
      />
    </motion.div>
  );
};

// Star rating animation
export const AnimatedStar = ({ index = 0, filled = false, className = '', ...props }: AnimatedIconProps & { index?: number; filled?: boolean }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 10
      }}
      whileHover={{ 
        scale: 1.3,
        rotate: 72,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Star 
        {...props} 
        className={filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
      />
    </motion.div>
  );
};

// Download with progress
export const AnimatedDownload = ({ className = '', ...props }: AnimatedIconProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: [0, 3, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'loop'
      }}
    >
      <Download {...props} />
    </motion.div>
  );
};

// Share with ripple effect
export const AnimatedShare = ({ className = '', ...props }: AnimatedIconProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: 15 }}
    >
      <Share2 {...props} />
    </motion.div>
  );
};

// Search with pulse
export const AnimatedSearch = ({ isActive = false, className = '', ...props }: AnimatedIconProps & { isActive?: boolean }) => {
  return (
    <motion.div
      className={className}
      animate={isActive ? {
        scale: [1, 1.1, 1],
      } : {}}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
      whileHover={{ rotate: 15 }}
    >
      <Search {...props} />
    </motion.div>
  );
};

// Success checkmark
export const AnimatedCheck = ({ className = '', ...props }: AnimatedIconProps) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
    >
      <Check {...props} className="text-emerald-600" />
    </motion.div>
  );
};

// Error X
export const AnimatedX = ({ className = '', ...props }: AnimatedIconProps) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ rotate: 90 }}
    >
      <X {...props} className="text-red-600" />
    </motion.div>
  );
};

// Plus with rotation
export const AnimatedPlus = ({ className = '', ...props }: AnimatedIconProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ rotate: 90, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Plus {...props} />
    </motion.div>
  );
};

// Notification bell
export const AnimatedBell = ({ hasNotification = false, className = '', ...props }: AnimatedIconProps & { hasNotification?: boolean }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={hasNotification ? {
        rotate: [0, -15, 15, -15, 15, 0],
      } : {}}
      transition={{
        duration: 0.5,
        repeat: hasNotification ? Infinity : 0,
        repeatDelay: 3
      }}
      whileHover={{ scale: 1.1 }}
    >
      <Bell {...props} />
      {hasNotification && (
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

// Loading spinner
export const AnimatedSpinner = ({ className = '', ...props }: AnimatedIconProps) => {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <Settings {...props} />
    </motion.div>
  );
};

// Category icons with hover animations
export const CategoryIcon = ({ 
  icon: Icon, 
  className = '', 
  ...props 
}: { icon: React.ComponentType<LucideProps> } & LucideProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -5, 5, 0],
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Icon {...props} />
    </motion.div>
  );
};

// Chevron with bounce
export const AnimatedChevron = ({ 
  direction = 'right',
  className = '',
  ...props 
}: AnimatedIconProps & { direction?: 'left' | 'right' | 'up' | 'down' }) => {
  const ChevronIcon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <motion.div
      className={className}
      animate={{
        x: direction === 'left' ? [-3, 0] : direction === 'right' ? [0, 3] : 0,
        y: direction === 'up' ? [-3, 0] : direction === 'down' ? [0, 3] : 0,
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
    >
      <ChevronIcon {...props} />
    </motion.div>
  );
};

// Filter with shake on active
export const AnimatedFilter = ({ 
  isActive = false,
  className = '',
  ...props 
}: AnimatedIconProps & { isActive?: boolean }) => {
  return (
    <motion.div
      className={className}
      animate={isActive ? {
        rotate: [0, -5, 5, -5, 5, 0],
      } : {}}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Filter {...props} className={isActive ? 'text-emerald-600' : ''} />
    </motion.div>
  );
};

export {
  AnimatedIcon,
  Crown,
  MessageSquare,
  Image,
  Video,
  Mic,
  BarChart3,
  TrendingUp,
  Bot,
  Zap,
  Palette,
};
