export default function QuotePanel({ season }) {
  return (
    <div className={`panel quote-panel season-glow-${season}`}>
      <p className="quote-text fade-in">
        “In the quiet, the world reveals its gentleness.”
      </p>
      <p className="quote-attribution fade-in delay-1">— Unknown</p>
    </div>
  );
}
