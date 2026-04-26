import React, { useMemo, useState } from "react";
import "../styles/calendar.css";
import { Link } from "react-router-dom";
import { BIRTHDAY_DAY, BIRTHDAY_MONTH } from "../data/birthdayExperience";

const START_MONTH = new Date(2026, 0, 1);
const END_MONTH = new Date(2027, 11, 1);

function formatMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthOptions() {
  const options = [];
  const cursor = new Date(START_MONTH);

  while (cursor <= END_MONTH) {
    options.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return options;
}

function getInitialMonth() {
  const now = new Date();
  const clamped =
    now < START_MONTH
      ? START_MONTH
      : now > END_MONTH
      ? END_MONTH
      : new Date(now.getFullYear(), now.getMonth(), 1);

  return formatMonthKey(clamped);
}

function getSeasonClass(month) {
  if (month === 11 || month <= 1) return "season-winter";
  if (month >= 2 && month <= 4) return "season-spring";
  if (month >= 5 && month <= 7) return "season-summer";
  return "season-autumn";
}

// ⭐ MAIN CALENDAR COMPONENT
function Calendar({ season, isNight, weatherCondition, weatherMood, isHomePage }) {
  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const [currentMonthKey, setCurrentMonthKey] = useState(getInitialMonth);

  const activeMonth =
    monthOptions.find((option) => formatMonthKey(option) === currentMonthKey) ||
    monthOptions[0];

  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const seasonClass = getSeasonClass(month);
  const today = new Date();

  const tiles = [];

  // Empty tiles before month starts
  for (let i = 0; i < firstDay; i++) {
    tiles.push(<div key={`empty-${i}`} className="calendar-tile empty"></div>);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isoDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;

    tiles.push(
      <Link
        key={isoDate}
        to={`/day/${isoDate}`}
        className={`calendar-tile calendar-day
          ${isToday ? "today" : ""}
          ${weatherMood}
          ${month + 1 === BIRTHDAY_MONTH && day === BIRTHDAY_DAY ? "birthday" : ""}
        `}
      >
        <span className="day-number">{day}</span>
        {isToday && <span className="today-label">Today</span>}
        <span className="day-date-label">
          {date.toLocaleDateString("en-GB", { month: "short" })}
        </span>
      </Link>
    );
  }

  const currentIndex = monthOptions.findIndex(
    (option) => formatMonthKey(option) === formatMonthKey(activeMonth)
  );

  return (
    <div className={`calendar-wrapper ${seasonClass}`}>
      <div className={`app ${season} ${isNight ? "night" : "day"} ${weatherCondition}`}>

        <div className="calendar-header">
          <button
            className="calendar-nav calendar-nav-prev"
            type="button"
            onClick={() =>
              setCurrentMonthKey(formatMonthKey(monthOptions[currentIndex - 1]))
            }
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          {/* ⭐ HIDE MONTH/YEAR ON HOMEPAGE */}
          {!isHomePage && (
            <h2 className="calendar-title">
              {activeMonth.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          )}
          {isHomePage && <div className="calendar-title-spacer" aria-hidden="true" />}

          <button
            className="calendar-nav calendar-nav-next"
            type="button"
            onClick={() =>
              setCurrentMonthKey(formatMonthKey(monthOptions[currentIndex + 1]))
            }
            disabled={currentIndex === monthOptions.length - 1}
          >
            Next
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-grid">{tiles}</div>
        </div>

      </div>
    </div>
  );
}

export default Calendar;
