/**
 * Payment integration point.
 *
 * There's no live payment processor connected yet — orders are created with
 * status "PENDING_PAYMENT" and the customer is shown manual payment
 * instructions (pay on pickup / bank transfer). When the business connects a
 * real Israeli payment processor (Cardcom / Tranzila / PayBox), swap the
 * implementation of `createPayment` below to redirect to / open that
 * processor's hosted payment page, and call it from the checkout route
 * instead of the manual-instructions path. Nothing else in the app needs to
 * change.
 */

export type PaymentResult =
  | { mode: "manual"; instructions: string }
  | { mode: "redirect"; url: string };

export async function createPayment(orderId: string, totalIls: number): Promise<PaymentResult> {
  return {
    mode: "manual",
    instructions: `ההזמנה ${orderId} על סך ${totalIls.toFixed(2)} ש"ח התקבלה. התשלום מתבצע במקום / בהעברה בנקאית לפי תיאום עם העסק.`,
  };
}
