// src/pages/Day01.js
import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";
//import PhotoTile from "../components/PhotoTile";
import { Link } from "react-router-dom";
import { Portal } from "../components/Portal/Portal";

const Day01 = () => {
  const [favourites, setFavourites] = useState({});

  const images = [
    { id: "test1", src: "https://picsum.photos/300", alt: "Test image" },
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

  const [mood, setMood] = useState(null);


  return (
    <div className="day-page">
      <Link to="/" className="crescent-portal"></Link>
      <Portal
        dayIndex={3}
        season="spring"
        mood="calm"
        cueText="Enter"
      />

      {/*<Portal dayIndex={1} season="winter" /> */}


      <h2>Day 1 Reflection</h2>
      <p>Soft morning light on the water…</p>

      {/* 🌙 INSERT THE PORTAL RIGHT HERE */}
      <div className="veil-portal">
        <div className="veil-portal-heading">
          <div className="veil-portal-line veil-portal-line-primary">Lift the Veil</div>
          <div className="veil-portal-line veil-portal-line-secondary">The Doorway Opens</div>
          <div className="veil-portal-line veil-portal-line-subtle">The Light Awaits</div>
        </div>

        <div className="mood-picker">
        <button onClick={() => setMood("calm")}>Calm</button>
        <button onClick={() => setMood("warm")}>Warm</button>
        <button onClick={() => setMood("bright")}>Bright</button>
        <button onClick={() => setMood("reflective")}>Reflective</button>
        <button onClick={() => setMood("playful")}>Playful</button>
      </div>
        <button className="veil-portal-door"></button>
       {/*<Portal
          dayIndex={dayNumber}
          season={season}
          mood={mood}
          cueText="Enter"
        /> */}

        {mood &&
        <p className="mood-label">Mood: {mood}</p>
        }


      </div>
      {/* 🌙 END OF PORTAL */}

      <PhotoGallery
        images={images}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />
    </div>
  );
};

export default Day01;
