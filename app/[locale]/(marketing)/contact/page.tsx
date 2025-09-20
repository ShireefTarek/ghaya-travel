'use client';

import { useState } from 'react';
import { contactFormSchema } from '@/lib/validators/contact';

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name')),
      email: String(form.get('email')),
      phone: String(form.get('phone')),
      message: String(form.get('message'))
    };
    const parsed = contactFormSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(locale === 'ar' ? 'يرجى التأكد من صحة الحقول.' : 'Please check the form fields.');
      return;
    }
    setStatus('loading');
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(parsed.data)
    });
    if (!res.ok) {
      setStatus('error');
      setErrors(locale === 'ar' ? 'تعذر إرسال الرسالة.' : 'Unable to send message.');
      return;
    }
    setStatus('success');
    setErrors(null);
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">{locale === 'ar' ? 'اتصل بنا' : 'Contact Ghaya Travel'}</h1>
        <p className="mt-2 text-sm text-textdark/70">
          {locale === 'ar'
            ? 'يسر فريق خبراء السفر مساعدتك في التخطيط لرحلتك القادمة أو الاستفسار عن العمرة والحج.'
            : 'Our travel experts are ready to craft your next journey or assist with Hajj & Umrah inquiries.'}
        </p>
        <div className="mt-6 space-y-2 text-sm text-textdark/80">
          <p>☎️ +20 100 000 0000</p>
          <p>✉️ hello@ghayatravel.com</p>
          <p>{locale === 'ar' ? 'العنوان: القاهرة الجديدة - التجمع الخامس' : 'Address: New Cairo, Fifth Settlement'}</p>
        </div>
      </section>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-3xl border border-brand-100 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'الاسم الكامل' : 'Full name'}</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
          <input
            name="phone"
            required
            className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'رسالتك' : 'Message'}</label>
          <textarea
            name="message"
            required
            rows={4}
            className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3 focus:border-brand-600 focus:outline-none"
          />
        </div>
        {errors && <p className="text-sm text-accent-700">{errors}</p>}
        {status === 'success' && (
          <p className="text-sm text-brand-700">
            {locale === 'ar' ? 'تم إرسال الرسالة بنجاح.' : 'Message sent successfully.'}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-600"
          disabled={status === 'loading'}
        >
          {status === 'loading'
            ? locale === 'ar'
              ? 'جارٍ الإرسال...'
              : 'Sending…'
            : locale === 'ar'
            ? 'أرسل الرسالة'
            : 'Send message'}
        </button>
      </form>
    </div>
  );
}
