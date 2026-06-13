import { Sparkles } from "lucide-react";

type LandingProps = {
  onStart: () => void;
};

export function Landing({ onStart }: LandingProps) {
  return (
    <section className="step-content landing">
      <div className="copy-stack">
        <p className="kicker">دعوت‌نامه کوچیک، نتیجه بزرگ</p>
        <h1>یه سؤال خیلی مهم دارم... آماده‌ای؟</h1>
        <p className="lead">
          فقط چند ثانیه وقتت رو می‌گیرم، قول می‌دم ارزشش رو داره 😊
        </p>
      </div>

      <button className="primary-cta" type="button" onClick={onStart}>
        <Sparkles aria-hidden="true" size={22} />
        بزن بریم!
      </button>
    </section>
  );
}
