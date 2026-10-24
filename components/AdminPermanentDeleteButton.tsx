'use client';

import { useState } from 'react';
import { permanentDeleteAttractionAction } from '@/app/admin/actions';

interface AdminPermanentDeleteButtonProps {
  id: number;
  name: string;
  onSuccess?: () => void;
}

export default function AdminPermanentDeleteButton({
  id,
  name,
  onSuccess,
}: AdminPermanentDeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePermanentDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const res = await permanentDeleteAttractionAction(id);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to delete attraction.');
      } else {
        setShowConfirm(false);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="btn btn-sm btn-danger"
        title="Permanently erase from database"
        style={{
          padding: '0.35rem 0.65rem',
          fontSize: '0.8rem',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderColor: '#fca5a5',
        }}
      >
        Permanent Delete
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-title-${id}`}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#ffffff',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}
              >
                ⚠️
              </div>
              <h3
                id={`delete-title-${id}`}
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  margin: 0,
                }}
              >
                Permanent Deletion
              </h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete <strong>&ldquo;{name}&rdquo;</strong>?
            </p>

            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                color: '#92400e',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                marginBottom: '1.5rem',
              }}
            >
              <strong>Warning:</strong> This action <strong>cannot be undone</strong>. The attraction will be permanently erased from the database.
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                disabled={isDeleting}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
