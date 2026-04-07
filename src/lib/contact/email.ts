import type { ContactFormValues } from "./schema"

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatLabel(label: string, value?: string) {
  const safeValue = value ? escapeHtml(value) : "—"
  return `
    <tr>
      <td style="padding:12px 16px;background:#fafafa;border:1px solid #e5e7eb;font-weight:600;color:#111827;width:180px;">${escapeHtml(label)}</td>
      <td style="padding:12px 16px;background:#ffffff;border:1px solid #e5e7eb;color:#374151;">${safeValue}</td>
    </tr>
  `
}

export function renderContactAdminEmail(
  payload: ContactFormValues,
  submittedAt: string
) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;color:#111827;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
        <div style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Sixth Gear Moto Supply</p>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;">New contact form submission</h1>
        </div>
        <div style="padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;">
            ${formatLabel("Submitted At", submittedAt)}
            ${formatLabel("First Name", payload.firstName)}
            ${formatLabel("Last Name", payload.lastName)}
            ${formatLabel("Email", payload.email)}
            ${formatLabel("Phone", payload.phone)}
            ${formatLabel("Subject", payload.subject)}
            ${formatLabel("Order Number", payload.orderNumber)}
            ${formatLabel("Reply To", payload.email)}
            ${formatLabel("Message", payload.message.replace(/\n/g, "<br />"))}
          </table>
        </div>
      </div>
    </div>
  `
}

export function renderContactCustomerEmail(
  payload: ContactFormValues,
  fallbackEmail: string
) {
  const escapedMessage = escapeHtml(payload.message).replace(/\n/g, "<br />")

  return `
    <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;color:#111827;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
        <div style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Sixth Gear Moto Supply</p>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;">We received your message</h1>
        </div>
        <div style="padding:24px 28px;color:#374151;line-height:1.7;">
          <p style="margin-top:0;">Hi ${escapeHtml(payload.firstName)},</p>
          <p>Thanks for contacting Sixth Gear Moto Supply. We received your message and our team will review it shortly.</p>
          <div style="margin:20px 0;padding:16px;border:1px solid #e5e7eb;background:#fafafa;">
            <p style="margin:0 0 8px;font-weight:600;color:#111827;">Your submission summary</p>
            <p style="margin:0 0 8px;"><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
            <p style="margin:0;"><strong>Message:</strong><br />${escapedMessage}</p>
          </div>
          <p>We typically respond within 1–2 business days.</p>
          <p>If you need immediate follow-up, you can reply to this email or contact us at ${escapeHtml(
            fallbackEmail
          )}.</p>
          <p style="margin-bottom:0;">Regards,<br />Sixth Gear Moto Supply</p>
        </div>
      </div>
    </div>
  `
}
