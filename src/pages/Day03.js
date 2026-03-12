import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";

const Day03 = () => {
  const [favourites, setFavourites] = useState({});

  const images = [
    { id: "dXX-img1", src: "/images/dayXX-1.jpg", alt: "..." },
    { id: "dXX-img2", src: "/images/dayXX-2.jpg", alt: "..." },
  ];

  const toggleFavourite = (id) => {
    setFavourites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="day-page">
      <h2>Day 3 Reflection</h2>
      <p>Your reflection text for this day…</p>

      <PhotoGallery
        images={images}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />
    </div>
  );
};



export default Day03;
