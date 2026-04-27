import express from "express";
import { getDb } from "../db.js";
import {
  deleteEmailSubscription,
  normalizeActionItems,
  normalizeEmailAddress,
  upsertEmailSubscription,
} from "../models/EmailSubscription.js";
import { previewNextEmailReminder } from "../services/emailScheduler.js";
import { getEmailConfigStatus, isEmailConfigured, sendTemplateEmail } from "../utils/email.js";
import { parseReminderTime, splitReminderTime } from "../utils/reminderSchedule.js";

const router = express.Router();

router.get("/status", (_req, res) => {
  return res.json(getEmailConfigStatus());
});

router.post("/subscribe", async (req, res) => {
  try {
    if (!isEmailConfigured()) {
      return res.status(503).json({
        error:
          "Email reminders are not configured on the server.",
      });
    }

    const {
      emailAddress,
      actions = [],
      title = "Quiet Actions",
      reminderTime = "18:00",
      timeZone = "UTC",
    } = req.body || {};

    const normalizedEmail = normalizeEmailAddress(emailAddress);

    if (!normalizedEmail) {
      return res.status(400).json({ error: "Missing email address" });
    }

    const db = getDb();
    await upsertEmailSubscription(db, normalizedEmail, {
      actions,
      title,
      reminderTime: parseReminderTime(reminderTime),
      timeZone,
    });

    await sendTemplateEmail({
      to_email: normalizedEmail,
      subject: "You’re subscribed to Reflections in Light reminders",
      channel: "Email reminders",
      reminder_time: parseReminderTime(reminderTime),
      time_zone: timeZone,
      actions: normalizeActionItems(actions).map((item) => `• ${item}`).join("\n"),
      message:
        "Your daily email reminder is now active. We’ll send a gentle nudge at your chosen time.",
      app_url: process.env.PUSH_APP_URL || "https://reflections-in-light.com/",
      title,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Email subscribe error:", error);
    return res.status(500).json({ error: "Failed to store email subscription" });
  }
});

router.post("/test", async (req, res) => {
  try {
    if (!isEmailConfigured()) {
      return res.status(503).json({
        error:
          "Email reminders are not configured on the server.",
      });
    }

    const {
      emailAddress,
      actions = [],
      title = "Quiet Actions",
      reminderTime = "18:00",
      timeZone = "UTC",
    } = req.body || {};

    const normalizedEmail = normalizeEmailAddress(emailAddress);

    if (!normalizedEmail) {
      return res.status(400).json({ error: "Missing email address" });
    }

    await sendTemplateEmail({
      to_email: normalizedEmail,
      subject: "Reflections in Light test email",
      channel: "Test email",
      reminder_time: parseReminderTime(reminderTime),
      time_zone: timeZone,
      actions: normalizeActionItems(actions).map((item) => `• ${item}`).join("\n"),
      message: "This is a test email from your Quiet Actions drawer.",
      app_url: process.env.PUSH_APP_URL || "https://reflections-in-light.com/",
      title,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Email test error:", error);
    return res.status(500).json({ error: "Failed to send test email" });
  }
});

router.get("/next-send", (req, res) => {
  try {
    const reminderTime = parseReminderTime(
      req.query.time || req.query.reminderTime || "18:00"
    );
    const timeZone =
      typeof req.query.timeZone === "string" && req.query.timeZone.trim()
        ? req.query.timeZone.trim()
        : "UTC";

    return res.json({
      ...splitReminderTime(reminderTime),
      timeZone,
      preview: previewNextEmailReminder(reminderTime, timeZone, new Date()),
    });
  } catch (error) {
    console.error("Email next-send preview error:", error);
    return res.status(500).json({ error: "Failed to preview next email reminder" });
  }
});

router.post("/unsubscribe", async (req, res) => {
  try {
    const { emailAddress } = req.body || {};
    const normalizedEmail = normalizeEmailAddress(emailAddress);

    if (!normalizedEmail) {
      return res.status(400).json({ error: "Missing email address" });
    }

    const db = getDb();
    await deleteEmailSubscription(db, normalizedEmail);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Email unsubscribe error:", error);
    return res.status(500).json({ error: "Failed to remove email subscription" });
  }
});

export default router;
