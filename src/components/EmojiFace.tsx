import { useEffect, useRef } from "react";
import type { PointerPosition } from "../hooks/useMousePosition";

export type EmojiMood = "soft" | "angry" | "love";

type EmojiFaceProps = {
  mood: EmojiMood;
  pointer: PointerPosition;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export function EmojiFace({ mood, pointer }: EmojiFaceProps) {
  const faceRef = useRef<HTMLDivElement | null>(null);
  const leftPupilRef = useRef<HTMLSpanElement | null>(null);
  const rightPupilRef = useRef<HTMLSpanElement | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const face = faceRef.current;

    if (!face) {
      return;
    }

    const rect = face.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = pointer.x - centerX;
    const deltaY = pointer.y - centerY;

    targetRef.current = {
      x: clamp(deltaX / rect.width, -0.25, 0.25) * 26,
      y: clamp(deltaY / rect.height, -0.2, 0.2) * 22,
    };
  }, [pointer]);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      currentRef.current = {
        x: currentRef.current.x + (targetRef.current.x - currentRef.current.x) * 0.16,
        y: currentRef.current.y + (targetRef.current.y - currentRef.current.y) * 0.16,
      };

      const transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;

      if (leftPupilRef.current) {
        leftPupilRef.current.style.transform = transform;
      }

      if (rightPupilRef.current) {
        rightPupilRef.current.style.transform = transform;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`emoji-face emoji-face--${mood}`}
      ref={faceRef}
      data-emoji-face
      role="img"
      aria-label={
        mood === "love"
          ? "چهره خوشحال"
          : mood === "angry"
            ? "چهره اخمو"
            : "چهره مهربان"
      }
    >
      <span className="emoji-face__shine" />
      <span className="emoji-face__brow emoji-face__brow--left" />
      <span className="emoji-face__brow emoji-face__brow--right" />
      <span className="emoji-face__eye emoji-face__eye--left">
        <span ref={leftPupilRef} />
      </span>
      <span className="emoji-face__eye emoji-face__eye--right">
        <span ref={rightPupilRef} />
      </span>
      <span className="emoji-face__mouth" />
      <span className="emoji-face__heart emoji-face__heart--one">♥</span>
      <span className="emoji-face__heart emoji-face__heart--two">♥</span>
    </div>
  );
}
