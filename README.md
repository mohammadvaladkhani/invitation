# Date Invitation

یک وب‌سایت تک‌صفحه‌ای React + Vite + TypeScript برای دعوت رمانتیک، موبایل‌محور و آماده اشتراک در Bale.

## امکانات

- جریان چهار مرحله‌ای با انیمیشن‌های GSAP
- دکمه «نه» فراری و دکمه «آره» مغناطیسی
- چهره ایموجی با چشم‌های دنبال‌کننده اشاره‌گر
- تقویم جلالی و انتخاب ساعت با `react-multi-date-picker`
- افکت جشن با `canvas-confetti`
- چایم کوتاه HTML5 Audio با کنترل قطع و وصل صدا
- ارسال پاسخ نهایی به Formspree
- آماده دیپلوی روی Vercel

## اجرا در لوکال

```bash
npm install
npm run dev
```

## تنظیم Formspree

یک فرم رایگان در Formspree بسازید و مقدار ID فرم را در فایل `.env` قرار دهید:

```bash
VITE_FORMSPREE_ID=your_formspree_form_id
```

اگر ترجیح می‌دهید آدرس کامل endpoint را بدهید، همین متغیر می‌تواند URL کامل هم باشد:

```bash
VITE_FORMSPREE_ID=https://formspree.io/f/your_form_id
```

## دیپلوی روی Vercel

1. پروژه را در یک ریپازیتوری Git قرار دهید.
2. در Vercel گزینه Import Project را بزنید.
3. Framework را Vite بگذارید.
4. متغیر محیطی `VITE_FORMSPREE_ID` را در Project Settings اضافه کنید.
5. دیپلوی را انجام دهید و لینک نهایی را در Bale ارسال کنید.

همه ابزارها و کتابخانه‌های استفاده‌شده رایگان و متن‌باز هستند.
