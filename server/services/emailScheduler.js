import { connectToDb } from "../db.js";
import {
  buildEmailReminderPayload,
  getEmailSubscriptions,
} from "../models/EmailSubscription.js";
import { isEmailConfigured, sendTemplateEmail } from "../utils/email.js";
import {
  formatZonedDateKey,
  getNextReminderAt,
  isReminderDueNow,
  splitReminderTime,
} from "../utils/reminderSchedule.js";

const CHECK_INTERVAL_MS = 30 * 1000;
const REMINDER_APP_URL =
  process.env.PUSH_APP_URL || "https://reflections-in-light.com/";

function parseIntEnv(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > max) {
    return fallback;
  }

  return parsed;
}

const DEFAULT_REMINDER_TIME = `${String(
  parseIntEnv(process.env.EMAIL_REMINDER_HOUR_UTC || "18", 18, 23)
).padStart(2, "0")}:${String(
  parseIntEnv(process.env.EMAIL_REMINDER_MINUTE_UTC || "0", 0, 59)
).padStart(2, "0")}`;

let schedulerStarted = false;
let tickInFlight = false;
let intervalHandle = null;

async function sendReminderBatch() {
  const db = await connectToDb();
  const subscriptions = await getEmailSubscriptions(db);

  if (!subscriptions.length) {
    return;
  }

  let delivered = 0;

  for (const subscriptionDoc of subscriptions) {
    const reminderTime = subscriptionDoc.reminderTime || DEFAULT_REMINDER_TIME;
    const timeZone = subscriptionDoc.timeZone || "UTC";
    const now = new Date();
    const localDateKey = formatZonedDateKey(now, timeZone);

    if (
      !isReminderDueNow(now, reminderTime, timeZone) ||
      subscriptionDoc.lastSentDateKey === localDateKey
    ) {
      continue;
    }

    try {
      const payload = buildEmailReminderPayload(subscriptionDoc, REMINDER_APP_URL);
      await sendTemplateEmail(payload);
      delivered += 1;

      await db.collection("email_subscriptions").updateOne(
        { emailAddress: subscriptionDoc.emailAddress },
        {
          $set: {
            lastSentAt: new Date(),
            lastSentDateKey: localDateKey,
            updatedAt: new Date(),
          },
          $inc: {
            sendCount: 1,
          },
        }
      );
    } catch (error) {
      console.error("Failed to send email reminder:", error?.message || error);
    }
  }

  return { delivered };
}

async function tick() {
  if (tickInFlight || !isEmailConfigured()) {
    return;
  }

  tickInFlight = true;

  try {
    await sendReminderBatch();
  } catch (error) {
    console.error("Email scheduler tick failed:", error?.message || error);
  } finally {
    tickInFlight = false;
  }
}

export function startEmailScheduler() {
  if (schedulerStarted) {
    return;
  }

  schedulerStarted = true;
  void tick();

  intervalHandle = setInterval(() => {
    void tick();
  }, CHECK_INTERVAL_MS);

  if (typeof intervalHandle?.unref === "function") {
    intervalHandle.unref();
  }
}

export function previewNextEmailReminder(reminderTime, timeZone, now = new Date()) {
  const normalizedTime = reminderTime || DEFAULT_REMINDER_TIME;
  const normalizedZone = timeZone || "UTC";
  const next = getNextReminderAt(now, normalizedTime, normalizedZone);

  return (
    next || {
      nextSendAt: null,
      reminderTime: splitReminderTime(normalizedTime).reminderTime,
      timeZone: normalizedZone,
      localDateKey: null,
    }
  );
}
