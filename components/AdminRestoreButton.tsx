'use client';

import { useState } from 'react';
import { restoreAttractionAction } from '@/app/admin/actions';

interface AdminRestoreButtonProps {
  id: number;
  name: string;
  onSuccess?: () => void;
}

export default function AdminRestoreButton({ id, name, onSuccess }: AdminRestoreButtonProps) {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const res = await restoreAttractionAction(id);
      if (!res.success) {
        alert(`Error restoring attraction: ${res.error}`);
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <button
      onClick={handleRestore}
      disabled={isRestoring}
      className="btn btn-sm btn-secondary"
      title={`Restore "${name}" to active attractions`}
      style={{
        padding: '0.35rem 0.65rem',
        fontSize: '0.8rem',
        color: 'var(--primary)',
        borderColor: 'rgba(27, 67, 50, 0.3)',
      }}
    >
      {isRestoring ? 'Restoring...' : '↺ Restore'}
    </button>
  );
}
