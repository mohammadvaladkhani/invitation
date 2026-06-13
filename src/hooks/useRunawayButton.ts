import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import type { PointerPosition } from "./useMousePosition";

type RunawayButtonOptions = {
  pointer: PointerPosition;
  threshold?: number;
  minScale?: number;
  onEscape?: (escapeCount: number) => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export function useRunawayButton({
  pointer,
  threshold = 120,
  minScale = 0.6,
  onEscape,
}: RunawayButtonOptions) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const escapeCountRef = useRef(0);
  const lastEscapeRef = useRef(0);

  const escapeButton = useCallback(
    (source: PointerPosition = pointer) => {
      const button = buttonRef.current;

      if (!button) {
        return;
      }

      const now = window.performance.now();

      if (now - lastEscapeRef.current < 160) {
        return;
      }

      lastEscapeRef.current = now;
      escapeCountRef.current += 1;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = centerX - source.x || (Math.random() > 0.5 ? 1 : -1);
      const deltaY = centerY - source.y || (Math.random() > 0.5 ? 1 : -1);
      const length = Math.hypot(deltaX, deltaY) || 1;
      const awayX = deltaX / length;
      const awayY = deltaY / length;
      const jump = 112 + Math.random() * 64;
      const jitterX = (Math.random() - 0.5) * 54;
      const jitterY = (Math.random() - 0.5) * 54;
      const padding = 14;

      const targetLeft = clamp(
        rect.left + awayX * jump + jitterX,
        padding,
        window.innerWidth - rect.width - padding,
      );
      const targetTop = clamp(
        rect.top + awayY * jump + jitterY,
        padding,
        window.innerHeight - rect.height - padding,
      );

      const nextX = offsetRef.current.x + targetLeft - rect.left;
      const nextY = offsetRef.current.y + targetTop - rect.top;
      const nextScale = Math.max(
        minScale,
        1 - Math.min(escapeCountRef.current, 7) * 0.065,
      );

      offsetRef.current = { x: nextX, y: nextY };
      scaleRef.current = nextScale;

      gsap.to(button, {
        x: nextX,
        y: nextY,
        scale: nextScale,
        rotate: (Math.random() - 0.5) * 8,
        duration: 0.42,
        ease: "power2.out",
      });

      onEscape?.(escapeCountRef.current);
    },
    [minScale, onEscape, pointer],
  );

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY);

    if (distance < threshold) {
      escapeButton(pointer);
    }
  }, [escapeButton, pointer, threshold]);

  return {
    buttonRef,
    escapeButton,
  };
}
