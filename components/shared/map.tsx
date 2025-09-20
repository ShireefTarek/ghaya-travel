'use client';

interface MapProps {
  destinations: { name: string; lat: number | null; lng: number | null }[];
  apiKey?: string;
}

export default function Map({ destinations, apiKey }: MapProps) {
  if (!destinations.length) return null;

  const first = destinations.find((d) => d.lat && d.lng) || destinations[0];
  const center = `${first.lat},${first.lng}`;
  const markers = destinations
    .filter((d) => d.lat && d.lng)
    .map((d) => `${d.lat},${d.lng}`)
    .join('|');

  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(destinations[0].name)}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(destinations[0].name)}&output=embed`;

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-100">
      <iframe
        title="Destination map"
        src={src}
        width="100%"
        height="320"
        className="w-full"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
