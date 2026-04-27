const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

function getEmailJsConfig() {
  return {
    serviceId: process.env.EMAILJS_SERVICE_ID || "",
    templateId: process.env.EMAILJS_TEMPLATE_ID || "",
    publicKey: process.env.EMAILJS_PUBLIC_KEY || "",
    privateKey: process.env.EMAILJS_PRIVATE_KEY || "",
  };
}

export function isEmailConfigured() {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  return Boolean(serviceId && templateId && publicKey);
}

export function getEmailConfigStatus() {
  const { serviceId, templateId, publicKey, privateKey } = getEmailJsConfig();

  return {
    configured: Boolean(serviceId && templateId && publicKey),
    hasPrivateKey: Boolean(privateKey),
  };
}

export async function sendTemplateEmail(templateParams = {}) {
  const { serviceId, templateId, publicKey, privateKey } = getEmailJsConfig();

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "Email reminders are not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY."
    );
  }

  const response = await fetch(EMAILJS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey || undefined,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `EmailJS request failed (${response.status})`);
  }

  return response.text();
}
