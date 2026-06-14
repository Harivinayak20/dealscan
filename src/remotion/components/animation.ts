import { Easing, interpolate } from "remotion";
import { ease } from "./theme";

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const smooth = Easing.bezier(...ease);

export function enter(frame: number, start: number, duration: number) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: smooth,
  });
}

export function exit(frame: number, start: number, duration: number) {
  return interpolate(frame, [start, start + duration], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });
}

/* ─── Perpetual motion: continuous oscillators so nothing is ever a still frame ─── */

// Raw sine wave in [-1, 1]. period is in frames.
export function osc(frame: number, period: number, phase = 0) {
  return Math.sin(((frame + phase) / period) * Math.PI * 2);
}

// Pixel bob/sway for endless gentle drift.
export function bob(frame: number, amp = 8, period = 50, phase = 0) {
  return osc(frame, period, phase) * amp;
}

// Multiplier that breathes around 1 for endless scale pulse.
export function pulse(frame: number, amp = 0.03, period = 46, phase = 0) {
  return 1 + osc(frame, period, phase) * amp;
}

// Endless small rotation (degrees).
export function wobble(frame: number, amp = 1.4, period = 64, phase = 0) {
  return osc(frame, period, phase) * amp;
}

// Strobe in [0,1] that spikes on a fast cycle — for high-energy accents.
export function strobe(frame: number, period = 10) {
  return (osc(frame, period) + 1) / 2;
}
