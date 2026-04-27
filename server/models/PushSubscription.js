const PUSH_SUBSCRIPTIONS_COLLECTION = "push_subscriptions";

function normalizeActionText(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object" && typeof value.text === "string") {
    return value.text.trim();
  }

  return "";
}

export function normalizeActionItems(actions = []) {
  return actions
    .map(normalizeActionText)
    .filter(Boolean)
    .slice(0, 10);
}

export async function upsertPushSubscription(
  db,
  subscription,
  {
    actions = [],
    title = "Quiet Actions",
    source = "quiet-actions",
    userAgent = "",
    reminderTime = "18:00",
    timeZone = "UTC",
  } = {}
) {
  const endpoint = subscription?.endpoint;

  if (!endpoint) {
    throw new Error("Missing subscription endpoint");
  }

  const normalizedActions = normalizeActionItems(actions);

  return db.collection(PUSH_SUBSCRIPTIONS_COLLECTION).updateOne(
    { endpoint },
    {
      $set: {
        endpoint,
        subscription,
        actions: normalizedActions,
        title,
        source,
        userAgent,
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

export async function deletePushSubscription(db, endpoint) {
  if (!endpoint) {
    return { deletedCount: 0 };
  }

  return db.collection(PUSH_SUBSCRIPTIONS_COLLECTION).deleteOne({ endpoint });
}

export async function getPushSubscriptions(db) {
  return db.collection(PUSH_SUBSCRIPTIONS_COLLECTION).find({ enabled: { $ne: false } }).toArray();
}

export function buildReminderPayload(subscriptionDoc, appUrl = "https://reflections-in-light.com/") {
  const actions = normalizeActionItems(subscriptionDoc?.actions || []);
  const preview = actions.slice(0, 3);
  const body = preview.length
    ? `Quiet actions waiting: ${preview.join(" • ")}${actions.length > preview.length ? " • ..." : ""}`
    : "Open the Actions drawer to review your quiet tasks.";

  return {
    title: subscriptionDoc?.title || "Reflections in Light reminder",
    body,
    icon: "/logo192.png",
    badge: "/logo192.png",
    tag: "quiet-actions-reminder",
    renotify: true,
    actions: [
      {
        action: "open",
        title: "Open app",
      },
    ],
    data: {
      url: appUrl,
      drawer: "quiet-actions",
      source: "quiet-actions",
    },
  };
}
