'use client';

import { useState } from 'react';
import { deleteAttractionAction } from '@/app/admin/actions';

interface AdminDeleteButtonProps {
  id: number;
  name: string;
}

export default function AdminDeleteButton({ id, name }: AdminDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${name}" from the database?`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await deleteAttractionAction(id);
      if (!res.success) {
        alert(`Error deleting attraction: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-sm btn-danger"
      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
