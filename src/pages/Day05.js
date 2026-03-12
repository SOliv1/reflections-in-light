import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";
import PhotoTile from "../components/PhotoTile";
import { Link } from "react-router-dom";
import { Portal } from "../components/Portal/Portal";

const Day05 = () => {
  const [favourites, setFavourites] = useState({});

  const images = [
    { id: "test5", src: "https://picsum.photos/300", alt: "Test image" },
    { id: "d1-img1", src: "/images/day01-1.jpg", alt: "Morning light" },
    { id: "d1-img2", src: "/images/day01-2.jpg", alt: "Soft reflections" },
    { id: "d1-img3", src: "/images/day01-3.jpg", alt: "Warm glow" },
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
