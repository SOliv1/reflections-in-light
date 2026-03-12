import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";
import PhotoTile from "../components/PhotoTile";
import { Link } from "react-router-dom";

const Day05 = () => {
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
      <Link to="/" className="crescent-portal"></Link>
      <h2>Day 5 Reflection</h2>
      <p>Your reflection text for this day…</p>

      <PhotoGallery
        images={images}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />
    </div>
  );
};


export default Day05;
