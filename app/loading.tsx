// app/loading.tsx
// App Router global streaming loading state featuring walking elephant

import ElephantLoader from '@/components/ElephantLoader';

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          padding: '2.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <ElephantLoader size="lg" label="Exploring Kandy…" />
      </div>
    </div>
  );
}
