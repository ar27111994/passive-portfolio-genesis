import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function WhatsAppButton() {
  const phoneNumber = "+923315887235"; // Ahmed's contact number from resume
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  // Show tooltip after 3 seconds on first visit
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('whatsapp-tooltip-seen');
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setIsTooltipVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-hide tooltip after 8 seconds
  useEffect(() => {
    if (isTooltipVisible) {
      const timer = setTimeout(() => {
        setIsTooltipVisible(false);
        localStorage.setItem('whatsapp-tooltip-seen', 'true');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isTooltipVisible]);

  const handleWhatsAppClick = () => {
    const message = "Hi Ahmed! I found your portfolio and would like to discuss a project opportunity. I'm interested in your expertise in Angular/TypeScript development.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    
    // Track engagement
    if (typeof gtag !== 'undefined') {
      gtag('event', 'contact', {
        event_category: 'engagement',
        event_label: 'whatsapp_click',
        value: 1
      });
    }
    
    window.open(whatsappUrl, '_blank');
    setIsTooltipVisible(false);
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);
    localStorage.setItem('whatsapp-tooltip-seen', 'true');
  };

  // Determine if it's business hours in Pakistan (PKT = UTC+5)
  const isBusinessHours = () => {
    const now = new Date();
    const pakistanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Karachi"}));
    const hour = pakistanTime.getHours();
    const day = pakistanTime.getDay();
    
    // Business hours: Monday-Friday 9AM-6PM, Saturday 9AM-2PM
    if (day === 0) return false; // Sunday
    if (day === 6) return hour >= 9 && hour < 14; // Saturday 9AM-2PM
    return hour >= 9 && hour < 18; // Weekdays 9AM-6PM
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip Card */}
      {isTooltipVisible && (
        <Card className="absolute bottom-16 right-0 w-64 mb-2 shadow-xl border-green-200 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  {isBusinessHours() ? 'Available now' : 'Available soon'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={hideTooltip}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <h4 className="font-semibold text-sm mb-2">Chat with Ahmed</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Discuss your Angular/TypeScript project or technical consulting needs
            </p>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Response time:</span>
                <span className="font-medium">~2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Located in:</span>
                <span className="font-medium">Rawalpindi, PK</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => !isTooltipVisible && setIsTooltipVisible(true)}
        onMouseLeave={() => {
          if (!localStorage.getItem('whatsapp-tooltip-seen')) {
            setTimeout(() => setIsTooltipVisible(false), 2000);
          }
        }}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative"
        size="icon"
        aria-label="Contact Ahmed Rehan via WhatsApp"
      >
        {/* Online indicator */}
        {isOnline && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        )}
        
        {/* WhatsApp icon with animation */}
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
      </Button>

      {/* Business hours indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className={`px-2 py-1 text-xs rounded-full text-white shadow-md ${
          isBusinessHours() 
            ? 'bg-green-500' 
            : 'bg-gray-500'
        }`}>
          {isBusinessHours() ? 'Online' : 'Offline'}
        </div>
      </div>
    </div>
  );
}

// Add custom CSS for animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
