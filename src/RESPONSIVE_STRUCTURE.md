# 📱 Responsive Structure Guide

## Device-Specific Layouts

### Mobile Layout (< 768px)

```
┌─────────────────────┐
│     Header          │ ← Fixed top (h-16)
│  [Logo] [Search] 🔔│
├─────────────────────┤
│                     │
│   Main Content      │
│   (Full Width)      │
│                     │
│  ┌───────────────┐  │
│  │ Featured      │  │
│  │ Banner        │  │
│  └───────────────┘  │
│                     │
│  ┌─────────────┐    │
│  │  Category   │    │
│  └─────────────┘    │
│  ┌─────────────┐    │
│  │  Category   │    │
│  └─────────────┘    │
│                     │
│  ┌───────────────┐  │
│  │  Tool Card    │  │
│  │  Full Width   │  │
│  └───────────────┘  │
│                     │
│         ⋮           │
│                     │
│      (FAB) +        │ ← Floating button
├─────────────────────┤
│ [🏠] [👑] [📁] [💾] │ ← Bottom nav (h-16)
└─────────────────────┘
```

**CSS Implementation:**
```css
/* Mobile Container */
.mobile-container {
  padding: 0 1rem;
  padding-bottom: 5rem; /* Space for bottom nav */
}

/* Mobile Grid */
.mobile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Mobile Card */
.mobile-card {
  width: 100%;
  padding: 1rem;
}
```

**React Component:**
```tsx
{/* Mobile View */}
<div className="lg:hidden">
  <Header compact />
  <main className="px-4 pb-20">
    <FeaturedBanner />
    <CategorySection columns={1} />
    <ToolsSection layout="list" />
  </main>
  <MobileBottomNav />
  <FloatingActionButton />
</div>
```

---

### Tablet Layout (768px - 1024px)

```
┌──────────────────────────────┐
│         Header               │ ← Fixed (h-16)
│  [Logo]  [Search Bar]  [🔔]  │
├──────────────────────────────┤
│ For you | Charts | Premium   │ ← Desktop tabs
├──────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │  Featured Banner     │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────┐  ┌──────┐         │
│  │ Cat  │  │ Cat  │         │
│  └──────┘  └──────┘         │
│  ┌──────┐  ┌──────┐         │
│  │ Cat  │  │ Cat  │         │
│  └──────┘  └──────┘         │
│                              │
│  ┌──────┐  ┌──────┐         │
│  │ Tool │  │ Tool │         │
│  │ Card │  │ Card │         │
│  └──────┘  └──────┘         │
│                              │
│         ⋮                    │
└──────────────────────────────┘
```

**CSS Implementation:**
```css
/* Tablet Container */
@media (min-width: 768px) {
  .tablet-container {
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* 2 Column Grid */
  .tablet-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  /* 3 Column for Categories */
  .tablet-category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**React Component:**
```tsx
{/* Tablet View */}
<div className="hidden md:block lg:hidden">
  <Header />
  <NavigationTabs />
  <main className="max-w-4xl mx-auto px-6">
    <FeaturedBanner />
    <CategorySection columns={3} />
    <ToolsSection 
      layout="grid" 
      columns={2}
    />
  </main>
</div>
```

---

### Desktop Layout (> 1024px)

```
┌────────────────────────────────────────┐
│            Header                       │
│  [Logo]  [Search Bar]  [🔔] [Profile]  │
├────────────────────────────────────────┤
│ For you | Charts | Categories | Premium│
├────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Featured Banner (Wide)        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │Cat │ │Cat │ │Cat │ │Cat │ │Cat │  │
│  └────┘ └────┘ └────┘ └────┘ └────┘  │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │Tool │ │Tool │ │Tool │ │Tool │     │
│  │Card │ │Card │ │Card │ │Card │     │
│  └─────┘ └─────┘ └─────┘ └─────┘     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │Tool │ │Tool │ │Tool │ │Tool │     │
│  │Card │ │Card │ │Card │ │Card │     │
│  └─────┘ └─────┘ └─────┘ └─────┘     │
│                                         │
│              ⋮                          │
└────────────────────────────────────────┘
```

**CSS Implementation:**
```css
/* Desktop Container */
@media (min-width: 1024px) {
  .desktop-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* 4 Column Grid */
  .desktop-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  /* 5 Column for Categories */
  .desktop-category-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

**React Component:**
```tsx
{/* Desktop View */}
<div className="hidden lg:block">
  <Header />
  <NavigationTabs />
  <main className="max-w-7xl mx-auto px-8">
    <FeaturedBanner />
    <CategorySection columns={5} />
    <ToolsSection 
      layout="grid" 
      columns={4}
    />
  </main>
</div>
```

---

## Responsive Component Examples

### 1. Responsive Header

```tsx
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
        {/* Logo - Always visible */}
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="hidden md:inline">AI Tools</span>
        </div>

        {/* Search - Responsive width */}
        <div className="flex-1 max-w-xl mx-4">
          <SearchBar 
            className="w-full"
            placeholder={
              window.innerWidth < 768 
                ? "Search..." 
                : "Search AI tools..."
            }
          />
        </div>

        {/* Actions - Hide on mobile */}
        <div className="flex items-center gap-2">
          <NotificationBell className="h-6 w-6" />
          <UserMenu className="hidden md:block" />
        </div>
      </div>
    </header>
  );
}
```

### 2. Responsive Grid

```tsx
export function ToolsGrid({ tools }: { tools: AITool[] }) {
  return (
    <div className={cn(
      "grid gap-4",
      "grid-cols-1",           // Mobile: 1 column
      "md:grid-cols-2",        // Tablet: 2 columns
      "lg:grid-cols-3",        // Desktop: 3 columns
      "xl:grid-cols-4"         // Large: 4 columns
    )}>
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
```

### 3. Responsive Dialog

```tsx
export function ToolDetailDialog({ tool, open, onOpenChange }) {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Use Drawer for mobile
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <ToolDetails tool={tool} />
        </DrawerContent>
      </Drawer>
    );
  }

  // Use Dialog for desktop
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <ToolDetails tool={tool} />
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Responsive Premium Section

```tsx
export function PremiumSection() {
  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div className={cn(
        "text-center p-6 rounded-2xl",
        "md:p-8",
        "lg:p-12"
      )}>
        <AnimatedCrown className="mx-auto h-12 w-12 md:h-16 md:w-16" />
        <h2 className="mt-4">Premium Prompts</h2>
        <p className="text-muted-foreground mt-2">
          Professional prompts for your AI workflows
        </p>
      </div>

      {/* Prompt Categories */}
      {promptCategories.map(category => (
        <div key={category.id}>
          <h3 className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            {category.name}
          </h3>
          
          <div className={cn(
            "grid gap-4",
            "grid-cols-1",        // Mobile
            "md:grid-cols-2",     // Tablet
            "lg:grid-cols-3"      // Desktop
          )}>
            {category.prompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Touch vs Mouse Interactions

### Mobile Touch Events

```tsx
export function ToolCard({ tool }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={cn(
        "card-interactive",
        isPressed && "scale-95"
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
    >
      {/* Card content */}
    </div>
  );
}
```

### Desktop Hover Effects

```tsx
export function ToolCard({ tool }) {
  return (
    <div className={cn(
      "transition-all duration-200",
      "hover:lg:shadow-xl hover:lg:-translate-y-2",
      // No hover on mobile
      "active:scale-95 md:active:scale-100"
    )}>
      {/* Card content */}
    </div>
  );
}
```

---

## Performance Considerations

### Lazy Loading

```tsx
// Load components only when needed
const ToolDetailDialog = lazy(() => 
  import('./components/ToolDetailDialog')
);

// Use suspense
<Suspense fallback={<Skeleton />}>
  <ToolDetailDialog />
</Suspense>
```

### Virtual Scrolling (1000+ items)

```tsx
import { FixedSizeList } from 'react-window';

export function VirtualToolList({ tools }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={tools.length}
      itemSize={200}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ToolCard tool={tools[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Image Optimization

```tsx
// Progressive loading
<img
  src={tool.icon}
  loading="lazy"
  decoding="async"
  alt={tool.name}
  className="w-full h-auto"
/>
```

---

## Accessibility

### Skip Links

```tsx
<a 
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>
```

### Focus Management

```tsx
useEffect(() => {
  if (dialogOpen) {
    // Trap focus in dialog
    const focusableElements = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements?.[0]?.focus();
  }
}, [dialogOpen]);
```

---

## Testing Responsive Design

### Manual Testing Breakpoints

```tsx
// Create a debug component
export function BreakpointIndicator() {
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white px-2 py-1 text-xs rounded">
      <span className="sm:hidden">XS</span>
      <span className="hidden sm:inline md:hidden">SM</span>
      <span className="hidden md:inline lg:hidden">MD</span>
      <span className="hidden lg:inline xl:hidden">LG</span>
      <span className="hidden xl:inline">XL</span>
    </div>
  );
}
```

### Responsive Hooks

```tsx
import { useMediaQuery } from './hooks/useMediaQuery';

export function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isMobile) return <MobileView />;
  if (isTablet) return <TabletView />;
  return <DesktopView />;
}
```

---

## Summary

✅ **Mobile First** - Design for mobile, enhance for larger screens
✅ **Breakpoints** - Mobile (< 768), Tablet (768-1024), Desktop (> 1024)
✅ **Touch-Friendly** - Minimum 44px touch targets
✅ **Performance** - Lazy loading, virtual scrolling, optimized images
✅ **Accessibility** - Keyboard navigation, ARIA labels, focus management

**Your app is now fully responsive! 🎉**
