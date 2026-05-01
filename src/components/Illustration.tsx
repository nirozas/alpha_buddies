import type { SVGProps } from 'react';

// Bespoke SVGs for the first few letters to demonstrate custom colorful SVG illustrations
const customSvgs: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  '🍎': (props) => (
    <svg viewBox="0 0 100 100" {...props}>
      <path d="M50 85 C30 85 20 65 20 45 C20 25 35 15 50 25 C65 15 80 25 80 45 C80 65 70 85 50 85 Z" fill="#EF4444" />
      <path d="M45 20 C45 10 55 5 60 5 C60 15 50 20 45 20 Z" fill="#22C55E" />
      <path d="M50 25 Q55 10 65 5" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="40" rx="6" ry="12" fill="white" opacity="0.3" transform="rotate(-20 35 40)" />
    </svg>
  ),
  '⚽': (props) => (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" r="40" fill="white" stroke="#1C1917" strokeWidth="3" />
      <path d="M50 30 L65 40 L60 55 L40 55 L35 40 Z" fill="#1C1917" />
      <path d="M50 30 L50 10 M65 40 L85 35 M60 55 L70 75 M40 55 L30 75 M35 40 L15 35" stroke="#1C1917" strokeWidth="3" />
    </svg>
  ),
  '☀️': (props) => (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" r="20" fill="#FBBF24" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <line key={angle} x1="50" y1="20" x2="50" y2="5" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"
          transform={`rotate(${angle} 50 50)`} />
      ))}
    </svg>
  ),
  '🍪': (props) => (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" r="40" fill="#D97706" />
      {[
        [30, 30], [50, 20], [70, 35], [25, 55], [50, 50], [80, 55], [40, 75], [65, 75]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#451A03" />
      ))}
    </svg>
  ),
};

// Helper to convert emoji to Twemoji SVG URL
const getTwemojiUrl = (emoji: string) => {
  const codePoint = Array.from(emoji)
    .map(char => char.codePointAt(0)?.toString(16))
    .filter(val => val !== 'fe0f' && val !== '200d') // Ignore variation selectors and zero-width joiners
    .join('-');
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${codePoint}.svg`;
};

interface IllustrationProps {
  emoji: string;
  className?: string;
  size?: number;
}

export function Illustration({ emoji, className = '', size = 64 }: IllustrationProps) {
  // Try to use our bespoke SVG if it exists
  const CustomSvg = customSvgs[emoji];
  if (CustomSvg) {
    return <CustomSvg className={className} style={{ width: size, height: size }} />;
  }

  // Otherwise, fall back to high-quality Twemoji SVGs loaded via CDN
  return (
    <img 
      src={getTwemojiUrl(emoji)} 
      alt={emoji} 
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      draggable={false}
      onError={(e) => {
        // Ultimate fallback if CDN fails: just render the native emoji text
        (e.target as HTMLImageElement).style.display = 'none';
        const span = document.createElement('span');
        span.innerText = emoji;
        span.style.fontSize = `${size}px`;
        span.style.lineHeight = '1';
        (e.target as HTMLImageElement).parentElement?.appendChild(span);
      }}
    />
  );
}
