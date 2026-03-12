import React from "react";
import "../styles/calendar.css";
import { Link } from "react-router-dom";


const Calendar =() => {
    const year = 2026;
    const month = 0; // July (0 = Jan, 6 = July)

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const tiles = [];

    //Empty tiles before the 1st
    for (let i = 0; i < firstDay; i++) {
        tiles.push(<div key={"empty-" + i} className="calendar-tile empty"></div>);
    }

    //Actual days
    for (let day = 1; day  <= daysInMonth; day++) {
      tiles.push(
        <div key={day} className="calendar-tile">
            <span className="day-number">DAY {day}</span>
            <Link to="/day01" className="calendar-day">1</Link>
            <Link to="/day02" className="calendar-day">2</Link>
            <Link to="/day03" className="calendar-day">3</Link>

        </div>

        );
    }

    return (
     <div className="calendar-wrapper">
        <h2 className="calendar-title">Summer Reflections, July 2026</h2>

        <div className="calendar-container">
            <div className="calendar-grid">{tiles}</div>
        </div>
     </div>

    );
};


export default Calendar;