import { Heart, Sparkles } from "lucide-react";

export function ThankYou() {
  return (
    <section className="step-content thank-you">
      <div className="success-mark" aria-hidden="true">
        <Heart size={44} fill="currentColor" />
      </div>

      <div className="copy-stack">
        <p className="kicker">
          <Sparkles aria-hidden="true" size={18} />
          ثبت شد
        </p>
        <h2>ممنون! خیلی خوشحالم 🎉</h2>
        <p className="lead">به زودی باهات تماس می‌گیرم 💕</p>
      </div>
    </section>
  );
}
