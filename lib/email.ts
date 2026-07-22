import { Resend } from "resend";

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "העסק שלנו";
const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

function wrapEmail(title: string, bodyHtml: string) {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #292524;">
      <h2 style="color: #e11d48; margin-bottom: 4px;">${businessName}</h2>
      <h3 style="margin-top: 0;">${title}</h3>
      ${bodyHtml}
    </div>
  `;
}

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendAppointmentConfirmationEmail(params: {
  to: string;
  customerName: string;
  serviceName: string;
  date: Date;
  time: string;
}) {
  const resend = getClient();
  if (!resend) return;

  const html = wrapEmail(
    "התור שלך נקבע בהצלחה! ✓",
    `
      <p>שלום ${params.customerName},</p>
      <p>קבענו לך תור ל<strong>${params.serviceName}</strong>:</p>
      <p style="background: #fff1f2; border-radius: 12px; padding: 12px 16px;">
        📅 ${params.date.toLocaleDateString("he-IL")}<br/>
        🕐 בשעה ${params.time}
      </p>
      <p>מחכים לראותך!</p>
    `
  );

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `אישור תור - ${businessName}`,
    html,
  });
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}) {
  const resend = getClient();
  if (!resend) return;

  const itemsHtml = params.items
    .map(
      (item) =>
        `<tr><td style="padding:4px 0;">${item.name} × ${item.quantity}</td><td style="padding:4px 0; text-align:left;">${(item.price * item.quantity).toFixed(2)} ש"ח</td></tr>`
    )
    .join("");

  const html = wrapEmail(
    "ההזמנה שלך התקבלה! ✓",
    `
      <p>שלום ${params.customerName},</p>
      <p>ההזמנה שלך התקבלה ונטפל בה בהקדם:</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        <tr style="font-weight: bold; border-top: 1px solid #e7e5e4;">
          <td style="padding-top:8px;">סה&quot;כ</td>
          <td style="padding-top:8px; text-align:left;">${params.total.toFixed(2)} ש&quot;ח</td>
        </tr>
      </table>
      <p>התשלום מתבצע במקום / בהעברה בנקאית לפי תיאום. ניצור קשר בהקדם!</p>
    `
  );

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `אישור הזמנה - ${businessName}`,
    html,
  });
}
