import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Here you can integrate with your email service
    // For now, we'll log it and send a success response

    // Example: Send email using a service like Resend, SendGrid, or Nodemailer
    // You'll need to set up your email service and add credentials to .env

    const emailBody = `
New Support Request

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from BoostLinkPro Support Form
    `.trim();

    console.log("Support request received:", emailBody);

    // TODO: Replace this with actual email sending
    // Example with fetch to an email API:
    /*
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "support@boostlinkpro.com",
        to: "your-email@example.com", // Your email
        reply_to: email,
        subject: `Support: ${subject}`,
        text: emailBody,
      }),
    });
    */

    return NextResponse.json(
      { message: "Support request received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing support request:", error);
    return NextResponse.json(
      { error: "Failed to process support request" },
      { status: 500 },
    );
  }
}
