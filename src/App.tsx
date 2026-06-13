import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Volume2, VolumeX } from "lucide-react";
import { ConfettiCelebration } from "./components/ConfettiCelebration";
import { Landing } from "./components/Landing";
import { QuestionOne } from "./components/QuestionOne";
import { QuestionTwo } from "./components/QuestionTwo";
import {
  activityOptions,
  QuestionThree,
  type ActivityOption,
} from "./components/QuestionThree";
import { ThankYou } from "./components/ThankYou";

type Step = 0 | 1 | 2 | 3 | 4;

type Answers = {
  answer_q1: "بله" | "";
  selected_date: string;
  selected_time: string;
  date_activity: string;
};

const particles = [
  { x: 8, y: 18, delay: -1, duration: 14 },
  { x: 16, y: 72, delay: -5, duration: 18 },
  { x: 24, y: 38, delay: -8, duration: 16 },
  { x: 34, y: 82, delay: -2, duration: 13 },
  { x: 43, y: 12, delay: -6, duration: 17 },
  { x: 54, y: 58, delay: -9, duration: 15 },
  { x: 66, y: 26, delay: -3, duration: 19 },
  { x: 72, y: 74, delay: -7, duration: 16 },
  { x: 83, y: 42, delay: -4, duration: 18 },
  { x: 92, y: 20, delay: -10, duration: 14 },
  { x: 12, y: 48, delay: -11, duration: 20 },
  { x: 88, y: 86, delay: -12, duration: 17 },
];

const buildFormspreeEndpoint = () => {
  const rawValue = import.meta.env.VITE_FORMSPREE_ID?.trim();

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  return `https://formspree.io/f/${rawValue}`;
};

const createChimeDataUri = () => {
  const sampleRate = 22050;
  const duration = 2.8;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Int16Array(totalSamples);
  const notes = [
    { start: 0, duration: 0.38, frequency: 523.25, gain: 0.38 },
    { start: 0.2, duration: 0.42, frequency: 659.25, gain: 0.34 },
    { start: 0.46, duration: 0.5, frequency: 783.99, gain: 0.32 },
    { start: 0.86, duration: 0.66, frequency: 1046.5, gain: 0.28 },
    { start: 1.35, duration: 0.8, frequency: 880, gain: 0.2 },
  ];

  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / sampleRate;
    let value = 0;

    for (const note of notes) {
      const localTime = time - note.start;

      if (localTime >= 0 && localTime <= note.duration) {
        const attack = Math.min(localTime / 0.035, 1);
        const release = Math.min((note.duration - localTime) / 0.24, 1);
        const envelope = Math.max(0, Math.min(attack, release));
        const fundamental = Math.sin(2 * Math.PI * note.frequency * localTime);
        const shimmer = Math.sin(2 * Math.PI * note.frequency * 2 * localTime) * 0.22;

        value += (fundamental + shimmer) * note.gain * envelope;
      }
    }

    samples[index] = Math.max(-1, Math.min(1, value)) * 32767;
  }

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;

  for (const sample of samples) {
    view.setInt16(offset, sample, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return `data:audio/wav;base64,${window.btoa(binary)}`;
};

function App() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>({
    answer_q1: "",
    selected_date: "",
    selected_time: "",
    date_activity: "",
  });
  const [selectedActivity, setSelectedActivity] = useState<ActivityOption | null>(
    null,
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const transitioningRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(createChimeDataUri());
    audioRef.current.volume = 0.46;
  }, []);

  useLayoutEffect(() => {
    const shell = stageRef.current?.querySelector(".step-shell");

    if (!shell) {
      return;
    }

    gsap.fromTo(
      shell,
      { opacity: 0, scale: 1.04, filter: "blur(14px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.78,
        ease: "power3.out",
      },
    );
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      setConfettiKey((key) => key + 1);
    }
  }, [step]);

  const playChime = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || isMuted) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, [isMuted]);

  const celebrate = useCallback(() => {
    setConfettiKey((key) => key + 1);
  }, []);

  const transitionTo = useCallback(
    (nextStep: Step) => {
      if (transitioningRef.current || nextStep === step) {
        return;
      }

      const shell = stageRef.current?.querySelector(".step-shell");

      if (!shell) {
        setStep(nextStep);
        return;
      }

      transitioningRef.current = true;

      gsap.to(shell, {
        opacity: 0,
        scale: 0.94,
        filter: "blur(12px)",
        duration: 0.42,
        ease: "power3.inOut",
        onComplete: () => {
          setStep(nextStep);
          window.requestAnimationFrame(() => {
            transitioningRef.current = false;
          });
        },
      });
    },
    [step],
  );

  const submitAnswers = async () => {
    if (!selectedActivity) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const endpoint = buildFormspreeEndpoint();

    if (!endpoint) {
      setSubmitError("شناسه Formspree تنظیم نشده. مقدار VITE_FORMSPREE_ID را اضافه کن.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      answer_q1: answers.answer_q1 || "بله",
      selected_date: answers.selected_date,
      selected_time: answers.selected_time,
      date_activity: selectedActivity.shortLabel,
      submitted_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      setAnswers((current) => ({
        ...current,
        date_activity: selectedActivity.shortLabel,
      }));
      transitionTo(4);
    } catch {
      setSubmitError("ارسال انجام نشد. لطفاً اینترنت یا تنظیمات فرم را بررسی کن.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Landing onStart={() => transitionTo(1)} />;
      case 1:
        return (
          <QuestionOne
            onAccepted={() => {
              setAnswers((current) => ({ ...current, answer_q1: "بله" }));
              transitionTo(2);
            }}
            onCelebrate={celebrate}
            playChime={playChime}
          />
        );
      case 2:
        return (
          <QuestionTwo
            onConfirm={({ date, time }) => {
              setAnswers((current) => ({
                ...current,
                selected_date: date,
                selected_time: time,
              }));
              transitionTo(3);
            }}
          />
        );
      case 3:
        return (
          <QuestionThree
            selectedId={selectedActivity?.id ?? null}
            isSubmitting={isSubmitting}
            error={submitError}
            onSelect={(activity) => {
              setSelectedActivity(activity);
              setSubmitError(null);
            }}
            onSubmit={submitAnswers}
          />
        );
      case 4:
        return <ThankYou />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell" data-step={step}>
      <div className="aurora-layer" aria-hidden="true" />
      <div className="particle-field" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={`${particle.x}-${particle.y}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <button
        className="mute-toggle"
        type="button"
        onClick={() => setIsMuted((current) => !current)}
        aria-label={isMuted ? "روشن کردن صدا" : "قطع کردن صدا"}
        title={isMuted ? "روشن کردن صدا" : "قطع کردن صدا"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <ConfettiCelebration burstKey={confettiKey} />

      <main className="stage" ref={stageRef}>
        <div className="step-shell" key={step}>
          {renderStep()}
        </div>
      </main>

      <div className="step-dots" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((dot) => (
          <span
            className={dot === step ? "is-active" : ""}
            key={dot}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
