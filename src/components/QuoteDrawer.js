export default function QuoteDrawer({ quote, orbColor }) {
  if (!quote) return null;
  const orbRGB = orbColor.replace("rgb(", "").replace(")", "");

  return (
    <div
      className="quote-drawer-content short-reflections-drawer"
      style={{
        "--orbColor": orbColor,
        "--orbColorRGB": orbRGB
      }}
    >
      <h3 className="drawer-eyebrow">Quote of the Day</h3>
      <p className="drawer-quote">“{quote.quote}”</p>
      <p className="drawer-author">~ {quote.person} ~</p>
    </div>
  );
}
