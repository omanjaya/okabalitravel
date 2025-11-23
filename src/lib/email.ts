import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email functionality will be disabled.");
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "OkabaliTravel <noreply@okabalitravel.com>",
  replyTo: "support@okabalitravel.com",
} as const;

export async function sendEmail({
  to,
  subject,
  html,
  react,
}: {
  to: string | string[];
  subject: string;
  html?: string;
  react?: React.ReactElement;
}) {
  if (!resend) {
    console.warn("Resend is not configured. Email not sent:", { to, subject });
    return { success: false, error: "Email service not configured" };
  }

  try {
    const emailOptions: any = {
      from: EMAIL_CONFIG.from,
      to,
      subject,
      replyTo: EMAIL_CONFIG.replyTo,
    };

    if (react) {
      emailOptions.react = react;
    } else if (html) {
      emailOptions.html = html;
    }

    const data = await resend.emails.send(emailOptions);

    console.log("Email sent successfully:", { to, subject, data });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
