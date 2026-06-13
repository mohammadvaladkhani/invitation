import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Heart } from "lucide-react";
import { EmojiFace, type EmojiMood } from "./EmojiFace";
import { useMousePosition } from "../hooks/useMousePosition";
import { useRunawayButton } from "../hooks/useRunawayButton";

type QuestionOneProps = {
  onAccepted: () => void;
  onCelebrate: () => void;
  playChime: () => void;
};

const noAlternatives = ["نه!", "اصلاً!", "فکر نکن!", "نه دیگه!", "ولش کن!"];

const distanceToElement = (element: HTMLElement, x: number, y: number) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return Math.hypot(x - centerX, y - centerY);
};

export function QuestionOne({
  onAccepted,
  onCelebrate,
  playChime,
}: QuestionOneProps) {
  const pointer = useMousePosition();
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const [noText, setNoText] = useState("نه، نمی‌خوام 😤");
  const [mood, setMood] = useState<EmojiMood>("soft");
  const [accepted, setAccepted] = useState(false);
  const [yesIsHot, setYesIsHot] = useState(false);

  const handleEscape = useCallback((count: number) => {
    setNoText(noAlternatives[count % noAlternatives.length]);
  }, []);

  const { buttonRef: noButtonRef, escapeButton } = useRunawayButton({
    pointer,
    threshold: 120,
    minScale: 0.6,
    onEscape: handleEscape,
  });

  const magneticPoint = useMemo(() => ({ x: pointer.x, y: pointer.y }), [pointer]);

  useEffect(() => {
    if (accepted) {
      return;
    }

    const yesButton = yesButtonRef.current;
    const noButton = noButtonRef.current;
    const nearYes = yesButton
      ? distanceToElement(yesButton, magneticPoint.x, magneticPoint.y)
      : Number.POSITIVE_INFINITY;
    const nearNo = noButton
      ? distanceToElement(noButton, magneticPoint.x, magneticPoint.y)
      : Number.POSITIVE_INFINITY;

    if (nearYes < 150 && yesButton) {
      const rect = yesButton.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const pullX = Math.max(-30, Math.min(30, (magneticPoint.x - centerX) * 0.18));
      const pullY = Math.max(-24, Math.min(24, (magneticPoint.y - centerY) * 0.18));

      gsap.to(yesButton, {
        x: pullX,
        y: pullY,
        scale: 1.15,
        duration: 0.28,
        ease: "power2.out",
      });
      setMood("love");
      setYesIsHot(true);
      return;
    }

    if (nearNo < 145) {
      setMood("angry");
      setYesIsHot(false);
      return;
    }

    if (yesButton) {
      gsap.to(yesButton, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.34,
        ease: "power2.out",
      });
    }

    setMood("soft");
    setYesIsHot(false);
  }, [accepted, magneticPoint, noButtonRef]);

  const handleNoAttempt = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    escapeButton({ x: event.clientX, y: event.clientY });
  };

  const handleYesClick = () => {
    if (accepted) {
      return;
    }

    setAccepted(true);
    setMood("love");
    setYesIsHot(true);
    onCelebrate();
    playChime();

    const timeline = gsap.timeline();

    if (yesButtonRef.current) {
      timeline.to(yesButtonRef.current, {
        background: "linear-gradient(135deg, #facc15, #22c55e)",
        boxShadow: "0 0 42px rgba(250, 204, 21, 0.62)",
        scale: 1.2,
        duration: 0.34,
        ease: "back.out(2)",
      });
    }

    const face = document.querySelector("[data-emoji-face]");

    if (face) {
      timeline.to(
        face,
        {
          y: -24,
          scale: 1.1,
          yoyo: true,
          repeat: 5,
          duration: 0.22,
          ease: "sine.inOut",
        },
        0,
      );
    }

    window.setTimeout(onAccepted, 2500);
  };

  return (
    <section className="step-content question-one">
      <div className="copy-stack">
        <p className="kicker">سؤال اصلی</p>
        <h2>می‌خوای با من دیت بری؟</h2>
      </div>

      <div className="question-actions" aria-label="انتخاب پاسخ">
        <button
          className="choice-button choice-button--no"
          type="button"
          ref={noButtonRef}
          onPointerEnter={handleNoAttempt}
          onPointerDown={handleNoAttempt}
          onClick={(event) => event.preventDefault()}
        >
          {noText}
        </button>

        <button
          className={`choice-button choice-button--yes ${yesIsHot ? "is-hot" : ""}`}
          type="button"
          ref={yesButtonRef}
          onClick={handleYesClick}
          disabled={accepted}
        >
          <Heart aria-hidden="true" size={20} fill="currentColor" />
          آره! حتماً! 🥰
        </button>
      </div>

      <EmojiFace mood={mood} pointer={pointer} />
    </section>
  );
}
