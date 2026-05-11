import { useState, useEffect, useRef } from 'react';
import './LoadingModal.scss';

const LETTERS = ['G','l','a','n','d','i','a'];

const LoadingModal = ({ onComplete }) => {
  const [phase, setPhase] = useState('visible');
  const canvasRef = useRef(null);

  useEffect(() => {
    const t2 = setTimeout(() => setPhase('exiting'), 3800);
    const t3 = setTimeout(() => onComplete(), 4300);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  useEffect(() => {
    const cv = canvasRef.current;
    const cx = cv.getContext('2d');
    let raf;

    const bands = [
      {y:0.30,amp:0.10,sp:0.00016,ph:0,   fr:1.8,col:[91,239,160], al:0.50,th:0.20},
      {y:0.42,amp:0.08,sp:0.00022,ph:1.2, fr:2.1,col:[0,195,255],  al:0.45,th:0.15},
      {y:0.22,amp:0.11,sp:0.00013,ph:2.5, fr:1.5,col:[148,111,233],al:0.38,th:0.22},
      {y:0.52,amp:0.06,sp:0.00028,ph:0.7, fr:2.6,col:[0,195,255],  al:0.30,th:0.10},
      {y:0.15,amp:0.08,sp:0.00018,ph:3.8, fr:1.3,col:[91,239,160], al:0.25,th:0.16},
    ];
    const stars = Array.from({length:100}, () => ({
      x: Math.random(), y: Math.random() * 0.7,
      r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.5 + 0.15,
    }));

    function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function drawBand(b, t) {
      const w = cv.width, h = cv.height, steps = 200, bh = b.th * h;
      const [r, g, bc] = b.col;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const n = Math.sin(i/steps*Math.PI*b.fr + t*b.sp + b.ph)
                + Math.sin(i/steps*Math.PI*b.fr*1.7 + t*b.sp*0.6 + b.ph+1.3)*0.4
                + Math.sin(i/steps*Math.PI*b.fr*0.5 + t*b.sp*1.4 + b.ph+2.7)*0.25;
        const y = b.y * h + n * b.amp * h;
        const av = (Math.sin(i/steps*Math.PI*3 + t*0.0004)*0.3+0.7)*b.al;
        const gr = cx.createLinearGradient(x, y-bh*0.5, x, y+bh*1.5);
        gr.addColorStop(0,   `rgba(${r},${g},${bc},0)`);
        gr.addColorStop(0.2, `rgba(${r},${g},${bc},${av})`);
        gr.addColorStop(0.5, `rgba(${r},${g},${bc},${av*0.5})`);
        gr.addColorStop(1,   `rgba(${r},${g},${bc},0)`);
        cx.fillStyle = gr;
        cx.fillRect(x-0.5, y-bh*0.5, 1.5, bh*2);
      }
    }

    function frame(t) {
      const w = cv.width, h = cv.height;
      cx.clearRect(0,0,w,h);
      cx.fillStyle = '#020810'; cx.fillRect(0,0,w,h);
      stars.forEach(s => {
        cx.beginPath(); cx.arc(s.x*w, s.y*h, s.r, 0, Math.PI*2);
        cx.fillStyle = `rgba(255,255,255,${s.a})`; cx.fill();
      });
      cx.globalCompositeOperation = 'screen';
      bands.forEach(b => drawBand(b, t));
      cx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className={`loading-modal ${phase}`}>
      <canvas ref={canvasRef} className="loading-canvas" />
      <div className="loading-grain" />
      <div className="loading-vignette" />
      <div className="loading-content">
        <div className="loading-logo">
          {LETTERS.map((l, i) => (
            <span key={i} className="loading-letter" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
              {l}
            </span>
          ))}
        </div>
        <div className="loading-bottom">
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
        <p className="loading-tagline">Ma bibliothèque</p>
        
      </div>
    </div>
  );
};

export default LoadingModal;