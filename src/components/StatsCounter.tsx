import { useEffect, useRef } from 'react';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  labelAr: string;
}

interface StatsCounterProps {
  stats: Stat[];
  lang?: string;
}

export default function StatsCounter({ stats, lang = 'en' }: StatsCounterProps) {
  const countersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target as HTMLElement;
            const target = parseInt(counter.dataset.target || '0', 10);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.floor(current).toString();
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target.toString();
              }
            };

            updateCounter();
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    countersRef.current.forEach((counter) => {
      if (counter) observer.observe(counter);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center">
          <div className="text-4xl md:text-5xl font-heading font-bold text-secondary-400 mb-2">
            <span
              ref={(el) => {
                if (el) countersRef.current[index] = el;
              }}
              className="counter"
              data-target={stat.value}
            >
              0
            </span>
            {stat.suffix || ''}
          </div>
          <p className="text-gray-600 font-medium">
            {lang === 'ar' ? stat.labelAr : stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
