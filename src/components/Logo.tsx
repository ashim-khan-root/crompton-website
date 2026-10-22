/**
 * Brand lockup — the client's own logo art, not a redraw.
 *
 * Source: the legacy site's `assets/img/png-icon/logo-element.png` (1193x839) for the
 * globe, and `assets/img/logo/logo.png` (350x60) for the full lockup with the wordmark
 * baked in. `scripts/prepare-brand.py` cleans them: every pixel snapped to the four
 * brand colours, the white ground turned into real transparency, and a 2x asset cut
 * for retina. Nothing here is redrawn, so the mark is exactly the one the client uses.
 *
 * `tone="dark"` swaps to the recoloured asset (all ink -> white, red swoosh kept),
 * because the globe's navy half and the black wordmark disappear on a navy ground.
 */
interface LogoProps {
  href?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/* 680x118 — the aspect ratio the layout must reserve, so the header never jumps. */
const W = 680;
const H = 118;

export default function Logo({ href, tone = 'light', className = '' }: LogoProps) {
  const img = (
    <img
      src={tone === 'dark' ? '/brand/lockup-white.png' : '/brand/lockup.png'}
      alt="Crompton International — Trading & Contracting Company WLL"
      width={W}
      height={H}
      decoding="async"
      /* Height only: the width follows the ratio, so the lockup scales down on
         narrow bars instead of overflowing them. */
      className={`h-8 w-auto shrink-0 md:h-10 ${className}`}
    />
  );

  if (href) {
    return (
      <a href={href} aria-label="Crompton International — home" className="inline-flex shrink-0 items-center">
        {img}
      </a>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{img}</span>;
}
