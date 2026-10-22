'use client';

import { logoutAction } from '@/app/admin/actions';

export default function AdminLogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="btn btn-sm btn-secondary">
        Sign Out 🚪
      </button>
    </form>
  );
}
