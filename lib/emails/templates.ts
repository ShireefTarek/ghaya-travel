export function bookingConfirmationEmail({
  customerName,
  packageTitle,
  total,
  currency,
  bookingId
}: {
  customerName: string;
  packageTitle: string;
  total: number;
  currency: string;
  bookingId: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif">
      <h1>شكراً لاختيارك غاية للسياحة</h1>
      <p>Hi ${customerName},</p>
      <p>Your booking for <strong>${packageTitle}</strong> has been confirmed.</p>
      <p>Total paid: ${total.toFixed(2)} ${currency}</p>
      <p>Booking reference: <strong>${bookingId}</strong></p>
      <p>We will share your itinerary and e-tickets shortly.</p>
    </div>
  `;
}
