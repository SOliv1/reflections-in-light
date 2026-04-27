import { useState, useEffect } from "react";
import "./DayImageCarousel.css";
import { fetchFromApi } from "../api";



const DayImageCarousel = () => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const response = await fetchFromApi("/api/gallery");
    const days = await response.json();

    // Collect all photos from all days
    const allPhotos = days.map(day => day.photoUrl).filter(Boolean);

    setImages(allPhotos);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="carousel">
      {images.map((src, i) => (
        <img key={i} src={src} alt="Day" />
      ))}
    </div>
  );
};

export default DayImageCarousel;
