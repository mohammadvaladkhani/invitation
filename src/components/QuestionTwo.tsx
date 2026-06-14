import { useMemo, useState } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { CalendarDays, Check } from "lucide-react";

type QuestionTwoProps = {
  onConfirm: (answer: { date: string; time: string }) => void;
};

export function QuestionTwo({ onConfirm }: QuestionTwoProps) {
  const [value, setValue] = useState<DateObject | null>(null);
  const minDate = useMemo(
    () => new DateObject({ calendar: persian, locale: persianFa }),
    [],
  );

  const selectedDate = value?.format("YYYY/MM/DD") ?? "";
  const selectedTime = value?.format("HH:mm") ?? "";
  const canConfirm = Boolean(value && selectedDate && selectedTime);

  return (
    <section className="step-content question-two">
      <div className="copy-stack">
        <p className="kicker">قرارمون کی باشه؟</p>
        <h2>کی دوست داری ببینیم همو؟ 📅</h2>
        <p className="lead">
          یه روز و ساعت انتخاب کن که برات راحت باشه
        </p>
      </div>

      <div className="picker-card">
        <label className="field-label" htmlFor="date-picker">
          <CalendarDays aria-hidden="true" size={20} />
          تاریخ و ساعت
        </label>

        <DatePicker
          id="date-picker"
          value={value}
          onChange={(nextValue) => {
            if (Array.isArray(nextValue)) {
              setValue(nextValue[0] ?? null);
              return;
            }

            setValue(nextValue as DateObject | null);
          }}
          calendar={persian}
          locale={persianFa}
          minDate={minDate}
          calendarPosition="bottom-right"
          format="YYYY/MM/DD HH:mm"
          inputClass="date-input"
          containerClassName="date-container"
          placeholder="انتخاب روز و ساعت"
          editable={false}
          plugins={[
            <TimePicker key="time-picker" position="bottom" hideSeconds />,
          ]}
        />

        <p className="selection-preview" aria-live="polite">
          {value
            ? `${selectedDate}، ساعت ${selectedTime}`
            : "هنوز زمانی انتخاب نشده"}
        </p>
      </div>

      <button
        className="primary-cta"
        type="button"
        disabled={!canConfirm}
        onClick={() => onConfirm({ date: selectedDate, time: selectedTime })}
      >
        <Check aria-hidden="true" size={20} />
        تأیید
      </button>
    </section>
  );
}
