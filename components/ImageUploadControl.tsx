'use client';

// components/ImageUploadControl.tsx
// Interactive Admin Image Upload, Preview, Replace, and Remove Control for Supabase Storage

import { useState, useRef, ChangeEvent } from 'react';
import { uploadAttractionImageAction, deleteDraftImageAction } from '@/app/admin/actions';
import {
  ATTRACTION_IMAGES_BUCKET,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/lib/storage';

interface ImageUploadControlProps {
  label: string;
  name: string; // 'image_url' | 'secondary_image_url'
  slot: 'main' | 'secondary';
  initialUrl?: string | null;
  attractionId?: number;
  helpText?: string;
}

export default function ImageUploadControl({
  label,
  name,
  slot,
  initialUrl,
  attractionId,
  helpText,
}: ImageUploadControlProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialUrl || null);
  const [newlyUploadedDraftUrl, setNewlyUploadedDraftUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    // 1. Client-Side Validation: MIME Type
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
      setErrorMsg('Invalid image format. Supported formats: JPG, PNG, WebP, AVIF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Client-Side Validation: Maximum 5MB File Size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMsg('File exceeds 5MB limit. Please choose an image smaller than 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 3. Upload to Supabase Storage via Server Action
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slot', slot);
      if (attractionId) {
        formData.append('attraction_id', String(attractionId));
      }

      const result = await uploadAttractionImageAction(formData);

      if (!result.success || !result.publicUrl) {
        setErrorMsg(result.error || 'Upload failed. Please try again.');
      } else {
        // If there was an uncommitted draft uploaded earlier in this session, clean it up
        if (newlyUploadedDraftUrl && newlyUploadedDraftUrl !== initialUrl) {
          deleteDraftImageAction(newlyUploadedDraftUrl).catch(() => {});
        }
        setImageUrl(result.publicUrl);
        setNewlyUploadedDraftUrl(result.publicUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    // If the image was uploaded in this unsaved session, remove it from storage immediately
    if (newlyUploadedDraftUrl && newlyUploadedDraftUrl !== initialUrl) {
      deleteDraftImageAction(newlyUploadedDraftUrl).catch(() => {});
      setNewlyUploadedDraftUrl(null);
    }
    setImageUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      {/* Hidden input to pass the final URL in the form submission */}
      <input type="hidden" name={name} value={imageUrl || ''} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_MIME_TYPES.join(',')}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Header & Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
            {label}
          </span>
          {helpText && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {helpText}
            </span>
          )}
        </div>
        <span
          className="badge"
          style={{
            backgroundColor: imageUrl ? 'var(--primary-subtle)' : 'var(--bg-surface)',
            color: imageUrl ? 'var(--primary)' : 'var(--text-muted)',
            border: '1px solid var(--border)',
            fontSize: '0.72rem',
          }}
        >
          {imageUrl ? 'Image Attached' : 'No Image'}
        </span>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            lineHeight: 1.4,
          }}
        >
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {/* Preview Area */}
      {imageUrl ? (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              position: 'relative',
              width: '180px',
              height: '115px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: '#1b4332',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <img
              src={imageUrl}
              alt={`${label} Preview`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {isUploading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                Uploading...
              </div>
            )}
          </div>

          {/* Action buttons when image exists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '180px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleTriggerSelect}
                disabled={isUploading}
                className="btn btn-secondary btn-sm"
              >
                {isUploading ? 'Uploading...' : '🔄 Replace Image'}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="btn btn-danger btn-sm"
              >
                🗑 Remove
              </button>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                wordBreak: 'break-all',
                maxWidth: '340px',
              }}
            >
              Stored in <code>{ATTRACTION_IMAGES_BUCKET}</code>
            </span>
          </div>
        </div>
      ) : (
        /* Empty State / Upload Trigger Area */
        <div
          onClick={isUploading ? undefined : handleTriggerSelect}
          style={{
            border: '2px dashed var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            backgroundColor: 'var(--bg-surface)',
            transition: 'border-color 0.15s ease, background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isUploading) {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'var(--primary-subtle)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
          }}
        >
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ fontSize: '1.5rem', animation: 'spin 1s linear infinite' }}>⏳</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                Uploading to Supabase Storage...
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.6rem' }}>📸</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Click to upload {label.toLowerCase()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                JPEG, PNG, WebP, or AVIF (Max 5MB)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
