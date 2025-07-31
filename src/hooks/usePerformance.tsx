import { useEffect, useState, useCallback } from 'react';

// Performance monitoring hook
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    loading: true,
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    cls: 0, // Cumulative Layout Shift
    fid: 0, // First Input Delay
    ttfb: 0, // Time to First Byte
  });

  useEffect(() => {
    // Wait for the page to load
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;
          setMetrics(prev => ({ ...prev, ttfb }));
        }

        // Observe performance entries
        if ('PerformanceObserver' in window) {
          // First Contentful Paint
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
              }
            });
          });
          observer.observe({ entryTypes: ['paint'] });

          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            setMetrics(prev => ({ ...prev, cls: clsValue }));
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        setMetrics(prev => ({ ...prev, loading: false }));
      }
    };

    // Measure performance after load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  return metrics;
};

// Image lazy loading hook
export const useLazyLoading = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('IntersectionObserver' in window && 'loading' in HTMLImageElement.prototype);
  }, []);

  const lazyLoadImage = useCallback((img: HTMLImageElement, src: string) => {
    if (isSupported) {
      img.loading = 'lazy';
      img.src = src;
    } else {
      // Fallback for older browsers
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            target.src = src;
            observer.unobserve(target);
          }
        });
      });
      observer.observe(img);
    }
  }, [isSupported]);

  return { isSupported, lazyLoadImage };
};

// Prefetch resources hook
export const usePrefetch = () => {
  const prefetchResource = useCallback((href: string, as: string = 'fetch') => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
      });
    }
  }, []);

  const preloadResource = useCallback((href: string, as: string = 'fetch') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  return { prefetchResource, preloadResource };
};

// Accessibility focus management hook
export const useFocusManagement = () => {
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (focusVisible) {
      document.body.classList.add('focus-visible');
    } else {
      document.body.classList.remove('focus-visible');
    }
  }, [focusVisible]);

  return { focusVisible };
};

// Reduced motion preference hook
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Skip link hook for accessibility
export const useSkipLinks = () => {
  useEffect(() => {
    const skipLinks = [
      { href: '#main-content', text: 'Skip to main content' },
      { href: '#navigation', text: 'Skip to navigation' },
      { href: '#contact', text: 'Skip to contact' }
    ];

    // Create skip links container
    const skipContainer = document.createElement('div');
    skipContainer.className = 'skip-links';
    skipContainer.setAttribute('aria-label', 'Skip links');

    skipLinks.forEach(link => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.textContent = link.text;
      skipLink.className = 'skip-link';
      skipContainer.appendChild(skipLink);
    });

    document.body.insertBefore(skipContainer, document.body.firstChild);

    // Add CSS for skip links
    const styles = `
      .skip-links {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1001;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      .focus-visible *:focus {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }
      
      .focus-visible button:focus,
      .focus-visible a:focus,
      .focus-visible input:focus,
      .focus-visible textarea:focus,
      .focus-visible select:focus {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup
      const container = document.querySelector('.skip-links');
      const styleElement = document.querySelector('style');
      if (container) document.body.removeChild(container);
      if (styleElement) document.head.removeChild(styleElement);
    };
  }, []);
};

// Bundle size monitoring
export const useBundleAnalysis = () => {
  const [bundleInfo, setBundleInfo] = useState({
    size: 0,
    chunks: 0,
    loadTime: 0
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      let totalSize = 0;
      let chunks = 0;
      let maxLoadTime = 0;

      resources.forEach(resource => {
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          totalSize += resource.transferSize || 0;
          chunks++;
          const loadTime = resource.responseEnd - resource.requestStart;
          maxLoadTime = Math.max(maxLoadTime, loadTime);
        }
      });

      setBundleInfo({
        size: totalSize,
        chunks,
        loadTime: maxLoadTime
      });
    }
  }, []);

  return bundleInfo;
};

// Memory usage monitoring
export const useMemoryMonitoring = () => {
  const [memoryInfo, setMemoryInfo] = useState({
    used: 0,
    total: 0,
    limit: 0
  });

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Color contrast accessibility check
export const useColorContrast = () => {
  const checkContrast = useCallback((foreground: string, background: string) => {
    // Simplified contrast ratio calculation
    const getLuminance = (color: string) => {
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return {
      ratio,
      isAccessible: ratio >= 4.5, // WCAG AA standard
      isEnhanced: ratio >= 7 // WCAG AAA standard
    };
  }, []);

  return { checkContrast };
};
