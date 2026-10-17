import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

interface FooterProps {
  lang?: string;
}

export default function Footer({ lang = 'en' }: FooterProps) {
  // Only the homepage is translated (known limitation); sub-pages fall back to /en/
  const quickLinks = [
    { href: '/en/about', label: 'About Us', labelAr: 'من نحن' },
    { href: '/en/services', label: 'Services', labelAr: 'خدماتنا' },
    { href: '/en/industries', label: 'Industries', labelAr: 'القطاعات' },
    { href: '/en/workforce', label: 'Workforce', labelAr: 'الفئات' },
    { href: '/en/clients', label: 'Clients', labelAr: 'عملاؤنا' },
    { href: '/en/careers', label: 'Careers', labelAr: 'الوظائف' },
  ];

  const serviceLinks = [
    { href: '/en/services#white-collar', label: 'White Collar', labelAr: 'الكادرة البيضاء' },
    { href: '/en/services#blue-collar', label: 'Blue Collar', labelAr: 'الكادرة الزرقاء' },
    { href: '/en/services#project-based', label: 'Project-Based', labelAr: 'مشاريع' },
    { href: '/en/services#recruitment', label: 'Recruitment', labelAr: 'توظيف' },
    { href: '/en/services#outsourcing', label: 'Outsourcing', labelAr: 'توظيف خارجي' },
    { href: '/en/services#payroll', label: 'Payroll', labelAr: 'رواتب' },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-500 font-heading font-bold text-xl">C</span>
              </div>
              <div>
                <p className="font-heading font-bold text-lg leading-tight">Crompton</p>
                <p className="text-sm text-gray-400">International</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {lang === 'ar'
                ? 'شريك موثوق في توريد العمالة في قطر، نوفر محترفين من الكادرة البيضاء والزرقاء لقطاعات البناء والهندسة والصناعة.'
                : 'Trusted manpower supply company in Qatar, providing skilled white collar and blue collar professionals to construction, engineering, and industrial sectors.'}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                <span className="font-bold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
                <span className="font-bold">𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="LinkedIn">
                <span className="font-bold">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <span className="font-bold">ig</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {lang === 'ar' ? link.labelAr : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">
              {lang === 'ar' ? 'خدماتنا' : 'Services'}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {lang === 'ar' ? link.labelAr : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">
              {lang === 'ar' ? 'معلومات الاتصال' : 'Contact Info'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  {lang === 'ar'
                    ? 'ص.ب: 37491، مباني بنك الكويت الوطني المسيرة، الطابق الرابع، مكتب رقم 405 و 406، الدوحة، قطر'
                    : 'P.O. Box: 37491, NBK-Msheireb Buildings, 4th Floor, Office #405 & 406, Doha, Qatar'}
                </span>
              </li>
              <li>
                <a href="tel:+97444681414" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={18} className="text-secondary-400" />
                  <span className="text-sm">+974 4468 1414</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/97455019646" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <MessageCircle size={18} className="text-green-500" />
                  <span className="text-sm">+974 5501 9646</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@crompton-intl.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail size={18} className="text-secondary-400" />
                  <span className="text-sm">info@crompton-intl.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Crompton International Trading & Contracting & Services W.L.L. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
