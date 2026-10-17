import { useState } from 'react';
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react';

interface NavbarProps {
  lang?: string;
}

export default function Navbar({ lang = 'en' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only the homepage is translated (known limitation); sub-pages fall back to /en/
  const navLinks = [
    { href: '/en/about', label: 'About', labelAr: 'من نحن' },
    { href: '/en/services', label: 'Services', labelAr: 'خدماتنا' },
    { href: '/en/industries', label: 'Industries', labelAr: 'القطاعات' },
    { href: '/en/workforce', label: 'Workforce', labelAr: 'الفئات' },
    { href: '/en/clients', label: 'Clients', labelAr: 'عملاؤنا' },
    { href: '/en/careers', label: 'Careers', labelAr: 'الوظائف' },
  ];

  const otherLang = lang === 'ar' ? 'en' : 'ar';
  const otherLangPath = lang === 'ar' ? '/en' : '/ar';
  const homePath = lang === 'ar' ? '/ar' : '/en';

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility strip — the corporate signal. Contact + language live here so
          the main bar stays uncrowded. */}
      <div className="bg-primary-900 text-white/70">
        <div className="container-custom flex h-9 items-center justify-between px-5 text-[0.76rem] md:px-8 lg:px-10">
          <div className="flex items-center gap-5">
            <a
              href="tel:+97444681414"
              className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-white"
            >
              <Phone size={13} aria-hidden="true" />
              <span className="tnum">+974 4468 1414</span>
            </a>
            <a
              href="mailto:info@crompton-intl.com"
              className="hidden items-center gap-1.5 transition-colors duration-150 hover:text-white sm:inline-flex"
            >
              <Mail size={13} aria-hidden="true" />
              info@crompton-intl.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-white/40 md:inline">
              {lang === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar'}
            </span>
            <a
              href={otherLangPath}
              className="inline-flex items-center gap-1.5 font-medium text-white/85 transition-colors duration-150 hover:text-white"
              aria-label={`Switch to ${otherLang === 'ar' ? 'Arabic' : 'English'}`}
            >
              <span aria-hidden="true">◐</span>
              {otherLang === 'ar' ? 'عربي' : 'English'}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-rule bg-paper/95 backdrop-blur-sm">
        <nav
          className="container-custom flex h-[4.5rem] items-center justify-between gap-6 px-5 md:px-8 lg:px-10"
          aria-label="Primary"
        >
          {/* Wordmark — visible at every width */}
          <a href={homePath} className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center bg-primary-500 font-heading text-lg font-bold text-white">
              C
            </span>
            <span className="leading-none">
              <span className="block font-heading text-[1.05rem] font-bold tracking-tight text-primary-500">
                CROMPTON
              </span>
              <span className="mt-0.5 block text-[0.62rem] uppercase tracking-[0.22em] text-ink-faint">
                International
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-x-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap border-b-2 border-transparent py-1 text-[0.86rem] font-medium text-ink-muted transition-colors duration-150 hover:border-secondary-400 hover:text-primary-500"
              >
                {lang === 'ar' ? link.labelAr : link.label}
              </a>
            ))}
          </div>

          {/* Action */}
          <div className="flex items-center gap-3">
            <a
              href="/en/contact"
              className="btn-navy hidden !px-5 !py-2.5 !text-[0.84rem] md:inline-flex"
            >
              {lang === 'ar' ? 'طلب عمالة' : 'Request Manpower'}
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="-mr-2 p-2 text-primary-500 lg:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100vh-6.75rem)] overflow-y-auto border-b border-rule bg-paper shadow-xl lg:hidden">
          <div className="container-custom px-5 py-2 md:px-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-rule py-4 text-[0.95rem] font-medium text-ink transition-colors duration-150 hover:text-primary-500"
              >
                {lang === 'ar' ? link.labelAr : link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 py-5 sm:flex-row">
              <a href="/en/contact" className="btn-navy w-full sm:w-auto">
                {lang === 'ar' ? 'طلب عمالة' : 'Request Manpower'}
              </a>
              <a
                href="https://wa.me/97455019646"
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-rule text-ink hover:border-primary-500 w-full sm:w-auto"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
