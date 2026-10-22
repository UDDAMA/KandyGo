'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '380px',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
      }}
    >
      🗺️ Loading interactive map...
    </div>
  ),
});

interface AttractionMapWrapperProps {
  latitude: number;
  longitude: number;
  name: string;
  categoryName?: string;
  height?: string;
}

export default function AttractionMapWrapper(props: AttractionMapWrapperProps) {
  return <MapView {...props} />;
}
