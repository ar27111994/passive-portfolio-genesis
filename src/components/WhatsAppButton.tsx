
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WhatsAppButton() {
  const phoneNumber = "+919038582781"; // Based on resume info
  const message = "Hi! I found your portfolio and would like to discuss a project opportunity.";
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg z-50"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Contact via WhatsApp</span>
    </Button>
  );
}
