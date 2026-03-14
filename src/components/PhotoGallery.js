import { useState } from "react";
import PhotoTile from "./PhotoTile";
import "./PhotoGallery.css";

const PhotoGallery = ({ images, favourites, toggleFavourite, season }) => {

  const [expandedPhoto, setExpandedPhoto] = useState(null);

  return (
    <>
      <div className="photo-grid">
        {images.map((img) => (
          <PhotoTile
        key={img.id}
        img={img}
        isFavourite={favourites[img.id]}
        onToggle={() => toggleFavourite(img.id)}
        onClick={() => setExpandedPhoto(img.src)}
        season={season}
    />

        ))}
      </div>

      {expandedPhoto && (
        <div className="photo-modal" onClick={() => setExpandedPhoto(null)}>
          <img src={expandedPhoto} alt="Expanded" />
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
