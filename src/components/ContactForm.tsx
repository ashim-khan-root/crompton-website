import { useState } from 'react';

interface ContactFormProps {
  lang?: string;
  type?: 'contact' | 'manpower';
}

const WHATSAPP_NUMBER = '97455019646';

export default function ContactForm({ lang = 'en', type = 'contact' }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const isAr = lang === 'ar';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    let message = `${type === 'manpower' ? 'Manpower Request' : 'Enquiry'} — cromtongroup.com\n\n`;
    message += `Name: ${data.name}\n`;
    if (data.company) message += `Company: ${data.company}\n`;
    message += `Phone: ${data.phone}\n`;
    message += `Email: ${data.email}\n`;
    if (data.category) message += `Category: ${data.category}\n`;
    if (data.quantity) message += `Quantity: ${data.quantity}\n`;
    message += `\n${data.message}`;

    const opened = window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    // Only claim success if a window actually opened. Previously this said
    // "sent successfully" even when the visitor cancelled the popup.
    if (opened) {
      form.reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 8000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-2 block text-[0.85rem] font-medium text-ink">
            {isAr ? 'الاسم الكامل' : 'Full name'} <span className="text-secondary-600">*</span>
          </label>
          <input
            type="text"
            id="cf-name"
            name="name"
            required
            className="input-field"
            placeholder={isAr ? 'أدخل اسمك' : 'Your full name'}
          />
        </div>

        <div>
          <label htmlFor="cf-company" className="mb-2 block text-[0.85rem] font-medium text-ink">
            {isAr ? 'اسم الشركة' : 'Company'}
          </label>
          <input
            type="text"
            id="cf-company"
            name="company"
            className="input-field"
            placeholder={isAr ? 'اسم شركتك' : 'Your company'}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cf-phone" className="mb-2 block text-[0.85rem] font-medium text-ink">
            {isAr ? 'رقم الهاتف' : 'Phone'} <span className="text-secondary-600">*</span>
          </label>
          <input
            type="tel"
            id="cf-phone"
            name="phone"
            required
            className="input-field"
            placeholder="+974 XXXX XXXX"
          />
        </div>

        <div>
          <label htmlFor="cf-email" className="mb-2 block text-[0.85rem] font-medium text-ink">
            {isAr ? 'البريد الإلكتروني' : 'Email'} <span className="text-secondary-600">*</span>
          </label>
          <input
            type="email"
            id="cf-email"
            name="email"
            required
            className="input-field"
            placeholder={isAr ? 'بريدك الإلكتروني' : 'you@company.com'}
          />
        </div>
      </div>

      {type === 'manpower' && (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="cf-category" className="mb-2 block text-[0.85rem] font-medium text-ink">
              {isAr ? 'الفئة الوظيفية' : 'Category'} <span className="text-secondary-600">*</span>
            </label>
            <select id="cf-category" name="category" required className="input-field">
              <option value="">{isAr ? 'اختر الفئة' : 'Select a category'}</option>
              <optgroup label={isAr ? 'الكوادر البيضاء' : 'White collar'}>
                <option value="project-manager">{isAr ? 'مدير مشروع' : 'Project Manager'}</option>
                <option value="civil-engineer">{isAr ? 'مهندس مدني' : 'Civil Engineer'}</option>
                <option value="mechanical-engineer">{isAr ? 'مهندس ميكانيكا' : 'Mechanical Engineer'}</option>
                <option value="electrical-engineer">{isAr ? 'مهندس كهرباء' : 'Electrical Engineer'}</option>
                <option value="hse-engineer">{isAr ? 'مهندس صحة وسلامة' : 'HSE Engineer'}</option>
                <option value="qa-qc-engineer">{isAr ? 'مهندس جودة' : 'QA/QC Engineer'}</option>
              </optgroup>
              <optgroup label={isAr ? 'الكوادر الزرقاء' : 'Blue collar'}>
                <option value="electrician">{isAr ? 'كهربائي' : 'Electrician'}</option>
                <option value="plumber">{isAr ? 'سبّاك' : 'Plumber'}</option>
                <option value="welder">{isAr ? 'لحّام' : 'Welder'}</option>
                <option value="hvac-technician">{isAr ? 'فني تكييف' : 'HVAC Technician'}</option>
                <option value="carpenter">{isAr ? 'نجّار' : 'Carpenter'}</option>
                <option value="mason">{isAr ? 'بنّاء' : 'Mason'}</option>
                <option value="painter">{isAr ? 'صبّاغ' : 'Painter'}</option>
                <option value="helper">{isAr ? 'مساعد' : 'Helper'}</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label htmlFor="cf-quantity" className="mb-2 block text-[0.85rem] font-medium text-ink">
              {isAr ? 'العدد المطلوب' : 'Headcount'} <span className="text-secondary-600">*</span>
            </label>
            <input
              type="number"
              id="cf-quantity"
              name="quantity"
              min="1"
              required
              className="input-field"
              placeholder={isAr ? 'عدد العمال' : 'Number of workers'}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="cf-message" className="mb-2 block text-[0.85rem] font-medium text-ink">
          {isAr ? 'الرسالة' : 'Requirement'} <span className="text-secondary-600">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          className="input-field resize-none"
          placeholder={
            isAr
              ? 'صف احتياجك: المهن، العدد، الجدول الزمني'
              : 'Describe your requirement: trades, headcount, timeline'
          }
        ></textarea>
      </div>

      <button type="submit" className="btn-navy w-full">
        {isAr ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
      </button>

      <p className="text-[0.78rem] leading-relaxed text-ink-faint">
        {isAr
          ? 'سيتم فتح واتساب برسالة معدّة مسبقاً. اضغط إرسال هناك لإتمام التواصل.'
          : 'This opens WhatsApp with your details pre-filled. Press send there to reach our team.'}
      </p>

      {submitted && (
        <div
          role="status"
          className="border border-secondary-400/40 bg-secondary-50 p-4 text-center text-[0.88rem] font-medium text-secondary-700"
        >
          {isAr
            ? 'تم فتح واتساب — أكمل الإرسال من هناك.'
            : 'WhatsApp opened — complete the send there.'}
        </div>
      )}
    </form>
  );
}
