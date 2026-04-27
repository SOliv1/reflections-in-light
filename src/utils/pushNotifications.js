import { fetchFromApi } from "../api";

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export function extractActionTexts(items = []) {
  return items
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object" && typeof item.text === "string") {
        return item.text.trim();
      }

      return "";
    })
    .filter(Boolean);
}

export async function getVapidPublicKey() {
  const response = await fetchFromApi("/api/push/vapid-public-key");

  if (!response.ok) {
    throw new Error(`Failed to load VAPID key (${response.status})`);
  }

  const data = await response.json();
  return data.publicKey;
}

export async function postPushSubscription(
  subscription,
  { actions = [], reminderTime = "18:00", timeZone = "UTC", title = "Quiet Actions" } = {}
) {
  const response = await fetchFromApi("/api/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      actions: extractActionTexts(actions),
      title,
      reminderTime,
      timeZone,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to store push subscription (${response.status})`);
  }

  return response.json();
}

export async function postPushUnsubscribe(endpoint) {
  if (!endpoint) {
    return null;
  }

  const response = await fetchFromApi("/api/push/unsubscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint }),
  });

  if (!response.ok) {
    throw new Error(`Failed to remove push subscription (${response.status})`);
  }

  return response.json();
}

export async function sendPushTest(endpoint) {
  const response = await fetchFromApi("/api/push/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send test notification (${response.status})`);
  }

  return response.json();
}

export async function previewNextPush(time, timeZone) {
  const params = new URLSearchParams({
    time,
    timeZone,
  });

  const response = await fetchFromApi(`/api/push/next-send?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to preview next send (${response.status})`);
  }

  return response.json();
}

export async function getEmailReminderStatus() {
  const response = await fetchFromApi("/api/email/status");

  if (!response.ok) {
    throw new Error(`Failed to load email reminder status (${response.status})`);
  }

  return response.json();
}

export async function subscribeEmailReminder({
  toEmail,
  actions = [],
  reminderTime = "18:00",
  timeZone = "UTC",
} = {}) {
  const response = await fetchFromApi("/api/email/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailAddress: toEmail,
      actions: extractActionTexts(actions),
      reminderTime,
      timeZone,
      title: "Quiet Actions",
    }),
  });

  if (!response.ok) {
    let message = `Failed to subscribe email reminders (${response.status})`;

    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch (_error) {
      // Ignore JSON parse failures and fall back to the default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function sendEmailReminder({
  toEmail,
  actions = [],
  reminderTime = "18:00",
  timeZone = "UTC",
} = {}) {
  const response = await fetchFromApi("/api/email/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailAddress: toEmail,
      actions: extractActionTexts(actions),
      reminderTime,
      timeZone,
      title: "Quiet Actions",
    }),
  });

  if (!response.ok) {
    let message = `Failed to send test email (${response.status})`;

    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch (_error) {
      // Ignore JSON parse failures and fall back to the default message.
    }

    throw new Error(message);
  }

  return response.json();
}
