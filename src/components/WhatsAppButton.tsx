import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  lang?: string;
}

export default function WhatsAppButton({ lang = 'en' }: WhatsAppButtonProps) {
  const message = lang === 'ar'
    ? 'مرحباً، أنا مهتم بخدمات توريد العمالة من كرومبتون إنترناشونال'
    : 'Hello Crompton International, I am interested in your manpower services';

  const whatsappUrl = `https://wa.me/97455019646?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
