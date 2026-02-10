export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  gravity: number; // New: Gravity effect
  drag: number;    // New: Air resistance
}

export type FireworkType = 'sphere' | 'ring' | 'willow' | 'strobe';

export interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: FireworkType; // New
  particles: Particle[];
  exploded: boolean;
  dead: boolean;
  audioSource?: AudioBufferSourceNode;
  audioGain?: GainNode;
}