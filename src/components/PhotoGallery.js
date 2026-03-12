// src/components/PhotoGallery.js
import React from "react";
import PhotoTile from "./PhotoTile";
import "./PhotoGallery.css";

const PhotoGallery = ({ images, favourites, onToggleFavourite }) => {
  return (
    <div className="photo-gallery">
      {images.map((img) => (
        <PhotoTile
          key={img.id}
          src={img.src}
          alt={img.alt}
          isFavourite={!!favourites[img.id]}
          onToggleFavourite={() => onToggleFavourite(img.id)}
        />
      ))}
    </div>
  );
};

export default PhotoGallery;
