import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";
import { Link } from "react-router-dom";

const Day02 = () => {
  const [favourites, setFavourites] = useState({});

  const images = [
    { id: "d02-img1", src: "/images/day02-1.jpg", alt: "..." },
    { id: "d02-img2", src: "/images/day02-2.jpg", alt: "..." },
  ];

  const toggleFavourite = (id) => {
    setFavourites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="day-page">
      <Link to="/" className="crescent-portal"></Link>

      <h2>Day 2 Reflection</h2>
      <p>Your reflection text for this day…</p>

      <PhotoGallery
        images={images}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />
    </div>
  );
};

export default Day02;
