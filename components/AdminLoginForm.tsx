'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/admin/actions';

const initialState = {
  success: true,
  error: '',
};

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {state?.error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          <strong>Error:</strong> {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.4rem',
            color: 'var(--text-main)',
          }}
        >
          Administrator Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@example.com"
          className="input"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.4rem',
            color: 'var(--text-main)',
          }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="input"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
      >
        {isPending ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
      </button>
    </form>
  );
}
