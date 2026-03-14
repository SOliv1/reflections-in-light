// src/pages/Day01.js
import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";
import { Link } from "react-router-dom";
import { Portal } from "../components/Portal/Portal";

const Day17 = () => {
  const [favourites, setFavourites] = useState({});
  const [mood, setMood] = useState(null);

 // ✔ Test images reinstated
  const images = [
    { id: "test1", src: "https://picsum.photos/300?random=1", alt: "Test image 1" },
    { id: "test2", src: "https://picsum.photos/300?random=2", alt: "Test image 2" },
    { id: "test3", src: "https://picsum.photos/300?random=3", alt: "Test image 3" },
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

      <h2>Day 17 Reflection</h2>
      <p>Soft morning light on the water…</p>

      {/* 🌤️ SEASONAL PORTAL */}
      <div className="seasonal-portal">
        <div className="seasonal-portal-heading">
          <div className="seasonal-portal-line">The Light Awaits</div>
        </div>
      </div>

      <Portal
        type="seasonal"
        dayIndex={17}
        season="winter"
        mood={mood}
        cueText="Enter"
      />

      <PhotoGallery
        images={images}
        favourites={favourites}
        toggleFavourite={toggleFavourite}
        season="winter"
      />


      {/* Mood picker stays — this is fine */}
      <div className="mood-picker">
        <button onClick={() => setMood("calm")}>Calm</button>
        <button onClick={() => setMood("warm")}>Warm</button>
        <button onClick={() => setMood("bright")}>Bright</button>
        <button onClick={() => setMood("reflective")}>Reflective</button>
        <button onClick={() => setMood("playful")}>Playful</button>
      </div>

      {mood && <p className="mood-label">Mood: {mood}</p>}

    </div>
  );
};

export default Day17;
