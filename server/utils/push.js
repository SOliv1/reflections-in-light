import webpush from "web-push";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:notifications@reflections-in-light.com";

let configured = false;

export function isPushConfigured() {
  return Boolean(vapidPublicKey && vapidPrivateKey);
}

export function getVapidPublicKey() {
  return vapidPublicKey;
}

export function configureWebPush() {
  if (configured) {
    return webpush;
  }

  if (!isPushConfigured()) {
    console.warn("Push notifications are not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.");
    return webpush;
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  configured = true;
  return webpush;
}

export function isSubscriptionGone(error) {
  return error?.statusCode === 404 || error?.statusCode === 410;
}
