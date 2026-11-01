import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './AmbientBackground.scss';

const COLORS = [
  [239, 118, 39],  // orange
  [255, 154, 86],  // pêche
  [209, 98, 164],  // rose
  [181, 86, 144],  // mauve
  [163, 2, 98],    // magenta
];

// Largeur max de ta colonne de lecture (.Book dans Book.scss)
const READING_COLUMN = 680;
const TAU = Math.PI * 2;

const rand = (a, b) => a + Math.random() * (b - a);
const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// ── Fabriques ──
const createParticle = () => ({
  x: Math.random(),
  y: Math.random(),
  speed: rand(0.000018, 0.000058), // part d'écran / ms
  sway: rand(0, TAU),
  swaySpeed: rand(0.0002, 0.0006),
  r: rand(0.6, 1.9),
  a: rand(0.25, 0.65),
  tw: rand(0, TAU),
  twSpeed: rand(0.0006, 0.0016),
  c: pick(),
});

// Grands disques flous qui dérivent lentement (profondeur)
const createBokeh = () => ({
  x: Math.random(),
  y: Math.random(),
  r: rand(0.08, 0.2), // part du petit côté de l'écran
  vx: rand(-1, 1) * 0.00001,
  vy: rand(-1, 1) * 0.00001,
  ph: rand(0, TAU),
  phs: rand(0.0003, 0.0007),
  a: rand(0.06, 0.12),
  c: pick(),
});

// Fils de lumière
const createThread = (i, n) => ({
  off: n > 1 ? i / (n - 1) - 0.5 : 0,
  amp: rand(0.1, 0.2),
  freq: rand(1.1, 2.6),
  speed: rand(0.00045, 0.001), // rad / ms
  phase: rand(0, TAU),
  c: COLORS[(i * 2) % COLORS.length],
});

const makeThreads = (n) => Array.from({ length: n }, (_, i) => createThread(i, n));

// Deux tresses : une en haut, une en bas, le milieu reste libre pour le texte
const createBands = (mobile) => [
  { cy: 0.13, hk: 0.14, wk: 0.22, threads: makeThreads(mobile ? 3 : 4) },
  { cy: 0.87, hk: 0.2, wk: 0.3, threads: makeThreads(mobile ? 5 : 7) },
];

// ── Anneau SVG ──
const Ring = ({ id, colors, dash }) => (
  <svg className="ambient__ring" viewBox="0 0 100 100">
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
        {colors.map((c, i) => (
          <stop key={i} offset={i / (colors.length - 1)} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
    <circle
      cx="50" cy="50" r="48"
      pathLength="100"
      stroke={`url(#${id})`}
      strokeDasharray={dash}
    />
  </svg>
);

// ── Ondes qui naissent des orbes ──
const Ripples = ({ count, color }) => (
  <div className="ambient__ripples" style={{ '--ripple-color': color }}>
    {Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className="ambient__ripple"
        style={{ '--i': i, '--n': count }}
      />
    ))}
  </div>
);

const AmbientBackground = () => {
  const { pathname } = useLocation();

  // Page de lecture : le fond se calme (adapte la route si besoin)
  const isReading = pathname.startsWith('/book/');

  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const calmRef = useRef(isReading);

  useEffect(() => {
    calmRef.current = isReading;
  }, [isReading]);

  // ── La progression de scroll fait lentement tourner les couleurs ──
  useEffect(() => {
    const el = rootRef.current;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      el.style.setProperty('--scroll', p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // ── Canvas : bokehs, fils de lumière, poussière, étoiles filantes ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let w = 0, h = 0, lastW = 0, dpr = 1;
    let minInterval = 0; // 0 = 60 images/s, 28 = ~30 images/s
    let particles = [];
    let bokehs = [];
    let bands = [];
    let phaseT = 0;
    let comet = null;
    let nextComet = rand(3000, 7000);
    let raf = 0;
    let last = performance.now();
    let resizeTimer;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const small = w < 1024;

      // Des traits fins n'ont pas besoin d'une haute résolution sur mobile/tablette
      dpr = small ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      minInterval = small ? 28 : 0;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // On ne régénère que si la largeur change
      // (la barre d'adresse mobile change la hauteur en scrollant)
      if (w !== lastW) {
        lastW = w;
        const mobile = w < 640;
        const tablet = w < 1024;
        particles = Array.from({ length: mobile ? 44 : tablet ? 48 : 70 }, createParticle);
        bokehs = Array.from({ length: mobile ? 5 : tablet ? 6 : 8 }, createBokeh);
        bands = createBands(mobile);
      }
    };

    const spawnComet = () => {
      const dir = Math.random() < 0.5 ? 1 : -1; // vers la droite ou la gauche
      const angle = rand(0.35, 0.7);            // pente vers le bas
      const dist = Math.max(w, h) * rand(0.35, 0.55);
      const dur = rand(1100, 1700);
      comet = {
        x: dir === 1 ? rand(-0.05, 0.45) * w : rand(0.55, 1.05) * w,
        y: rand(0.02, 0.4) * h,
        vx: (Math.cos(angle) * dir * dist) / dur,
        vy: (Math.sin(angle) * dist) / dur,
        age: 0,
        dur,
        len: rand(90, 160),
        c: pick(),
      };
    };

    const draw = (dt) => {
      const calm = calmRef.current;
      const mobile = w < 640;
      const narrow = w < 720;

      const speedK = (calm ? 0.25 : 1) * (mobile ? 1.4 : 1);
      const fxK = calm ? 0.45 : 1; // intensité des fils et des bokehs
      const colHalf = Math.min(READING_COLUMN / 2, w / 2) / w;
      const alphaK = (calm ? 0.55 : 1) * (mobile ? 0.9 : narrow ? 0.6 : 1);

      phaseT += dt * speedK;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      // 1. Bokehs (arrière-plan)
      for (const b of bokehs) {
        b.x += b.vx * dt * speedK;
        b.y += b.vy * dt * speedK;
        b.ph += b.phs * dt;
        if (b.x < -0.15) b.x = 1.15;
        if (b.x > 1.15) b.x = -0.15;
        if (b.y < -0.15) b.y = 1.15;
        if (b.y > 1.15) b.y = -0.15;

        const R = b.r * Math.min(w, h);
        const x = b.x * w;
        const y = b.y * h;
        const a = b.a * (0.65 + 0.35 * Math.sin(b.ph)) * fxK;
        const [r, g, bl] = b.c;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, R);
        grad.addColorStop(0, `rgba(${r},${g},${bl},${a})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${bl},${a * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, R, 0, TAU);
        ctx.fill();
      }

      // 2. Fils de lumière (tresses haut et bas)
      const step = Math.max(6, Math.round(w / 90));
      for (const band of bands) {
        const total = Math.min(h * band.hk, w * band.wk);
        const cy = band.cy * h;

        for (const th of band.threads) {
          const path = new Path2D();
          for (let x = 0; x <= w + step; x += step) {
            const u = Math.min(x / w, 1);
            const env = Math.pow(Math.sin(Math.PI * u), 0.85); // les fils se rejoignent aux bords
            const y =
              cy +
              env *
                (th.off * total +
                  th.amp * total * Math.sin(u * Math.PI * th.freq + phaseT * th.speed + th.phase));
            if (x === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
          }

          const [r, g, bl] = th.c;
          ctx.strokeStyle = `rgba(${r},${g},${bl},${0.06 * fxK})`;
          ctx.lineWidth = 5;
          ctx.stroke(path);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${0.3 * fxK})`;
          ctx.lineWidth = 1.1;
          ctx.stroke(path);
        }
      }

      // 3. Poussière de lumière
      for (const p of particles) {
        p.y -= p.speed * dt * speedK;
        p.sway += p.swaySpeed * dt * speedK;
        p.tw += p.twSpeed * dt;

        if (p.y < -0.03) {
          p.y = 1.03;
          p.x = Math.random();
        }

        const x = (p.x + Math.sin(p.sway) * 0.012) * w;
        const y = p.y * h;

        // La colonne de lecture reste plus calme que les marges
        const edge = narrow
          ? 1
          : smooth(colHalf * 0.9, colHalf * 1.5, Math.abs(p.x - 0.5));
        const fade = Math.max(0, Math.min(1, Math.min(p.y, 1 - p.y) * 8));
        const a = p.a * (0.6 + 0.4 * Math.sin(p.tw)) * alphaK * (0.25 + 0.75 * edge) * fade;
        const [r, g, bl] = p.c;

        ctx.beginPath();
        ctx.arc(x, y, p.r * 3, 0, TAU);
        ctx.fillStyle = `rgba(${r},${g},${bl},${a * 0.12})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, TAU);
        ctx.fillStyle = `rgba(${r},${g},${bl},${a})`;
        ctx.fill();
      }

      // 4. Étoile filante (jamais pendant la lecture, jamais en mode animations réduites)
      if (!calm && !reduceMotion.matches) {
        nextComet -= dt;
        if (!comet && nextComet <= 0) {
          spawnComet();
          nextComet = rand(6000, 12000);
        }
      }
      if (comet) {
        comet.age += dt;
        comet.x += comet.vx * dt;
        comet.y += comet.vy * dt;

        if (comet.age >= comet.dur) {
          comet = null;
        } else {
          const a = Math.sin((comet.age / comet.dur) * Math.PI) * 0.8;
          const v = Math.hypot(comet.vx, comet.vy);
          const tx = comet.x - (comet.vx / v) * comet.len;
          const ty = comet.y - (comet.vy / v) * comet.len;
          const [r, g, bl] = comet.c;

          const grad = ctx.createLinearGradient(tx, ty, comet.x, comet.y);
          grad.addColorStop(0, `rgba(${r},${g},${bl},0)`);
          grad.addColorStop(1, `rgba(${r},${g},${bl},${a})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(comet.x, comet.y);
          ctx.stroke();

          ctx.fillStyle = `rgba(255,226,200,${a})`;
          ctx.beginPath();
          ctx.arc(comet.x, comet.y, 1.8, 0, TAU);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const elapsed = now - last;
      if (elapsed < minInterval) return; // cadence réduite sur mobile/tablette
      last = now;
      draw(Math.min(elapsed, 64));
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduceMotion.matches) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduceMotion.matches) draw(0);
      }, 150);
    };

    resize();
    if (reduceMotion.matches) {
      draw(0); // image fixe, sans animation
    } else {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`ambient${isReading ? ' is-reading' : ''}`}
      aria-hidden="true"
    >
      <div className="ambient__orb ambient__orb--main">
        <span className="ambient__core" />
        <Ring
          id="ambient-ring-main"
          colors={['#D52D00', '#FF9A56', '#D162A4', '#A30262']}
          dash="62 38"
        />
        <Ripples count={3} color="rgb(209, 98, 164)" />
      </div>

      <div className="ambient__orb ambient__orb--soft">
        <span className="ambient__core ambient__core--alt" />
        <Ring
          id="ambient-ring-soft"
          colors={['#D162A4', '#EF7627', '#FF9A56']}
          dash="48 52"
        />
        <Ripples count={2} color="rgb(255, 154, 86)" />
      </div>

      <div className="ambient__orb ambient__orb--edge">
        <span className="ambient__core ambient__core--alt" />
        <Ring
          id="ambient-ring-edge"
          colors={['#EF7627', '#D162A4', '#A30262']}
          dash="35 65"
        />
        <Ripples count={2} color="rgb(239, 118, 39)" />
      </div>

      <canvas ref={canvasRef} className="ambient__dust" />
      <span className="ambient__vignette" />
      <span className="ambient__grain" />
    </div>
  );
};

export default AmbientBackground;