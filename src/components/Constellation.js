// src/components/Constellation.js

import React from "react";
import './Constellation.css';


const Constellation = () => {
    return (
        <div className="constellation-container">
            <div className="star" style={{ top: '4%', left: '12%' }}></div>
            <div className="star" style={{ top: '6%', left: '28%' }}></div>
            <div className="star" style={{ top: '5%', left: '45%' }}></div>
            <div className="star" style={{ top: '7%', left: '62%' }}></div>
            <div className="star" style={{ top: '9%', left: '78%' }}></div>
            <div className="star" style={{ top: '12%', left: '35%' }}></div>
            <div className="star" style={{ top: '14%', left: '70%' }}></div>
             {/* ⭐ Twinkling stars & Shooting Star */}
            <div className="shooting-star"></div>
        </div>


    );
};

export default Constellation;
