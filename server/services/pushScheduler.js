import { connectToDb } from "../db.js";
import { buildReminderPayload, getPushSubscriptions } from "../models/PushSubscription.js";
import { configureWebPush, isPushConfigured, isSubscriptionGone } from "../utils/push.js";
import { formatZonedDateKey, getNextReminderAt, isReminderDueNow, splitReminderTime } from "../utils/reminderSchedule.js";

const CHECK_INTERVAL_MS = 30 * 1000;
const REMINDER_APP_URL = process.env.PUSH_APP_URL || "https://reflections-in-light.com/";

function parseIntEnv(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > max) {
    return fallback;
  }

  return parsed;
}

const DEFAULT_REMINDER_TIME = `${String(parseIntEnv(process.env.PUSH_REMINDER_HOUR_UTC || "18", 18, 23)).padStart(2, "0")}:${String(parseIntEnv(process.env.PUSH_REMINDER_MINUTE_UTC || "0", 0, 59)).padStart(2, "0")}`;

let schedulerStarted = false;
let tickInFlight = false;
let intervalHandle = null;

async function sendReminderBatch() {
  const db = await connectToDb();
  const subscriptions = await getPushSubscriptions(db);

  if (!subscriptions.length) {
    return;
  }

  const webpush = configureWebPush();
  let delivered = 0;
  let removed = 0;

  for (const subscriptionDoc of subscriptions) {
    const reminderTime = subscriptionDoc.reminderTime || DEFAULT_REMINDER_TIME;
    const timeZone = subscriptionDoc.timeZone || "UTC";

    const now = new Date();
    const localDateKey = formatZonedDateKey(now, timeZone);

    if (!isReminderDueNow(now, reminderTime, timeZone) || subscriptionDoc.lastSentDateKey === localDateKey) {
      continue;
    }

    const payload = JSON.stringify(buildReminderPayload(subscriptionDoc, REMINDER_APP_URL));

    try {
      await webpush.sendNotification(subscriptionDoc.subscription, payload);
      delivered += 1;

      await db.collection("push_subscriptions").updateOne(
        { endpoint: subscriptionDoc.endpoint },
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
      if (isSubscriptionGone(error)) {
        removed += 1;
        await db.collection("push_subscriptions").deleteOne({ endpoint: subscriptionDoc.endpoint });
      } else {
        console.error("Failed to send push notification:", error?.message || error);
      }
    }
  }

  return { delivered, removed };
}

async function tick() {
  if (tickInFlight || !isPushConfigured()) {
    return;
  }

  tickInFlight = true;

  try {
    const db = await connectToDb();
    await sendReminderBatch();
  } catch (error) {
    console.error("Push scheduler tick failed:", error?.message || error);
  } finally {
    tickInFlight = false;
  }
}

export function startPushScheduler() {
  if (schedulerStarted) {
    return;
  }

  schedulerStarted = true;
  configureWebPush();
  void tick();

  intervalHandle = setInterval(() => {
    void tick();
  }, CHECK_INTERVAL_MS);

  if (typeof intervalHandle?.unref === "function") {
    intervalHandle.unref();
  }
}

export function previewNextReminder(reminderTime, timeZone, now = new Date()) {
  const normalizedTime = reminderTime || DEFAULT_REMINDER_TIME;
  const normalizedZone = timeZone || "UTC";
  const next = getNextReminderAt(now, normalizedTime, normalizedZone);

  return next || {
    nextSendAt: null,
    reminderTime: splitReminderTime(normalizedTime).reminderTime,
    timeZone: normalizedZone,
    localDateKey: null,
  };
}
