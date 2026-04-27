import express from "express";
import { getDb } from "../db.js";
import {
  deletePushSubscription,
  getPushSubscriptions,
  upsertPushSubscription,
} from "../models/PushSubscription.js";
import { configureWebPush, getVapidPublicKey, isPushConfigured, isSubscriptionGone } from "../utils/push.js";
import { previewNextReminder } from "../services/pushScheduler.js";
import { parseReminderTime, splitReminderTime } from "../utils/reminderSchedule.js";

const router = express.Router();

router.get("/vapid-public-key", (_req, res) => {
  const publicKey = getVapidPublicKey();

  if (!publicKey) {
    return res.status(503).json({
      error: "Push notifications are not configured on the server.",
    });
  }

  return res.json({ publicKey });
});

router.post("/subscribe", async (req, res) => {
  try {
    if (!isPushConfigured()) {
      return res.status(503).json({
        error: "Push notifications are not configured on the server.",
      });
    }

    const {
      subscription,
      actions = [],
      title = "Quiet Actions",
      reminderTime = "18:00",
      timeZone = "UTC",
    } = req.body || {};

    if (!subscription?.endpoint) {
      return res.status(400).json({ error: "Missing push subscription endpoint" });
    }

    const db = getDb();
    await upsertPushSubscription(db, subscription, {
      actions,
      title,
      source: "quiet-actions",
      userAgent: req.get("user-agent") || "",
      reminderTime: parseReminderTime(reminderTime),
      timeZone,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return res.status(500).json({ error: "Failed to store push subscription" });
  }
});

router.post("/test", async (req, res) => {
  try {
    if (!isPushConfigured()) {
      return res.status(503).json({
        error: "Push notifications are not configured on the server.",
      });
    }

    const { endpoint } = req.body || {};
    const db = getDb();
    const subscriptions = endpoint
      ? await db.collection("push_subscriptions").find({ endpoint }).toArray()
      : await getPushSubscriptions(db);

    if (!subscriptions.length) {
      return res.status(404).json({ error: "No saved push subscription found" });
    }

    const webpush = configureWebPush();
    const payload = JSON.stringify({
      title: "Reflections in Light",
      body: "This is a test notification from your Actions drawer.",
      icon: "/logo192.png",
      badge: "/logo192.png",
      tag: "quiet-actions-test",
      data: {
        url: "https://reflections-in-light.com/",
        drawer: "quiet-actions",
        source: "quiet-actions-test",
      },
    });

    for (const subscriptionDoc of subscriptions) {
      try {
        await webpush.sendNotification(subscriptionDoc.subscription, payload);
      } catch (error) {
        if (isSubscriptionGone(error)) {
          await deletePushSubscription(db, subscriptionDoc.endpoint);
        } else {
          throw error;
        }
      }
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error("Push test error:", error);
    return res.status(500).json({ error: "Failed to send test notification" });
  }
});

router.get("/next-send", async (req, res) => {
  try {
    const reminderTime = parseReminderTime(req.query.time || req.query.reminderTime || "18:00");
    const timeZone = typeof req.query.timeZone === "string" && req.query.timeZone.trim()
      ? req.query.timeZone.trim()
      : "UTC";

    return res.json({
      ...splitReminderTime(reminderTime),
      timeZone,
      preview: previewNextReminder(reminderTime, timeZone, new Date()),
    });
  } catch (error) {
    console.error("Push next-send preview error:", error);
    return res.status(500).json({ error: "Failed to preview next reminder" });
  }
});

router.post("/unsubscribe", async (req, res) => {
  try {
    const { endpoint } = req.body || {};

    if (!endpoint) {
      return res.status(400).json({ error: "Missing endpoint" });
    }

    const db = getDb();
    await deletePushSubscription(db, endpoint);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return res.status(500).json({ error: "Failed to remove push subscription" });
  }
});

export default router;
