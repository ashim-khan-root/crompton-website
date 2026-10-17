import { useState } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

interface NavbarProps {
  lang?: string;
}

export default function Navbar({ lang = 'en' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only the homepage is translated (known limitation); sub-pages fall back to /en/
  const navLinks = [
    { href: '/en/about', label: 'About Us', labelAr: 'من نحن' },
    { href: '/en/services', label: 'Services', labelAr: 'خدماتنا' },
    { href: '/en/industries', label: 'Industries', labelAr: 'القطاعات' },
    { href: '/en/workforce', label: 'Workforce', labelAr: 'الفئات' },
    { href: '/en/clients', label: 'Clients', labelAr: 'عملاؤنا' },
    { href: '/en/careers', label: 'Careers', labelAr: 'الوظائف' },
    { href: '/en/contact', label: 'Contact', labelAr: 'اتصل بنا' },
  ];

  const otherLang = lang === 'ar' ? 'en' : 'ar';
  const otherLangPath = lang === 'ar' ? '/en' : '/ar';

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={lang === 'ar' ? '/ar' : '/en'} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">C</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-primary-500 text-lg leading-tight">Crompton</p>
              <p className="text-xs text-gray-500">International</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors"
              >
                {lang === 'ar' ? link.labelAr : link.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <a
              href={otherLangPath}
              className="px-3 py-1.5 text-sm font-medium border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
            >
              {otherLang === 'ar' ? 'عربي' : 'EN'}
            </a>

            {/* Call Button */}
            <a
              href="tel:+97444681414"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              <Phone size={16} />
              <span className="hidden lg:inline">+974 4468 1414</span>
            </a>

            {/* CTA Button */}
            <a
              href="/en/contact"
              className="hidden md:inline-flex bg-secondary-400 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-secondary-500 transition-colors"
            >
              {lang === 'ar' ? 'طلب عمالة' : 'Request Manpower'}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full bg-white max-h-[calc(100vh-5rem)] overflow-y-auto lg:hidden shadow-xl">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'ar' ? link.labelAr : link.label}
              </a>
            ))}
            
            <div className="pt-4 border-t">
              <a
                href="tel:+97444681414"
                className="flex items-center gap-3 px-4 py-3 text-primary-500"
              >
                <Phone size={20} />
                <span>+974 4468 1414</span>
              </a>
              <a
                href="https://wa.me/97455019646"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-green-600"
              >
                <MessageCircle size={20} />
                <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
