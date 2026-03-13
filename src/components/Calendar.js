import React from "react";
import "../styles/calendar.css";
import { Link } from "react-router-dom";


const Calendar =() => {
    const year = 2026;
    const month = 0; // July (0 = Jan, 6 = July)

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();


    const getSeasonClass = (month) => {
        if (month === 11 || month <= 1) return "season-winter";
        if (month >= 2 && month <= 4) return "season-spring";
        if (month >= 5 && month <= 7) return "season-summer";
        return "season-autumn";
    };

    const seasonClass = getSeasonClass(month);

    const tiles = [];

    //Empty tiles before the 1st
    for (let i = 0; i < firstDay; i++) {
        tiles.push(<div key={"empty-" + i} className="calendar-tile empty"></div>);
    }

    const today = new Date();

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
    const padded = String(day).padStart(2, "0");

    // compute "today" INSIDE the loop
    const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;

    tiles.push(
        <Link
        key={day}
        to={`/day${padded}`}
        className={`calendar-tile ${isToday ? "today" : ""}`}
        >
        <span className="day-number">DAY {day}</span>
        </Link>
    );
}

     return (
       <div className={`calendar-wrapper ${seasonClass}`}>



        <h2 className="calendar-title">Summer Reflections, July 2026</h2>

        <div className="calendar-container">
            <div className="calendar-grid">{tiles}</div>
        </div>
     </div>

    );
};


export default Calendar;