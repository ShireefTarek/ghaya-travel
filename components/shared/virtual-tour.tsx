'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false, loading: () => <div>Loading tour…</div> });

interface Props {
  url: string;
}

export default function VirtualTour({ url }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-brand-100">
      <Suspense fallback={<div className="p-8 text-center text-textdark/70">Loading tour…</div>}>
        <ReactPlayer url={url} width="100%" height="320px" controls light />
      </Suspense>
    </div>
  );
}
