import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

interface FooterProps {
  lang?: string;
}

export default function Footer({ lang = 'en' }: FooterProps) {
  // Only the homepage is translated (known limitation); sub-pages fall back to /en/
  const companyLinks = [
    { href: '/en/about', label: 'About', labelAr: 'من نحن' },
    { href: '/en/industries', label: 'Industries', labelAr: 'القطاعات' },
    { href: '/en/workforce', label: 'Workforce', labelAr: 'الفئات' },
    { href: '/en/clients', label: 'Clients', labelAr: 'عملاؤنا' },
    { href: '/en/careers', label: 'Careers', labelAr: 'الوظائف' },
    { href: '/en/hse', label: 'HSE', labelAr: 'الصحة والسلامة' },
  ];

  const serviceLinks = [
    { href: '/en/services#white-collar', label: 'White Collar Staffing', labelAr: 'الكادرة البيضاء' },
    { href: '/en/services#blue-collar', label: 'Blue Collar Manpower', labelAr: 'الكادرة الزرقاء' },
    { href: '/en/services#project-based', label: 'Project-Based Workforce', labelAr: 'حلول مشاريع' },
    { href: '/en/services#recruitment', label: 'Recruitment & Mobilization', labelAr: 'التوظيف والتعبئة' },
    { href: '/en/services#outsourcing', label: 'Outsourcing Solutions', labelAr: 'توظيف خارجي' },
    { href: '/en/services#payroll', label: 'Payroll Support', labelAr: 'رواتب' },
  ];

  const isAr = lang === 'ar';

  return (
    <footer className="relative overflow-hidden bg-primary-900 text-white">
      <div className="grain absolute inset-0 grid-tex opacity-60" aria-hidden="true" />

      <div className="container-custom relative px-5 md:px-8 lg:px-10">
        {/* Closing statement */}
        <div className="grid gap-10 border-b border-white/12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-7">
            <h2 className="max-w-[24ch] font-heading text-3xl font-bold leading-[1.15] text-white md:text-[2.6rem]">
              {isAr
                ? 'قوة عمل موثوقة لمشاريع قطر.'
                : 'Dependable manpower for projects across Qatar.'}
            </h2>
            <p className="mt-5 max-w-measure text-[0.95rem] leading-relaxed text-white/60">
              {isAr
                ? 'توريد عمالة ماهرة وشبه ماهرة ومدربة لمشاريع البناء والهندسة والصناعة في جميع أنحاء قطر.'
                : 'Supplying screened, safety-trained white collar and blue collar workforce to construction, engineering and industrial projects across Qatar.'}
            </p>
          </div>
          <div className="flex items-start lg:col-span-5 lg:justify-end">
            <a href="/en/contact" className="btn-gold">
              {isAr ? 'طلب عمالة' : 'Request Manpower'}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Contact + navigation */}
        <div className="grid gap-10 border-b border-white/12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h3 className="font-heading text-[0.72rem] uppercase tracking-[0.2em] text-secondary-400">
              {isAr ? 'تواصل معنا' : 'Reach us'}
            </h3>
            <ul className="mt-6 space-y-4 text-[0.9rem]">
              <li>
                <a
                  href="tel:+97444681414"
                  className="group inline-flex items-start gap-3 text-white/70 transition-colors duration-150 hover:text-white"
                >
                  <Phone size={17} className="mt-0.5 shrink-0 text-secondary-400" aria-hidden="true" />
                  <span className="tnum">+974 4468 1414</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/97455019646"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-3 text-white/70 transition-colors duration-150 hover:text-white"
                >
                  <MessageCircle size={17} className="mt-0.5 shrink-0 text-secondary-400" aria-hidden="true" />
                  <span className="tnum">+974 5501 9646</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@crompton-intl.com"
                  className="group inline-flex items-start gap-3 text-white/70 transition-colors duration-150 hover:text-white"
                >
                  <Mail size={17} className="mt-0.5 shrink-0 text-secondary-400" aria-hidden="true" />
                  <span>info@crompton-intl.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={17} className="mt-0.5 shrink-0 text-secondary-400" aria-hidden="true" />
                <span className="max-w-[30ch] leading-relaxed">
                  {isAr
                    ? 'ص.ب 37491، مباني بنك الكويت الوطني – المسيرة، الطابق الرابع، مكتب 405 و406، الدوحة، قطر'
                    : 'P.O. Box 37491, NBK-Msheireb Buildings, 4th Floor, Office 405 & 406, Doha, Qatar'}
                </span>
              </li>
            </ul>
          </div>

          <nav className="lg:col-span-3" aria-label="Company">
            <h3 className="font-heading text-[0.72rem] uppercase tracking-[0.2em] text-secondary-400">
              {isAr ? 'الشركة' : 'Company'}
            </h3>
            <ul className="mt-6 space-y-3 text-[0.9rem]">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 transition-colors duration-150 hover:text-white"
                  >
                    {isAr ? link.labelAr : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-4" aria-label="Services">
            <h3 className="font-heading text-[0.72rem] uppercase tracking-[0.2em] text-secondary-400">
              {isAr ? 'الخدمات' : 'Services'}
            </h3>
            <ul className="mt-6 space-y-3 text-[0.9rem]">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 transition-colors duration-150 hover:text-white"
                  >
                    {isAr ? link.labelAr : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 py-7 text-[0.78rem] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Crompton International Trading &amp; Contracting &amp;
            Services W.L.L.
          </p>
          <p className="md:text-right">
            {isAr ? 'مسجلة في دولة قطر' : 'Registered in the State of Qatar'}
          </p>
        </div>
      </div>
    </footer>
  );
}
