import { useRef } from "react";

export default function PhotoTile({
  photo,
  img = photo,          // fallback for older props
  onClick,
  isFavourite,
  onToggle,
  season,
  onDelete,
  onApproachPortal
}) {
  const tileRef = useRef(null);

  const seasonalGlow = {
    winter: "#7fc8ff",
    spring: "#ff8fb1",
    summer: "#ffd700",
    autumn: "#ffb36b",
  };

  const glow = seasonalGlow[season] || "#ffd700";

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!tileRef.current) return;

    tileRef.current.classList.add("photo-glow");

    setTimeout(() => {
      onDelete(photo.id);
    }, 180);
  };

  const handleImageError = (e) => {
    e.currentTarget.alt = "Image unavailable";
    e.currentTarget.closest(".photo-tile")?.classList.add("photo-tile--error");
  };

  return (
    <div
      ref={tileRef}
      className="photo-tile"

      // ⭐ HOVER — soft awareness glow + colour invitation
      onMouseEnter={() => {
        if (onApproachPortal) {
          onApproachPortal(photo);
        }
        document.body.classList.add("portal-hovering");
      }}

      onMouseLeave={() => {
        document.body.classList.remove("portal-hovering");
      }}

      // ⭐ CLICK — dramatic glow, then modal opens after 350ms
      onClick={(e) => {
        // First: notify the Portal immediately
        if (onApproachPortal) {
          onApproachPortal(photo);
        }

        // Then: delay the modal so the glow is visible
        if (onClick) {
          setTimeout(() => onClick(e), 350);
        }
      }}
    >

      <img
        src={img.src}
        alt={img.alt}
        className="photo-tile-image"
        loading="lazy"
        decoding="async"
        draggable="false"
        onError={handleImageError}
      />

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

      <button
        className="photo-delete-btn"
        onClick={handleDelete}
        aria-label="Move photo to basket"
        title="Move to basket"
      >
        🧺
      </button>
    </div>
  );
}
