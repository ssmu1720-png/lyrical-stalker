import { useEffect, useRef } from "react";

const GLYPHS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>[]{}/*+-=#$%";

export default function MatrixRain() {
  // Terminal Noir: matrix glyphs stay secondary to the warm ink UI, using signal lime
  // as a low-opacity atmosphere and never competing with readable response content.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontSize = window.innerWidth < 640 ? 17 : 19;
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let animationFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.font = `${fontSize}px "IBM Plex Mono", monospace`;
      context.textBaseline = "top";
      columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * (height / fontSize));
      speeds = Array.from({ length: columns }, () => 0.28 + Math.random() * 0.55);
      context.clearRect(0, 0, width, height);
    };

    const drawFrame = () => {
      context.fillStyle = "rgba(18, 19, 17, 0.105)";
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px "IBM Plex Mono", monospace`;

      drops.forEach((drop, column) => {
        const x = column * fontSize;
        const y = drop * fontSize;
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const isSignalColumn = column % 9 === 0;
        context.fillStyle = isSignalColumn ? "rgba(198, 243, 107, 0.64)" : "rgba(198, 243, 107, 0.22)";
        context.fillText(glyph, x, y);

        if (y > height && Math.random() > 0.974) {
          drops[column] = 0;
        } else {
          drops[column] += speeds[column];
        }
      });
    };

    const animate = () => {
      drawFrame();
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (reducedMotion) {
      drawFrame();
    } else {
      animate();
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="matrix-rain" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
