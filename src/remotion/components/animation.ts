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
