import clients from '../data/clients.json';

interface ClientCarouselProps {
  lang?: string;
}

export default function ClientCarousel({ lang = 'en' }: ClientCarouselProps) {
  if (clients.length === 0) return null;
  const duplicatedClients = [...clients, ...clients];

  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-8 animate-scroll">
        {duplicatedClients.map((client, index) => (
          <div
            key={`${client.name}-${index}`}
            className="flex-shrink-0 w-48 h-24 bg-gray-100 rounded-lg flex items-center justify-center p-4"
          >
            <div className="text-center">
              <p className="font-heading font-semibold text-gray-700">{client.name}</p>
              <p className="text-xs text-gray-500">{client.industry}</p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
