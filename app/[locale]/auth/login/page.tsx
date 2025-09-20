'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await signIn('credentials', {
      email: String(form.get('email')),
      password: String(form.get('password')),
      redirect: false
    });
    if (res?.error) {
      setError(res.error);
    } else {
      window.location.href = `/${locale}/account`;
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-textdark">{locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-textdark/70">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-textdark/70">Password</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-2xl border border-brand-200 px-4 py-3 focus:border-brand-600 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-accent-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-600"
        >
          {locale === 'ar' ? 'دخول' : 'Sign in'}
        </button>
      </form>
      <div className="space-y-3">
        <button
          onClick={() => signIn('google')}
          className="w-full rounded-2xl border border-brand-200 px-4 py-3 text-sm font-semibold text-textdark hover:bg-brand-50"
        >
          Google
        </button>
        <button
          onClick={() => signIn('facebook')}
          className="w-full rounded-2xl border border-brand-200 px-4 py-3 text-sm font-semibold text-textdark hover:bg-brand-50"
        >
          Facebook
        </button>
      </div>
    </div>
  );
}
