import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { useSkipLinks, useFocusManagement, useReducedMotion } from "@/hooks/usePerformance";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedAdmin from "./components/ProtectedAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce refetch on window focus for better performance
      refetchOnWindowFocus: false,
      // Cache for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep in cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const AppContent = () => {
  // Initialize accessibility features
  useSkipLinks();
  useFocusManagement();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Set reduced motion CSS custom property
    document.documentElement.style.setProperty(
      '--motion-reduce',
      prefersReducedMotion ? '0' : '1'
    );

    // Add performance optimization meta tags
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }

    // Add color scheme preference
    const colorScheme = document.createElement('meta');
    colorScheme.name = 'color-scheme';
    colorScheme.content = 'light dark';
    document.head.appendChild(colorScheme);

    // Preload critical fonts
    const preloadFont = (href: string, type: string = 'font/woff2') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'font';
      link.type = type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Add performance observer for monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Log performance metrics in development
          if (process.env.NODE_ENV === 'development') {
            console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
          }
          
          // Send to analytics in production
          if (process.env.NODE_ENV === 'production' && typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
              name: entry.name,
              value: Math.round(entry.duration)
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    // Add error boundary for JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript Error:', event.error);
      
      if (process.env.NODE_ENV === 'production' && typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: event.error?.message || 'Unknown error',
          fatal: false
        });
      }
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      if (process.env.NODE_ENV === 'production' && typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: event.reason?.message || 'Unhandled promise rejection',
          fatal: false
        });
      }
    });

    // Service Worker registration for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add critical CSS for above-the-fold content
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      .animate-fade-in {
        animation: fadeIn 0.6s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* Respect reduced motion preference */
      @media (prefers-reduced-motion: reduce) {
        .animate-fade-in,
        .animate-pulse,
        .animate-ping,
        .transition-all,
        .transition-transform,
        .transition-colors,
        .transition-opacity {
          animation: none !important;
          transition: none !important;
        }
      }
      
      /* Focus management */
      .focus-visible *:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
        border-radius: 2px;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .text-muted-foreground {
          color: hsl(var(--foreground)) !important;
        }
      }
      
      /* Loading skeleton */
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = criticalCSS;
    document.head.appendChild(styleSheet);

    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener('error', () => {});
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, [prefersReducedMotion]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ar-portfolio-theme">
        <AuthProvider>
          <TooltipProvider>
            <div role="application" aria-label="Ahmed Rehan Portfolio Website">
              <Toaster />
              <Sonner />
              <AppContent />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
