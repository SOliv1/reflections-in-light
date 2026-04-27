
export default function QuoteDrawer({ quote,orbColor, onClose,children }) {
  if (!quote) return null;
    const orbRGB = orbColor.replace("rgb(", "").replace(")", "");

  return (
    <div className="quote-drawer-content">
      <div
        className="short-reflections-drawer"
        style={{
          '--orbColor': orbColor,
          '--orbColorRGB': orbRGB
        }}
      >
        {children}
      </div>

      <h3 className="drawer-eyebrow">Quote of the Day</h3>
      <p className="drawer-quote">“{quote.quote}”</p>
      <p className="drawer-author">~ {quote.person} ~</p>
    </div>
  );
}
