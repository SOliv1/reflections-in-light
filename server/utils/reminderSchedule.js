function pad(value) {
  return String(value).padStart(2, "0");
}

export function parseReminderTime(value, fallback = "18:00") {
  const text = typeof value === "string" ? value.trim() : "";
  const match = text.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return fallback;
  }

  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return fallback;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return fallback;
  }

  return `${pad(hour)}:${pad(minute)}`;
}

export function splitReminderTime(value, fallback = "18:00") {
  const normalized = parseReminderTime(value, fallback);
  const [hour, minute] = normalized.split(":").map((segment) => Number.parseInt(segment, 10));

  return {
    hour,
    minute,
    reminderTime: normalized,
  };
}

export function formatUtcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function formatZonedParts(date, timeZone) {
  const resolveFormatter = (zone) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  let parts;

  try {
    parts = resolveFormatter(timeZone).formatToParts(date);
  } catch (_error) {
    parts = resolveFormatter("UTC").formatToParts(date);
  }

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number.parseInt(values.year, 10),
    month: Number.parseInt(values.month, 10),
    day: Number.parseInt(values.day, 10),
    hour: Number.parseInt(values.hour, 10),
    minute: Number.parseInt(values.minute, 10),
    second: Number.parseInt(values.second, 10),
  };
}

export function formatZonedDateKey(date, timeZone) {
  const parts = formatZonedParts(date, timeZone);

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function getNowInTimeZone(timeZone, now = new Date()) {
  return formatZonedParts(now, timeZone);
}

export function isReminderDueNow(now, reminderTime, timeZone) {
  const { hour, minute } = splitReminderTime(reminderTime);
  const zonedNow = getNowInTimeZone(timeZone, now);

  return zonedNow.hour === hour && zonedNow.minute === minute;
}

export function getNextReminderAt(now, reminderTime, timeZone) {
  const { hour, minute } = splitReminderTime(reminderTime);
  const safeTimeZone = typeof timeZone === "string" && timeZone.trim() ? timeZone.trim() : "UTC";
  const searchStart = new Date(now.getTime());
  searchStart.setSeconds(0, 0);
  searchStart.setMinutes(searchStart.getMinutes() + 1);

  const maxMinutes = 60 * 48;
  for (let offset = 0; offset <= maxMinutes; offset += 1) {
    const candidate = new Date(searchStart.getTime() + offset * 60 * 1000);
    const zoned = getNowInTimeZone(safeTimeZone, candidate);

    if (zoned.hour === hour && zoned.minute === minute) {
      return {
        nextSendAt: candidate.toISOString(),
        reminderTime: `${pad(hour)}:${pad(minute)}`,
        timeZone: safeTimeZone,
        localDateKey: formatZonedDateKey(candidate, safeTimeZone),
      };
    }
  }

  return null;
}
