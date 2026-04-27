const EMAIL_SUBSCRIPTIONS_COLLECTION = "email_subscriptions";

function normalizeActionText(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object" && typeof value.text === "string") {
    return value.text.trim();
  }

  return "";
}

export function normalizeEmailAddress(value = "") {
  return String(value || "").trim().toLowerCase();
}

export function normalizeActionItems(actions = []) {
  return actions
    .map(normalizeActionText)
    .filter(Boolean)
    .slice(0, 10);
}

export async function upsertEmailSubscription(
  db,
  emailAddress,
  {
    actions = [],
    title = "Quiet Actions",
    source = "quiet-actions",
    reminderTime = "18:00",
    timeZone = "UTC",
  } = {}
) {
  const normalizedEmail = normalizeEmailAddress(emailAddress);

  if (!normalizedEmail) {
    throw new Error("Missing email address");
  }

  const normalizedActions = normalizeActionItems(actions);

  return db.collection(EMAIL_SUBSCRIPTIONS_COLLECTION).updateOne(
    { emailAddress: normalizedEmail },
    {
      $set: {
        emailAddress: normalizedEmail,
        actions: normalizedActions,
        title,
        source,
        reminderTime,
        timeZone,
        enabled: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
        sendCount: 0,
      },
    },
    { upsert: true }
  );
}

export async function deleteEmailSubscription(db, emailAddress) {
  const normalizedEmail = normalizeEmailAddress(emailAddress);

  if (!normalizedEmail) {
    return { deletedCount: 0 };
  }

  return db.collection(EMAIL_SUBSCRIPTIONS_COLLECTION).deleteOne({
    emailAddress: normalizedEmail,
  });
}

export async function getEmailSubscriptions(db) {
  return db
    .collection(EMAIL_SUBSCRIPTIONS_COLLECTION)
    .find({ enabled: { $ne: false } })
    .toArray();
}

export function buildEmailReminderPayload(
  subscriptionDoc,
  appUrl = "https://reflections-in-light.com/"
) {
  const actions = normalizeActionItems(subscriptionDoc?.actions || []);
  const preview = actions.slice(0, 5);
  const actionLines = preview.length
    ? preview.map((item) => `• ${item}`).join("\n")
    : "• Open the Actions drawer to review your quiet tasks.";

  return {
    to_email: subscriptionDoc?.emailAddress || "",
    subject: subscriptionDoc?.title || "Reflections in Light reminder",
    channel: "Daily email reminder",
    reminder_time: subscriptionDoc?.reminderTime || "18:00",
    time_zone: subscriptionDoc?.timeZone || "UTC",
    actions: actionLines,
    message:
      "A quiet reminder from Reflections in Light. Return to your stage of light whenever you need a gentle nudge.",
    app_url: appUrl,
    title: subscriptionDoc?.title || "Quiet Actions",
  };
}
