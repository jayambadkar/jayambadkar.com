import { useEffect, useRef } from 'react';
import type { Theme } from '../hooks/useTheme';
import styles from './ParticleField.module.css';

/**
 * Generative hero background: particles drift through a trigonometric vector
 * field θ(x, y, t) = π·(sin(kx + t) + cos(ky − 1.3t)), link up with their
 * neighbours and are repelled by the cursor. Renders a single static frame
 * when the user prefers reduced motion, and pauses when off-screen or hidden.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tone: 0 | 1 | 2;
}

interface Palette {
  dots: readonly [string, string, string];
  lineRgb: string;
  lineAlpha: number;
}

const PALETTES: Record<Theme, Palette> = {
  dark: { dots: ['#8b6cff', '#22d3ee', '#f472b6'], lineRgb: '139, 108, 255', lineAlpha: 0.32 },
  light: { dots: ['#6a46f5', '#0891b2', '#db2777'], lineRgb: '106, 70, 245', lineAlpha: 0.22 },
};

const FIELD_SCALE = 0.0032;
const LINK_DISTANCE = 115;
const POINTER_RADIUS = 150;
const ALPHA_BUCKETS = 5;

export interface ParticleFieldProps {
  theme: Theme;
  reducedMotion: boolean;
  className?: string | undefined;
}

export function ParticleField({ theme, reducedMotion, className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Particles persist across theme / motion changes so nothing jumps.
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const palette = PALETTES[theme];
    const particles = particlesRef.current;
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let t = 0;
    let raf = 0;
    let onScreen = true;

    const spawn = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      r: Math.random() * 1.5 + 0.7,
      tone: Math.floor(Math.random() * 3) as 0 | 1 | 2,
    });

    const step = (): void => {
      t += 0.0028;
      const r2 = POINTER_RADIUS * POINTER_RADIUS;
      for (const p of particles) {
        const angle =
          (Math.sin(p.x * FIELD_SCALE + t) + Math.cos(p.y * FIELD_SCALE - t * 1.3)) * Math.PI;
        p.vx += Math.cos(angle) * 0.035;
        p.vy += Math.sin(angle) * 0.035;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / POINTER_RADIUS) * 0.9;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        p.vx *= 0.93;
        p.vy *= 0.93;
        p.x += p.vx;
        p.y += p.vy;

        const m = 20;
        if (p.x < -m) p.x = width + m;
        else if (p.x > width + m) p.x = -m;
        if (p.y < -m) p.y = height + m;
        else if (p.y > height + m) p.y = -m;
      }
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, width, height);

      // Batch neighbour links into a few alpha buckets: far fewer stroke() calls.
      const buckets: Path2D[] = Array.from({ length: ALPHA_BUCKETS }, () => new Path2D());
      const maxD2 = LINK_DISTANCE * LINK_DISTANCE;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (!a) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= maxD2) continue;
          const strength = 1 - Math.sqrt(d2) / LINK_DISTANCE;
          const bucket = buckets[Math.min(ALPHA_BUCKETS - 1, Math.floor(strength * ALPHA_BUCKETS))];
          bucket?.moveTo(a.x, a.y);
          bucket?.lineTo(b.x, b.y);
        }
      }
      ctx.lineWidth = 1;
      buckets.forEach((path, i) => {
        const alpha = ((i + 1) / ALPHA_BUCKETS) * palette.lineAlpha;
        ctx.strokeStyle = `rgba(${palette.lineRgb}, ${alpha.toFixed(3)})`;
        ctx.stroke(path);
      });

      if (pointer.active) {
        const reach = POINTER_RADIUS * 1.25;
        for (const p of particles) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > reach) continue;
          ctx.strokeStyle = `rgba(${palette.lineRgb}, ${((1 - d / reach) * 0.55).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      for (let tone = 0; tone < 3; tone++) {
        ctx.fillStyle = palette.dots[tone as 0 | 1 | 2];
        ctx.beginPath();
        for (const p of particles) {
          if (p.tone !== tone) continue;
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const frame = (): void => {
      step();
      draw();
      raf = requestAnimationFrame(frame);
    };

    const shouldRun = (): boolean => !reducedMotion && onScreen && !document.hidden;

    const sync = (): void => {
      if (shouldRun()) {
        if (!raf) raf = requestAnimationFrame(frame);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prevW = width;
      const prevH = height;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rescale existing particles to the new box, then top up / trim.
      if (prevW > 0 && prevH > 0) {
        for (const p of particles) {
          p.x = (p.x / prevW) * width;
          p.y = (p.y / prevH) * height;
        }
      }
      const target = Math.round(Math.min(170, Math.max(45, (width * height) / 8500)));
      while (particles.length < target) particles.push(spawn());
      particles.length = target;

      if (!raf) draw();
    };

    const onPointerMove = (e: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onPointerLeave = (): void => {
      pointer.active = false;
    };

    // Seed the very first frame with some evolution so it doesn't start uniform.
    resize();
    if (particles.length > 0 && t === 0) {
      for (let i = 0; i < 60; i++) step();
      draw();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      sync();
    });
    intersectionObserver.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
    }
    sync();

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [theme, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className ? `${styles.canvas ?? ''} ${className}` : styles.canvas}
      aria-hidden="true"
    />
  );
}
