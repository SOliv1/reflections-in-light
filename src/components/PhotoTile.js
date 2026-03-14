const PhotoTile = ({ img, onClick, isFavourite, onToggle, season }) => {
  const seasonalGlow = {
    winter: "#7fc8ff",
    spring: "#ff8fb1",
    summer: "#ffd700",
    autumn: "#ffb36b",
  };

  const glow = seasonalGlow[season] || "#ffd700"; // fallback gold

  return (
    <div className="photo-tile" onClick={onClick}>
      <img src={img.src} alt={img.alt} />

      <button
        className="photo-tile-heart"
        style={{
          background: isFavourite ? glow : "rgba(0,0,0,0.35)",
          color: isFavourite ? "red" : "rgba(255,255,255,0.8)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {isFavourite ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default PhotoTile;
