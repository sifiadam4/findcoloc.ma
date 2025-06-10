"use server";

import nodemailer from "nodemailer";

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send email function
export async function sendEmail({ to, subject, html, text }) {
  try {
    // Validate required parameters
    if (!to || !subject || !html) {
      console.error("Missing required email parameters:", {
        to,
        subject,
        html: !!html,
      });
      return { success: false, error: "Missing required email parameters" };
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log("SMTP not configured, skipping email send:", { to, subject });
      return { success: true, messageId: "dev-mode" };
    }

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: `"FindColoc.ma" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text fallback
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
}

// Send application notification
export async function sendApplicationNotification(
  ownerEmail,
  ownerName,
  applicantName,
  offerTitle
) {
  return sendEmail({
    to: ownerEmail,
    subject: "Nouvelle candidature pour votre annonce",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nouvelle candidature reçue</h2>
        <p>Bonjour ${ownerName},</p>
        <p>Vous avez reçu une nouvelle candidature de <strong>${applicantName}</strong> pour votre annonce :</p>
        <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <strong>${offerTitle}</strong>
        </p>
        <p>
          <a href="${process.env.NEXTAUTH_URL}/mes-demandes" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Voir les candidatures
          </a>
        </p>
        <p>L'équipe FindColoc.ma</p>
      </div>
    `,
  });
}
