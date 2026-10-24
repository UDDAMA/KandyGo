'use client';

import { useState } from 'react';
import { deleteAttractionAction } from '@/app/admin/actions';

interface AdminDeleteButtonProps {
  id: number;
  name: string;
  onSuccess?: () => void;
}

export default function AdminDeleteButton({ id, name, onSuccess }: AdminDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Move "${name}" to the Recycle Bin?\n\nIt will be hidden from public view and can be restored at any time.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await deleteAttractionAction(id);
      if (!res.success) {
        alert(`Error moving to Recycle Bin: ${res.error}`);
      } else {
        if (onSuccess) onSuccess();
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
      title="Move attraction to Recycle Bin"
      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
    >
      {isDeleting ? 'Moving...' : 'Delete'}
    </button>
  );
}
