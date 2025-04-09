'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

// Create a client component that uses useSearchParams
function WatchVideo() {
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get('v');
  const videoPrefix = 'https://storage.googleapis.com/huzzah-yt-processed-videos/';
  
  return (
    <>
      <h1>Watch Page</h1>
      {videoSrc && <video controls src={`${videoPrefix}${videoSrc}`} />}
    </>
  );
}

// Wrap the component that uses useSearchParams in Suspense
export default function WatchPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading video player...</div>}>
        <WatchVideo />
      </Suspense>
    </div>
  );
}