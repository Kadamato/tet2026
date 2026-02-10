import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  THEME_COLORS,
  LUNAR_NEW_YEAR_2026,
  FIREWORK_AUDIO_URL,
} from "../constants";
import { Firework, Particle, FireworkType } from "../types";
import { isMainEvent, isDailyShow } from "../utils";

interface FireworksProps {
  audioEnabled: boolean;
}

export interface FireworksHandle {
  launch: (type: FireworkType) => void;
}

const Fireworks = forwardRef<FireworksHandle, FireworksProps>(
  ({ audioEnabled }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fireworksRef = useRef<Firework[]>([]);

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    // Initialize Audio Context & Load Assets
    useEffect(() => {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      // Create context but don't start it yet if not needed
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const loadBuffer = async () => {
        try {
          const response = await fetch(FIREWORK_AUDIO_URL);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          audioBufferRef.current = audioBuffer;
        } catch (e) {
          console.warn(`Failed to load audio: ${FIREWORK_AUDIO_URL}`, e);
        }
      };

      loadBuffer();

      return () => {
        if (
          audioContextRef.current &&
          audioContextRef.current.state !== "closed"
        ) {
          audioContextRef.current.close();
        }
      };
    }, []);

    // Global Interaction Listener to Resume Audio Context
    useEffect(() => {
      const unlockAudio = () => {
        const ctx = audioContextRef.current;
        if (ctx && ctx.state === "suspended") {
          ctx.resume().catch((e) => console.warn("Audio resume failed", e));
        }
      };

      if (audioEnabled) {
        // Try to resume immediately if we have permission
        unlockAudio();
      }

      // Listen to all interaction events to ensure audio unlocks
      window.addEventListener("click", unlockAudio);
      window.addEventListener("touchstart", unlockAudio);
      window.addEventListener("keydown", unlockAudio);

      return () => {
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      };
    }, [audioEnabled]);

    const playSound = ():
      | { source: AudioBufferSourceNode; gainNode: GainNode }
      | undefined => {
      if (!audioEnabled || !audioContextRef.current || !audioBufferRef.current)
        return;
      const ctx = audioContextRef.current;

      // Always attempt to resume.
      if (ctx.state === "suspended") {
        ctx.resume().catch((e) => console.error("Resume failed", e));
      }

      try {
        const source = ctx.createBufferSource();
        source.buffer = audioBufferRef.current;

        const gainNode = ctx.createGain();

        // Randomize pitch slightly (0.9 to 1.1) to add variety
        source.playbackRate.value = 0.9 + Math.random() * 0.2;

        // Volume control
        gainNode.gain.value = 0.5;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);
        return { source, gainNode };
      } catch (e) {
        console.warn("Audio playback failed", e);
        return undefined;
      }
    };

    const stopSound = (source?: AudioBufferSourceNode, gainNode?: GainNode) => {
      if (source && gainNode && audioContextRef.current) {
        try {
          const ctx = audioContextRef.current;
          const fadeDuration = 2.5; // Fade out over 2.5 seconds

          // Cancel any future scheduled values
          gainNode.gain.cancelScheduledValues(ctx.currentTime);

          // Ramp down to 0
          gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(
            0,
            ctx.currentTime + fadeDuration,
          );

          // Stop the source after the fade
          source.stop(ctx.currentTime + fadeDuration);

          // Disconnect after stopping (approximated time)
          setTimeout(
            () => {
              try {
                source.disconnect();
                gainNode.disconnect();
              } catch (e) {
                // Ignore disconnect errors
              }
            },
            fadeDuration * 1000 + 100,
          );
        } catch (e) {
          // Ignore errors if already stopped
        }
      } else if (source) {
        // Fallback if no gain node (shouldn't happen with new logic but safe to have)
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      }
    };

    // --- Visuals ---

    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const createFirework = (
      canvasWidth: number,
      canvasHeight: number,
      forcedType?: FireworkType,
    ): Firework => {
      const startX = random(20, canvasWidth - 20);
      const targetY = random(50, canvasHeight / 2);
      const color =
        THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];

      // Play sound on creation
      const audioData = playSound();

      let type: FireworkType = "sphere";
      if (forcedType) {
        type = forcedType;
      } else {
        const rand = Math.random();
        if (rand > 0.8) type = "willow";
        else if (rand > 0.6) type = "ring";
        else if (rand > 0.5) type = "strobe";
      }

      return {
        x: startX,
        y: canvasHeight,
        targetY,
        vx: (canvasWidth / 2 - startX) * 0.003 + random(-0.5, 0.5),
        vy: random(-11, -17),
        color,
        type,
        particles: [],
        exploded: false,
        dead: false,
        audioSource: audioData?.source,
        audioGain: audioData?.gainNode,
      };
    };

    const createParticles = (
      x: number,
      y: number,
      color: string,
      type: FireworkType,
    ): Particle[] => {
      const particles: Particle[] = [];
      let particleCount = 100;

      // Customize based on type
      if (type === "ring") particleCount = 60;
      if (type === "willow") particleCount = 150;
      if (type === "strobe") particleCount = 80;

      for (let i = 0; i < particleCount; i++) {
        let vx = 0;
        let vy = 0;
        let decay = random(0.015, 0.03);
        let gravity = 0.08;
        let drag = 0.96; // Air resistance

        if (type === "sphere" || type === "strobe") {
          const angle = random(0, Math.PI * 2);
          const speed = random(1, 8);
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
          if (type === "strobe") decay = random(0.01, 0.02);
        } else if (type === "ring") {
          const angle = (Math.PI * 2 * i) / particleCount;
          const speed = 6;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
          decay = 0.02;
        } else if (type === "willow") {
          const angle = random(0, Math.PI * 2);
          const speed = random(1, 10);
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
          decay = random(0.005, 0.015); // Long lasting
          gravity = 0.03; // Floatier
          drag = 0.92; // High drag
        }

        particles.push({
          x,
          y,
          vx,
          vy,
          alpha: 1,
          color,
          decay,
          gravity,
          drag,
        });
      }
      return particles;
    };

    // Main Animation Loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationFrameId: number;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      const loop = () => {
        // Smooth trails
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "lighter";

        const now = new Date();
        // For testing visuals locally, you might uncomment this:
        // const now = new Date('2026-02-17T00:59:00');

        const diffFromTarget = now.getTime() - LUNAR_NEW_YEAR_2026.getTime();
        const minutesIntoNeYear = diffFromTarget / 1000 / 60;

        const isMainEventTime = isMainEvent(now);
        const isDailyShowTime = isDailyShow(now);

        let spawnRate = 0;
        let forcedType: FireworkType | undefined = undefined;

        if (isMainEventTime) {
          // STRATEGY: 1 Hour Special
          if (minutesIntoNeYear < 15) {
            // Phase 1: Warm up (0-15m)
            spawnRate = 0.05;
            if (Math.random() > 0.7) forcedType = "sphere";
          } else if (minutesIntoNeYear < 45) {
            // Phase 2: Building up (15-45m)
            spawnRate = 0.15;
            if (Math.random() > 0.8) forcedType = "ring";
          } else if (minutesIntoNeYear < 55) {
            // Phase 3: High Intensity (45-55m)
            spawnRate = 0.3;
            if (Math.random() > 0.6) forcedType = "strobe";
          } else {
            // Phase 4: Grand Finale (55-60m)
            spawnRate = 0.6;
            if (Math.random() > 0.5) forcedType = "willow";
          }
        } else if (isDailyShowTime) {
          // Daily Show: Elegant, steady
          spawnRate = 0.08;
          if (Math.random() > 0.7) forcedType = "willow"; // More classy willows
        }

        // Random spawn based on rate
        if (spawnRate > 0 && Math.random() < spawnRate) {
          // Occasionally spawn multiple in finale
          const count =
            isMainEventTime && minutesIntoNeYear > 55 && Math.random() > 0.5
              ? 3
              : 1;

          for (let k = 0; k < count; k++) {
            const fw = createFirework(canvas.width, canvas.height, forcedType);
            fireworksRef.current.push(fw);
          }
        }

        for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
          const fw = fireworksRef.current[i];

          if (!fw.exploded) {
            fw.x += fw.vx;
            fw.y += fw.vy;
            fw.vy += 0.15; // Launch gravity

            ctx.beginPath();
            ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = fw.color;
            ctx.fill();

            if (fw.vy >= 0 || fw.y <= fw.targetY) {
              fw.exploded = true;
              fw.particles = createParticles(fw.x, fw.y, fw.color, fw.type);
              // No separate explosion sound, the launch sound carries through
            }
          } else {
            for (let j = fw.particles.length - 1; j >= 0; j--) {
              const p = fw.particles[j];

              // Physics update
              p.x += p.vx;
              p.y += p.vy;
              p.vy += p.gravity; // Gravity
              p.vx *= p.drag; // Air resistance
              p.vy *= p.drag;

              // Strobe effect
              if (fw.type === "strobe") {
                // Flicker alpha randomly
                p.alpha = Math.random() > 0.5 ? 1 : 0.3;
                p.alpha -= p.decay;
              } else {
                p.alpha -= p.decay;
              }

              if (p.alpha <= 0) {
                fw.particles.splice(j, 1);
                continue;
              }

              ctx.beginPath();
              ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            if (fw.particles.length === 0) {
              fw.dead = true;
            }
          }

          if (fw.dead) {
            // Stop the sound when the firework is completely gone
            stopSound(fw.audioSource, fw.audioGain);
            fireworksRef.current.splice(i, 1);
          }
        }

        animationFrameId = requestAnimationFrame(loop);
      };

      loop();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationFrameId);
      };
    }, [audioEnabled]);

    useImperativeHandle(ref, () => ({
      launch: (type: FireworkType) => {
        const canvas = canvasRef.current;
        if (canvas) {
          const fw = createFirework(canvas.width, canvas.height, type);
          fireworksRef.current.push(fw);
        }
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      />
    );
  },
);

export default Fireworks;
