export interface MotionPolicy {
  readonly durationSeconds: number;
  readonly animate: boolean;
}
export function motionPolicy(reducedMotion: boolean): MotionPolicy {
  return { durationSeconds: reducedMotion ? 0 : 0.16, animate: !reducedMotion };
}
