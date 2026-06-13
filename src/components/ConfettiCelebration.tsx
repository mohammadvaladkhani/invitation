import { useEffect } from "react";
import confetti from "canvas-confetti";

type ConfettiCelebrationProps = {
  burstKey: number;
};

export function ConfettiCelebration({ burstKey }: ConfettiCelebrationProps) {
  useEffect(() => {
    if (!burstKey) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    confetti({
      particleCount: 90,
      spread: 80,
      startVelocity: 42,
      scalar: 0.92,
      origin: { x: 0.5, y: 0.42 },
    });

    const interval = window.setInterval(() => {
      confetti({
        particleCount: 14,
        angle: 58,
        spread: 68,
        startVelocity: 48,
        origin: { x: 0, y: 0.72 },
      });

      confetti({
        particleCount: 14,
        angle: 122,
        spread: 68,
        startVelocity: 48,
        origin: { x: 1, y: 0.72 },
      });
    }, 170);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 2500);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [burstKey]);

  return null;
}
