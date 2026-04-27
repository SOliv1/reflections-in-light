import React from "react";
import { Navigate, useParams } from "react-router-dom";
import PersistentDayPage from "../components/PersistentDayPage";
import {
  BIRTHDAY_DAY,
  BIRTHDAY_MONTH,
  birthdayLightingPresets,
} from "../data/birthdayExperience";

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toLegacyDayDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

export default function DayPage() {
  const { date } = useParams();

  if (!date || !isValidDateString(date)) {
    return <Navigate to="/" replace />;
  }

  const jsDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(jsDate.getTime())) {
    return <Navigate to="/" replace />;
  }

  const month = jsDate.getMonth();
  const season =
    month === 11 || month <= 1
      ? "winter"
      : month >= 2 && month <= 4
        ? "spring"
        : month >= 5 && month <= 7
          ? "summer"
          : "autumn";
  const isBirthdayScene =
    jsDate.getMonth() + 1 === BIRTHDAY_MONTH && jsDate.getDate() === BIRTHDAY_DAY;

  return (
    <PersistentDayPage
      dayIndex={jsDate.getDate()}
      dayDate={toLegacyDayDate(date)}
      season={season}
      title={`Reflection for ${jsDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`}
      specialExperience={
        isBirthdayScene
          ? {
              variant: "birthday-stage",
              lightingPresets: birthdayLightingPresets,
            }
          : null
      }
    />
  );
}
