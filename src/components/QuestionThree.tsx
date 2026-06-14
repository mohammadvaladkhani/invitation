import { Check, Loader2, Send } from "lucide-react";

export type ActivityOption = {
  id: string;
  emoji: string;
  label: string;
  shortLabel: string;
};

type QuestionThreeProps = {
  selectedId: string | null;
  isSubmitting: boolean;
  error: string | null;
  onSelect: (activity: ActivityOption) => void;
  onSubmit: () => void;
};

export const activityOptions: ActivityOption[] = [
  {
    id: "cafe",
    emoji: "☕",
    label: "بریم کافه و حرف بزنیم",
    shortLabel: "کافه",
  },
  {
    id: "park",
    emoji: "🌳",
    label: "قدم زدن توی پارک",
    shortLabel: "پارک",
  },
  {
    id: "sport",
    emoji: "🏃",
    label: "بریم کوه😁",
    shortLabel: "یا یه فعالیت ورزشی دیگه",
  },
  {
    id: "dinner",
    emoji: "🍽️",
    label: "بریم غذا بخوریم",
    shortLabel: "غذا",
  },
  {
    id: "movie",
    emoji: "🎬",
    label: "سینما، کنسرت یا اجرای زنده",
    shortLabel: "فیلم",
  },
  {
    id: "night-walk",
    emoji: "🤷‍♂️",
    label: "هیچ کودوم! خودم بهت میگم کجا بریم🙂",
    shortLabel: "هر جا که تو دوست داری",
  },
];

export function QuestionThree({
  selectedId,
  isSubmitting,
  error,
  onSelect,
  onSubmit,
}: QuestionThreeProps) {
  return (
    <section className="step-content question-three">
      <div className="copy-stack">
        <p className="kicker">خب حالا کجا بریم؟</p>
        <h2>دوست داری چجوری وقت بگذرونیم؟ 🎯</h2>
      </div>

      <div className="activity-grid">
        {activityOptions.map((activity) => {
          const isSelected = activity.id === selectedId;

          return (
            <button
              className={`activity-card ${isSelected ? "is-selected" : ""}`}
              key={activity.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(activity)}
            >
              <span className="activity-card__emoji" aria-hidden="true">
                {activity.emoji}
              </span>
              <span className="activity-card__label">{activity.label}</span>
              <span className="activity-card__check" aria-hidden="true">
                <Check size={16} />
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="primary-cta submit-cta"
        type="button"
        disabled={!selectedId || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? (
          <Loader2 className="spin" aria-hidden="true" size={20} />
        ) : (
          <Send aria-hidden="true" size={20} />
        )}
        {isSubmitting ? "در حال ارسال..." : "ارسال پاسخ‌ها 💌"}
      </button>
    </section>
  );
}
