// src/components/PhotoTile.js
import React from "react";
import "./PhotoTile.css";

const PhotoTile = ({ src, alt, isFavourite, onToggleFavourite }) => {
  return (
    <div className="photo-tile">
      <button
        className={`photo-tile-heart ${isFavourite ? "favourite" : ""}`}
        onClick={onToggleFavourite}
        aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      >
        ♥
      </button>
      <img src={src} alt={alt} className="photo-tile-image" />
    </div>
  );
};

export default PhotoTile;
