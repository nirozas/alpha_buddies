import { useEffect, useRef } from 'react';

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: { x: number; y: number; vx: number; vy: number; color: string; size: number; angle: number; spin: number }[] = [];
    const colors = ['#f472b6','#818cf8','#34d399','#fbbf24','#f87171','#60a5fa','#a78bfa'];
    for (let i = 0; i < 140; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
      });
    }

    let frame: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      if (pieces.some(p => p.y < canvas.height + 20)) {
        frame = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, canvas.width, canvas.height); };
  }, [active]);

  return <canvas ref={canvasRef} id="confetti-canvas" />;
}
