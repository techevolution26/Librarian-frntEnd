// app/api/support/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function getRequiredEnv(name: "GMAIL_USER" | "GMAIL_APP_PASSWORD"): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            subject?: string;
            message?: string;
            email?: string;
        };

        const subject = body.subject?.trim();
        const message = body.message?.trim();
        const email = body.email?.trim();

        if (!subject || !message) {
            return NextResponse.json(
                { error: "Subject and message are required" },
                { status: 400 },
            );
        }

        const gmailUser = getRequiredEnv("GMAIL_USER");
        const gmailAppPassword = getRequiredEnv("GMAIL_APP_PASSWORD");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmailUser,
                pass: gmailAppPassword,
            },
        });

        await transporter.verify();

        await transporter.sendMail({
            from: `"Support Widget" <${gmailUser}>`,
            to: gmailUser,
            subject: `[Support] ${subject}`,
            replyTo: email || undefined,
            text: `From: ${email || "Anonymous"}\nSubject: ${subject}\n\n${message}`,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Support email error:", error);

        return NextResponse.json(
            { error: "Failed to send email. Please try again later." },
            { status: 500 },
        );
    }
}