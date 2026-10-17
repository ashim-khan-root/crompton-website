import { useState } from 'react';

interface ContactFormProps {
  lang?: string;
  type?: 'contact' | 'manpower';
}

export default function ContactForm({ lang = 'en', type = 'contact' }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    let message = `New ${type === 'manpower' ? 'Manpower Request' : 'Contact Form Submission'}:\n\n`;
    message += `Name: ${data.name}\n`;
    if (data.company) message += `Company: ${data.company}\n`;
    message += `Phone: ${data.phone}\n`;
    message += `Email: ${data.email}\n`;
    if (data.category) message += `Category: ${data.category}\n`;
    if (data.quantity) message += `Quantity: ${data.quantity}\n`;
    message += `Message: ${data.message}`;

    const whatsappUrl = `https://wa.me/97455019646?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    e.currentTarget.reset();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
            placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'ar' ? 'اسم الشركة' : 'Company Name'}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
            placeholder={lang === 'ar' ? 'اسم شركتك' : 'Your company name'}
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
            placeholder="+974 XXXX XXXX"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
            placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : 'your@email.com'}
          />
        </div>
      </div>
      
      {type === 'manpower' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'ar' ? 'الفئة الوظيفية' : 'Job Category'} *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
            >
              <option value="">{lang === 'ar' ? 'اختر الفئة' : 'Select category'}</option>
              <optgroup label={lang === 'ar' ? 'الكادرة البيضاء' : 'White Collar'}>
                <option value="project-manager">{lang === 'ar' ? 'مدير مشروع' : 'Project Manager'}</option>
                <option value="civil-engineer">{lang === 'ar' ? 'مهندس مدني' : 'Civil Engineer'}</option>
                <option value="mechanical-engineer">{lang === 'ar' ? 'مهندس ميكانيكا' : 'Mechanical Engineer'}</option>
                <option value="electrical-engineer">{lang === 'ar' ? 'مهندس كهرباء' : 'Electrical Engineer'}</option>
                <option value="hse-engineer">{lang === 'ar' ? 'مهندس صحة وسلامة' : 'HSE Engineer'}</option>
                <option value="qa-qc-engineer">{lang === 'ar' ? 'مهندس جودة' : 'QA/QC Engineer'}</option>
              </optgroup>
              <optgroup label={lang === 'ar' ? 'الكادرة الزرقاء' : 'Blue Collar'}>
                <option value="electrician">{lang === 'ar' ? 'كهربائي' : 'Electrician'}</option>
                <option value="plumber">{lang === 'ar' ? 'سبّاك' : 'Plumber'}</option>
                <option value="welder">{lang === 'ar' ? 'لحّام' : 'Welder'}</option>
                <option value="hvac-technician">{lang === 'ar' ? 'فني تكييف' : 'HVAC Technician'}</option>
                <option value="carpenter">{lang === 'ar' ? 'نجّار' : 'Carpenter'}</option>
                <option value="mason">{lang === 'ar' ? 'بنّاء' : 'Mason'}</option>
                <option value="painter">{lang === 'ar' ? 'صبّاغ' : 'Painter'}</option>
                <option value="helper">{lang === 'ar' ? 'مساعد' : 'Helper'}</option>
              </optgroup>
            </select>
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'ar' ? 'العدد المطلوب' : 'Quantity Required'} *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
              placeholder={lang === 'ar' ? 'عدد العمال' : 'Number of workers'}
            />
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          {lang === 'ar' ? 'الرسالة' : 'Message'} *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none resize-none"
          placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full bg-primary-500 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
      </button>
      
      {submitted && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center font-medium">
          {lang === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Your message has been sent successfully! We will contact you soon.'}
        </div>
      )}
    </form>
  );
}
