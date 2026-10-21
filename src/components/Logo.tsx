/**
 * Brand lockup: geometric "C" + wordmark.
 *
 * The gold keystone sits in the C's opening — the gap filled is the brand idea
 * (the right people for the gap in a project). Geometry is drawn, not set, so it
 * stays crisp at favicon size. Wordmark uses the heading font at two weights.
 */
interface LogoProps {
  href?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ href, tone = 'light', className = '' }: LogoProps) {
  const mark = tone === 'dark' ? '#ffffff' : '#1a365d';
  const word = tone === 'dark' ? 'text-white' : 'text-primary-500';
  const sub = tone === 'dark' ? 'text-white/55' : 'text-ink-faint';

  const content = (
    <>
      <svg
        className="h-8 w-8 shrink-0"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M36.30 32.60 A15 15 0 1 1 36.99 16.50"
          stroke={mark}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <rect x="30.5" y="20.75" width="7.5" height="6.5" rx="1.5" fill="#d69e2e" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-heading text-[1.05rem] font-extrabold leading-none tracking-[-0.015em] ${word}`}
        >
          CROMTON
        </span>
        <span
          className={`mt-[0.34em] text-[0.6rem] font-semibold uppercase leading-none tracking-[0.3em] ${sub}`}
        >
          Group
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label="Cromton Group — home"
        className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}
      >
        {content}
      </a>
    );
  }

  return <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>{content}</span>;
}
