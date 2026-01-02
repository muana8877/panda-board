'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface AnimatedBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseInteraction?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  particleCount = 80,
  connectionDistance = 150,
  mouseInteraction = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color palette - vibrant purple/cyan/pink
    const colors = [
      'rgba(139, 92, 246, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)',   // Pink
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(6, 182, 212, 0.8)',    // Cyan
      'rgba(168, 85, 247, 0.8)',   // Violet
    ];

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.3,
        });
      }
    };
    initParticles();

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (mouseInteraction) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, 'rgba(15, 10, 30, 1)');
      gradient.addColorStop(0.5, 'rgba(20, 10, 40, 1)');
      gradient.addColorStop(1, 'rgba(5, 5, 15, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating orbs (large blurred circles)
      const time = Date.now() * 0.001;

      // Orb 1 - Purple
      ctx.beginPath();
      const orb1X = canvas.width * 0.3 + Math.sin(time * 0.3) * 100;
      const orb1Y = canvas.height * 0.3 + Math.cos(time * 0.2) * 80;
      const orb1Gradient = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 300);
      orb1Gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
      orb1Gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = orb1Gradient;
      ctx.arc(orb1X, orb1Y, 300, 0, Math.PI * 2);
      ctx.fill();

      // Orb 2 - Pink
      ctx.beginPath();
      const orb2X = canvas.width * 0.7 + Math.cos(time * 0.4) * 120;
      const orb2Y = canvas.height * 0.6 + Math.sin(time * 0.3) * 100;
      const orb2Gradient = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 350);
      orb2Gradient.addColorStop(0, 'rgba(236, 72, 153, 0.12)');
      orb2Gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = orb2Gradient;
      ctx.arc(orb2X, orb2Y, 350, 0, Math.PI * 2);
      ctx.fill();

      // Orb 3 - Cyan
      ctx.beginPath();
      const orb3X = canvas.width * 0.5 + Math.sin(time * 0.25) * 80;
      const orb3Y = canvas.height * 0.8 + Math.cos(time * 0.35) * 60;
      const orb3Gradient = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, 250);
      orb3Gradient.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
      orb3Gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = orb3Gradient;
      ctx.arc(orb3X, orb3Y, 250, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction - particles move away from cursor
        if (mouseInteraction && mouseRef.current.active) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx += (dx / distance) * force * 0.5;
            particle.vy += (dy / distance) * force * 0.5;
          }
        }

        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.8', String(particle.alpha));
        ctx.fill();

        // Draw glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.8', '0.1');
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        if (mouseInteraction && mouseRef.current.active) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance * 1.5) {
            const opacity = (1 - distance / (connectionDistance * 1.5)) * 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              mouseRef.current.x, mouseRef.current.y
            );
            gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
            gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Draw mouse cursor glow
      if (mouseInteraction && mouseRef.current.active) {
        const cursorGradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 100
        );
        cursorGradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
        cursorGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
        cursorGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = cursorGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (mouseInteraction) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, connectionDistance, mouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBackground;
