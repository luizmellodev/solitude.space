"use client";

import { useEffect, useRef, useState } from "react";
import { useAppTheme } from "@/components/theme-context";

// Efeito de neve para o tema Cozy
function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Inicializar flocos de neve
    const flakeCount = 100;
    snowflakesRef.current = [];

    for (let i = 0; i < flakeCount; i++) {
      snowflakesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        density: Math.random() * 10 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.5 + 0.2, // Velocidade reduzida
        angle: 0,
      });
    }

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakesRef.current.forEach((flake, index) => {
        // Atualizar posição
        flake.y += flake.speed;
        flake.x += Math.sin(flake.angle) * 0.3;

        // Resetar quando sair da tela
        if (flake.y > canvas.height) {
          snowflakesRef.current[index].y = -10;
          snowflakesRef.current[index].x = Math.random() * canvas.width;
        }

        // Incrementar ângulo para movimento ondulado
        flake.angle += 0.005; // Movimento mais suave

        // Desenhar floco
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []); // Dependência vazia para executar apenas uma vez

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
    />
  );
}

// Efeito de pétalas para o tema Cute
function PetalsEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Inicializar pétalas
    const petalCount = 50;
    petalsRef.current = [];

    for (let i = 0; i < petalCount; i++) {
      petalsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 1 + 0.5, // Velocidade reduzida
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 1 - 0.5, // Rotação mais lenta
        wobble: Math.random() * 3, // Menos oscilação
        wobbleSpeed: Math.random() * 0.03, // Oscilação mais lenta
        wobbleAngle: 0,
        color: `rgba(${220 + Math.random() * 35}, ${
          100 + Math.random() * 50
        }, ${150 + Math.random() * 50}, 0.7)`,
      });
    }

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petalsRef.current.forEach((petal, index) => {
        // Atualizar posição
        petal.y += petal.speed;
        petal.x += Math.sin(petal.wobbleAngle) * petal.wobble;
        petal.rotation += petal.rotationSpeed;
        petal.wobbleAngle += petal.wobbleSpeed;

        // Resetar quando sair da tela
        if (petal.y > canvas.height) {
          petalsRef.current[index].y = -20;
          petalsRef.current[index].x = Math.random() * canvas.width;
        }

        // Desenhar pétala
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate((petal.rotation * Math.PI) / 180);

        // Forma de pétala
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          petal.size / 2,
          -petal.size / 2,
          petal.size,
          -petal.size / 4,
          petal.size,
          petal.size / 2
        );
        ctx.bezierCurveTo(
          petal.size,
          petal.size,
          petal.size / 2,
          petal.size,
          0,
          petal.size / 2
        );
        ctx.bezierCurveTo(
          -petal.size / 2,
          petal.size,
          -petal.size,
          petal.size,
          -petal.size,
          petal.size / 2
        );
        ctx.bezierCurveTo(
          -petal.size,
          -petal.size / 4,
          -petal.size / 2,
          -petal.size / 2,
          0,
          0
        );

        ctx.fillStyle = petal.color;
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []); // Dependência vazia para executar apenas uma vez

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
    />
  );
}

// Efeito de partículas para o tema Sci-Fi
function ParticlesEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Inicializar partículas
    const particleCount = 80;
    particlesRef.current = [];

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.2,
        directionX: Math.random() * 2 - 1,
        directionY: Math.random() * 2 - 1,
        color: `rgba(${30 + Math.random() * 50}, ${
          100 + Math.random() * 155
        }, ${200 + Math.random() * 55}, ${0.3 + Math.random() * 0.5})`,
        pulse: Math.random() * 0.1 + 0.05,
        pulseDirection: 1,
        maxSize: Math.random() * 3 + 2,
        minSize: Math.random() * 1 + 0.5,
      });
    }

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Atualizar posição
        particle.x += particle.directionX * particle.speed;
        particle.y += particle.directionY * particle.speed;

        // Efeito de pulso
        if (particle.size >= particle.maxSize) particle.pulseDirection = -1;
        if (particle.size <= particle.minSize) particle.pulseDirection = 1;
        particle.size += particle.pulse * particle.pulseDirection;

        // Verificar limites
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.directionX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.directionY *= -1;
        }

        // Desenhar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Linhas de conexão
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 180, 255, ${
              0.1 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []); // Dependência vazia para executar apenas uma vez

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
    />
  );
}

// Efeito de glitch para o tema Pixel
function GlitchEffect() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Ativar glitch aleatoriamente
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100 + Math.random() * 200);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  if (!glitchActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className="absolute inset-0 bg-indigo-900/10"
        style={{
          top: `${Math.random() * 100}%`,
          height: `${Math.random() * 10}px`,
          left: 0,
          right: 0,
          transform: `translateY(${Math.random() * 10 - 5}px)`,
        }}
      />
      <div
        className="absolute bg-red-500/10"
        style={{
          top: `${Math.random() * 100}%`,
          height: `${Math.random() * 20}px`,
          left: 0,
          right: 0,
          transform: `translateX(${Math.random() * 10 - 5}px)`,
        }}
      />
      <div
        className="absolute bg-green-500/10"
        style={{
          top: `${Math.random() * 100}%`,
          height: `${Math.random() * 5}px`,
          left: 0,
          right: 0,
          transform: `translateX(${Math.random() * 10 - 5}px) translateY(${
            Math.random() * 10 - 5
          }px)`,
        }}
      />
    </div>
  );
}

// Componente principal que renderiza o efeito apropriado com base no tema
export default function ThemeEffects() {
  const { theme } = useAppTheme();

  return (
    <>
      {theme === "cozy" && <SnowEffect />}
      {theme === "cute" && <PetalsEffect />}
      {theme === "scifi" && <ParticlesEffect />}
      {theme === "pixel" && <GlitchEffect />}
      {theme === "neon" && (
        <div className="fixed inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-purple-900/10 animate-pulse-slow" />
        </div>
      )}
    </>
  );
}
