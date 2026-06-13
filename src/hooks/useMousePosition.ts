import { useEffect, useState } from "react";

export type PointerPosition = {
  x: number;
  y: number;
};

const getInitialPosition = (): PointerPosition => {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
};

export function useMousePosition(): PointerPosition {
  const [position, setPosition] = useState<PointerPosition>(getInitialPosition);

  useEffect(() => {
    const updateFromPointer = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const updateFromTouch = (event: TouchEvent) => {
      const touch = event.touches[0] ?? event.changedTouches[0];

      if (touch) {
        setPosition({ x: touch.clientX, y: touch.clientY });
      }
    };

    window.addEventListener("pointermove", updateFromPointer, { passive: true });
    window.addEventListener("pointerdown", updateFromPointer, { passive: true });
    window.addEventListener("touchmove", updateFromTouch, { passive: true });
    window.addEventListener("touchstart", updateFromTouch, { passive: true });

    return () => {
      window.removeEventListener("pointermove", updateFromPointer);
      window.removeEventListener("pointerdown", updateFromPointer);
      window.removeEventListener("touchmove", updateFromTouch);
      window.removeEventListener("touchstart", updateFromTouch);
    };
  }, []);

  return position;
}
