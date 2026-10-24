'use client';

import { useFormStatus } from 'react-dom';
import { logoutAction } from '@/app/admin/actions';

function LogoutSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-sm btn-secondary"
    >
      {pending ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}

export default function AdminLogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutSubmit />
    </form>
  );
}
