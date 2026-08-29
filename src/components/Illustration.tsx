import type { SVGProps } from 'react';

// Bespoke SVGs for common UI elements
const customSvgs: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  'star': (props) => (
    <svg viewBox="0 0 100 100" {...props}>
      <path d="M50 10 L62 38 L92 38 L68 56 L77 84 L50 67 L23 84 L32 56 L8 38 L38 38 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
      <path d="M50 20 L58 40 L85 40 L65 55 L72 80 L50 65 L28 80 L35 55 L15 40 L42 40 Z" fill="#FDE68A" opacity="0.5" />
    </svg>
  ),
  'party': (props) => (
    <svg viewBox="0 0 100 100" {...props}>
      <path d="M20 80 L80 20 L90 30 L30 90 Z" fill="#EF4444" />
      <circle cx="85" cy="25" r="10" fill="#FBBF24" />
      <path d="M10 90 Q30 70 50 90 T90 70" stroke="#3B82F6" strokeWidth="4" fill="none" />
    </svg>
  ),
};

const getImgUrl = (id: string, style: 'color' | 'fluency' | 'flat' = 'color') => {
  if (id.startsWith('http') || id.startsWith('/')) return id;
  const mapping: Record<string, string> = {
    '⭐': 'star',
    '🥳': 'party-popper',
    '🤩': 'star-struck',
    '🎉': 'confetti',
    '🎤': 'microphone',
    '🚀': 'rocket',
    '🔒': 'lock',
  };
  const iconName = mapping[id] || id.toLowerCase().replace(/ /g, '-');
  return `https://img.icons8.com/${style}/200/${iconName}.png`;
};

interface IllustrationProps {
  emoji?: string;
  icon?: string;
  className?: string;
  size?: number;
}

export function Illustration({ emoji, icon, className = '', size = 64 }: IllustrationProps) {
  const id = icon || emoji || 'star';
  
  // Try to use our bespoke SVG if it exists
  const CustomSvg = customSvgs[id];
  if (CustomSvg) {
    return <CustomSvg className={className} style={{ width: size, height: size }} />;
  }

  return (
    <img 
      src={getImgUrl(id)} 
      alt={id} 
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      draggable={false}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        // If 'color' fails, try 'fluency'
        if (target.src.includes('/color/')) {
          target.src = getImgUrl(id, 'fluency');
        } 
        // If 'fluency' fails, try 'flat'
        else if (target.src.includes('/fluency/')) {
          target.src = getImgUrl(id, 'flat');
        }
        // Last resort: Fallback to a placeholder icon
        else {
          target.src = 'https://img.icons8.com/fluency/200/star.png';
        }
      }}
    />
  );
}
