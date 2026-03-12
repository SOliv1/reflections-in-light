// src/pages/Day01.js
import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";

const Day01 = () => {
  const [favourites, setFavourites] = useState({});

  const images = [
    { id: "d1-img1", src: "/images/day01-1.jpg", alt: "Morning light" },
    { id: "d1-img2", src: "/images/day01-2.jpg", alt: "Soft reflections" },
    { id: "d1-img3", src: "/images/day01-3.jpg", alt: "Warm glow" },
  ];

  const toggleFavourite = (id) => {
    setFavourites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="day-page">
      <h2>Day 1 Reflection</h2>
      <p>Soft morning light on the water…</p>

      <PhotoGallery
        images={images}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />
    </div>
  );
};

export default Day01;
