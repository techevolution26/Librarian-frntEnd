// app/api/support/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        const { subject, message, email } = await request.json();

        // Basic validation
        if (!subject || !message) {
            return NextResponse.json(
                { error: "Subject and message are required" },
                { status: 400 }
            );
        }

        // Create a transporter using Gmail's SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Send the email to yourself
        await transporter.sendMail({
            from: `"Support Widget" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // you receive the message
            subject: `[Support] ${subject}`,
            replyTo: email || undefined, // if user provided email, they can be replied to
            text: `From: ${email || "Anonymous"}\n\n${message}`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email sending error:", error);
        return NextResponse.json(
            { error: "Failed to send email. Please try again later." },
            { status: 500 }
        );
    }
}