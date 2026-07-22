// WhatsApp notifications via CallMeBot (free, personal-use API).
// No-ops until CALLMEBOT_PHONE and CALLMEBOT_APIKEY are set.
export async function sendWhatsAppMessage(text: string) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;

  try {
    await fetch(url, { method: "GET" });
  } catch {
    // best-effort notification channel — never block the booking/order flow
  }
}
