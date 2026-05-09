import { useEffect, useRef } from 'react';

const bands = [
  { y: 0.28, amp: 0.10, speed: 0.00018, phase: 0,   freq: 1.8, color: [91, 239, 160],  alpha: 0.55, thickness: 0.18 },
  { y: 0.38, amp: 0.08, speed: 0.00024, phase: 1.2, freq: 2.1, color: [0, 195, 255],   alpha: 0.50, thickness: 0.14 },
  { y: 0.22, amp: 0.12, speed: 0.00014, phase: 2.5, freq: 1.5, color: [148, 111, 233], alpha: 0.40, thickness: 0.20 },
  { y: 0.45, amp: 0.07, speed: 0.00030, phase: 0.7, freq: 2.6, color: [0, 195, 255],   alpha: 0.35, thickness: 0.10 },
  { y: 0.15, amp: 0.09, speed: 0.00020, phase: 3.8, freq: 1.3, color: [91, 239, 160],  alpha: 0.30, thickness: 0.15 },
  { y: 0.55, amp: 0.06, speed: 0.00012, phase: 5.0, freq: 3.0, color: [148, 111, 233], alpha: 0.25, thickness: 0.08 },
];

function drawBand(ctx, band, t, w, h) {
  const steps = 200;
  const bandH = band.thickness * h;
  const [r, g, b] = band.color;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const n1 = Math.sin(i / steps * Math.PI * band.freq + t * band.speed + band.phase);
    const n2 = Math.sin(i / steps * Math.PI * band.freq * 1.7 + t * band.speed * 0.6 + band.phase + 1.3) * 0.4;
    const n3 = Math.sin(i / steps * Math.PI * band.freq * 0.5 + t * band.speed * 1.4 + band.phase + 2.7) * 0.25;
    const y = band.y * h + (n1 + n2 + n3) * band.amp * h;
    const alphaVar = (Math.sin(i / steps * Math.PI * 3 + t * 0.0004) * 0.3 + 0.7) * band.alpha;
    const grad = ctx.createLinearGradient(x, y - bandH * 0.5, x, y + bandH * 1.5);
    grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
    grad.addColorStop(0.2, `rgba(${r},${g},${b},${alphaVar})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${alphaVar * 0.6})`);
    grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - 0.5, y - bandH * 0.5, 1.5, bandH * 2);
  }
}

export default function AuroraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rafId;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random() * 0.6,
      r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.6 + 0.2,
    }));

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function frame(t) {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#020810';
      ctx.fillRect(0, 0, w, h);

      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'screen';
      bands.forEach(b => drawBand(ctx, b, t, w, h));
      ctx.globalCompositeOperation = 'source-over';

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="aurora-canvas" />;
}