import { useEffect, useMemo } from "react";
import { quotes } from "../data/quotes";
import "./DailyQuote.css";

const VEIL_CLASS_MAP = {
  on: "veil-on",
  lift: "veil-lift",
  off: "veil-off",
};

export default function DailyQuote({
  veilMode = "off",
  weatherMood = "neutral",
  onQuoteReady,
}) {
  const veilClassName = VEIL_CLASS_MAP[veilMode] || "veil-off";

  const quoteOfTheDay = useMemo(() => {
    const today = new Date();
    const index = (today.getDate() - 1) % quotes.length;
    return quotes[index];
  }, []);

  useEffect(() => {
    if (onQuoteReady && quoteOfTheDay) {
      onQuoteReady(quoteOfTheDay);
    }
  }, [onQuoteReady, quoteOfTheDay]);

  return (
    <div className={`daily-quote-stage ${veilClassName}`}>
      <div className={`daily-quote-track ${veilClassName} mood-${weatherMood || "neutral"}`}>
        <p className="quote-eyebrow">Quote of the day</p>
        <figure
          className={`daily-quote whisper ${veilClassName} mood-${weatherMood || "neutral"}`}
          aria-label="Daily quote"
        >
          <blockquote className="quote-text">
            <span className="quote-mark">"</span>
            {quoteOfTheDay.quote}
            <span className="quote-mark">"</span>
          </blockquote>
          <figcaption className="quote-person">By {quoteOfTheDay.person}</figcaption>
        </figure>
      </div>
    </div>
  );
}
