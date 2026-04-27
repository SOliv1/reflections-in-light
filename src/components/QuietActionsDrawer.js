import { useEffect, useRef, useState } from "react";
import {
  getVapidPublicKey,
  isPushSupported,
  getEmailReminderStatus,
  previewNextPush,
  postPushSubscription,
  postPushUnsubscribe,
  subscribeEmailReminder,
  sendEmailReminder,
  sendPushTest,
  urlBase64ToUint8Array,
} from "../utils/pushNotifications";

const DEFAULT_REMINDER_TIME = "18:00";
const REMINDER_STORAGE_KEY = "quietActionReminderSettings";
const EMAIL_STORAGE_KEY = "quietActionEmailSettings";

function getDefaultTimeZone() {
  if (typeof Intl === "undefined") {
    return "UTC";
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function formatPreviewLabel(preview) {
  if (!preview?.nextSendAt) {
    return "Preview unavailable for the current reminder settings.";
  }

  return `Next reminder: ${new Date(preview.nextSendAt).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export default function QuietActionsDrawer({ orbColor, onClose }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [pushSubscription, setPushSubscription] = useState(null);
  const [pushStatus, setPushStatus] = useState("Enable reminders to get a daily nudge.");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailStatus, setEmailStatus] = useState(
    "Email reminders are optional. Add an address to receive a test email."
  );
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);
  const [timeZone, setTimeZone] = useState(getDefaultTimeZone);
  const [nextReminderPreview, setNextReminderPreview] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSavingPush, setIsSavingPush] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailConfigured, setIsEmailConfigured] = useState(true);
  const pushSyncInFlight = useRef(false);
  const serviceWorkerRegistrationRef = useRef(null);

  const orbRGB = orbColor.replace("rgb(", "").replace(")", "");

  // Load saved items
  useEffect(() => {
    const saved = localStorage.getItem("quietActions");
    if (saved) setItems(JSON.parse(saved));

    const savedReminderSettings = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (savedReminderSettings) {
      try {
        const parsed = JSON.parse(savedReminderSettings);
        if (typeof parsed?.reminderTime === "string" && parsed.reminderTime) {
          setReminderTime(parsed.reminderTime);
        }
        if (typeof parsed?.timeZone === "string" && parsed.timeZone) {
          setTimeZone(parsed.timeZone);
        }
      } catch (error) {
        console.warn("Failed to parse reminder settings:", error);
      }
    }

    const savedEmailSettings = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (savedEmailSettings) {
      try {
        const parsed = JSON.parse(savedEmailSettings);
        if (typeof parsed?.emailAddress === "string" && parsed.emailAddress) {
          setEmailAddress(parsed.emailAddress);
        }
      } catch (error) {
        console.warn("Failed to parse email settings:", error);
      }
    }

    setHydrated(true);
  }, []);

  // Save items whenever they change
  useEffect(() => {
    localStorage.setItem("quietActions", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify({ reminderTime, timeZone })
    );
  }, [hydrated, reminderTime, timeZone]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorage.setItem(
      EMAIL_STORAGE_KEY,
      JSON.stringify({ emailAddress })
    );
  }, [hydrated, emailAddress]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!pushSubscription) {
      return;
    }

    if (pushSyncInFlight.current) {
      return;
    }

    const syncPushSubscription = async () => {
      try {
        pushSyncInFlight.current = true;
        await postPushSubscription(pushSubscription, {
          actions: items,
          reminderTime,
          timeZone,
        });
        setPushStatus("Reminders are active and synced with your current actions.");
      } catch (error) {
        console.error("Failed to sync push reminders:", error);
        setPushStatus("Reminders are enabled, but syncing needs another try.");
      } finally {
        pushSyncInFlight.current = false;
      }
    };

    void syncPushSubscription();
  }, [hydrated, items, pushSubscription, reminderTime, timeZone]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    let cancelled = false;

    const loadPreview = async () => {
      setIsPreviewLoading(true);

      try {
        const preview = await previewNextPush(reminderTime, timeZone);
        if (!cancelled) {
          setNextReminderPreview(preview?.preview || preview);
        }
      } catch (error) {
        console.error("Failed to load reminder preview:", error);
        if (!cancelled) {
          setNextReminderPreview(null);
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [hydrated, reminderTime, timeZone]);

  useEffect(() => {
    let cancelled = false;

    const loadPushState = async () => {
      if (!isPushSupported()) {
        setPushStatus("This browser does not support push reminders.");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        serviceWorkerRegistrationRef.current = registration;

        const existingSubscription = await registration.pushManager.getSubscription();

        if (!cancelled && existingSubscription) {
          setPushSubscription(existingSubscription);
          setPushStatus("Reminders are already enabled on this device.");
        }
      } catch (error) {
        console.error("Failed to prepare push notifications:", error);
        if (!cancelled) {
          setPushStatus("Reminders could not be prepared right now.");
        }
      }
    };

    void loadPushState();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadEmailStatus = async () => {
      try {
        const status = await getEmailReminderStatus();
        if (!cancelled) {
          setIsEmailConfigured(Boolean(status?.configured));

          if (!status?.configured) {
            setEmailStatus(
              "Email reminders are not configured on the server yet."
            );
          }
        }
      } catch (error) {
        console.error("Failed to load email reminder status:", error);
      }
    };

    void loadEmailStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const enablePushReminders = async () => {
    setIsSavingPush(true);

    try {
      const subscription = await ensurePushSubscription({
        promptForPermission: true,
      });

      if (subscription) {
        setPushStatus("Daily reminders are now enabled.");
      }
    } catch (error) {
      console.error("Failed to enable push reminders:", error);
      setPushStatus("We could not enable reminders just yet.");
    } finally {
      setIsSavingPush(false);
    }
  };

  const handleEmailAddressChange = (event) => {
    setEmailAddress(event.target.value);
  };

  const handleEmailReminderSubscribe = async () => {
    if (!emailAddress.trim()) {
      setEmailStatus("Add an email address first.");
      return;
    }

    setIsSendingEmail(true);

    try {
      await subscribeEmailReminder({
        toEmail: emailAddress.trim(),
        actions: items,
        reminderTime,
        timeZone,
      });

      setEmailStatus("Email reminders are now subscribed for this address.");
    } catch (error) {
      console.error("Failed to subscribe email reminders:", error);
      setEmailStatus(error.message || "We could not save the email reminder just yet.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendEmailTest = async () => {
    if (!emailAddress.trim()) {
      setEmailStatus("Add an email address first, then we can send a test.");
      return;
    }

    setIsSendingEmail(true);

    try {
      await sendEmailReminder({
        toEmail: emailAddress.trim(),
        actions: items,
        reminderTime,
        timeZone,
        subject: "Reflections in Light test email",
        channel: "Test email",
      });

      setEmailStatus("Test email sent to this address.");
    } catch (error) {
      console.error("Failed to send test email:", error);
      setEmailStatus("We could not send a test email right now.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const ensurePushSubscription = async ({ promptForPermission = false } = {}) => {
    if (!isPushSupported()) {
      setPushStatus("This browser does not support push reminders.");
      return null;
    }

    let registration = serviceWorkerRegistrationRef.current;

    if (!registration) {
      registration = await navigator.serviceWorker.register("/sw.js");
      serviceWorkerRegistrationRef.current = registration;
    }

    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      setPushSubscription(existingSubscription);
      return existingSubscription;
    }

    if (!promptForPermission) {
      return null;
    }

    const permission =
      Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();

    if (permission !== "granted") {
      setPushStatus("Notifications were not granted.");
      return null;
    }

    const serverKey = await getVapidPublicKey();
    const applicationServerKey = urlBase64ToUint8Array(serverKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    setPushSubscription(subscription);
    return subscription;
  };

  const disablePushReminders = async () => {
    if (!pushSubscription) {
      return;
    }

    setIsSavingPush(true);

    try {
      await pushSubscription.unsubscribe();
      await postPushUnsubscribe(pushSubscription.endpoint);
      setPushSubscription(null);
      setPushStatus("Daily reminders are turned off.");
    } catch (error) {
      console.error("Failed to disable push reminders:", error);
      setPushStatus("We could not turn reminders off right now.");
    } finally {
      setIsSavingPush(false);
    }
  };

  const handleReminderTimeChange = (event) => {
    setReminderTime(event.target.value || DEFAULT_REMINDER_TIME);
  };

  const handleSendTestNotification = async () => {
    setIsSavingPush(true);

    try {
      const subscription =
        pushSubscription ||
        (await ensurePushSubscription({ promptForPermission: true }));

      if (!subscription) {
        return;
      }

      await postPushSubscription(subscription, {
        actions: items,
        reminderTime,
        timeZone,
      });
      await sendPushTest(subscription.endpoint);
      setPushStatus("Test notification sent to this device.");
    } catch (error) {
      console.error("Failed to send test notification:", error);
      setPushStatus("We could not send a test notification right now.");
    } finally {
      setIsSavingPush(false);
    }
  };

  // ⭐ NEW: Add newest item at the TOP
  const addItem = () => {
    if (!text.trim()) return;
    const newItem = { id: Date.now(), text };
    setItems([newItem, ...items]);   // NEWEST FIRST
    setText("");
  };

  const deleteItem = (id) => {
    setItems(items.filter((n) => n.id !== id));
  };


  return (
    <div
      className="short-reflections-drawer"
      style={{
        "--orbColor": orbColor,
        "--orbColorRGB": orbRGB
      }}
    >
      <button className="drawer-close-btn" onClick={onClose}>×</button>
      <button className="drawer-close-text" onClick={onClose}>Close</button>

      <h3 className="panel-title">Quiet Actions</h3>

      <div className="push-reminder-panel push-reminder-panel--intro">
        <p className="push-reminder-label">How to use</p>
        <p className="push-reminder-status">
          Add a few quiet actions, choose a reminder time, then tap Enable reminders.
          When notifications are allowed, the browser will deliver a daily reminder on this device.
        </p>
      </div>

      <div className="todo-input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a gentle intention…"
        />
        <button className="drawer-btn" onClick={addItem}>
          Add Action
        </button>

      </div>

      <ul className="todo-list">
        {items.map(item => (
          <li key={item.id}>
            <span>{item.text}</span>
            <button className="remove-btn" onClick={() => deleteItem(item.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="push-reminder-panel push-reminder-panel--controls">
        <p className="push-reminder-label">Reminder delivery</p>
        <p className="push-reminder-status">{pushStatus}</p>

        <div className="push-reminder-form">
          <label className="push-reminder-field">
            <span>Reminder time</span>
            <input
              type="time"
              value={reminderTime}
              onChange={handleReminderTimeChange}
              step="300"
            />
          </label>

          <label className="push-reminder-field">
            <span>Time zone</span>
            <input type="text" value={timeZone} readOnly />
          </label>
        </div>

        <p className="push-reminder-preview">
          {isPreviewLoading ? "Loading next reminder..." : formatPreviewLabel(nextReminderPreview)}
        </p>

        <div className="push-reminder-actions">
          <button
            className="drawer-btn"
            onClick={enablePushReminders}
            disabled={isSavingPush}
          >
            {pushSubscription ? "Refresh reminders" : "Enable reminders"}
          </button>

          {pushSubscription ? (
            <button
              className="drawer-btn"
              onClick={disablePushReminders}
              disabled={isSavingPush}
            >
              Disable
            </button>
          ) : null}

          <button
            className="drawer-btn"
            onClick={handleSendTestNotification}
            disabled={isSavingPush}
          >
            Send test notification
          </button>
        </div>
      </div>

      <div className="push-reminder-panel push-reminder-panel--email">
        <p className="push-reminder-label">Email subscription</p>
        <p className="push-reminder-status">{emailStatus}</p>

        <div className="push-reminder-form">
          <label className="push-reminder-field">
            <span>Email address</span>
            <input
              type="email"
              value={emailAddress}
              onChange={handleEmailAddressChange}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </label>
        </div>

        <div className="push-reminder-actions">
          <button
            className="drawer-btn"
            onClick={handleEmailReminderSubscribe}
            disabled={isSendingEmail || !isEmailConfigured}
          >
            Subscribe by email
          </button>

          <button
            className="drawer-btn"
            onClick={handleSendEmailTest}
            disabled={isSendingEmail || !isEmailConfigured}
          >
            Send test email
          </button>
        </div>
      </div>
    </div>
  );
}
