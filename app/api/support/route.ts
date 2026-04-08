import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function getRequiredEnv(
    name: "RESEND_API_KEY" | "SUPPORT_TO_EMAIL" | "SUPPORT_FROM_EMAIL",
): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export async function POST(request: Request) {
    console.log("SUPPORT_ROUTE_RESEND_V1");

    try {
        const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));

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

        const to = getRequiredEnv("SUPPORT_TO_EMAIL");
        const from = getRequiredEnv("SUPPORT_FROM_EMAIL");

        console.log("Using Resend route", {
            hasApiKey: Boolean(process.env.RESEND_API_KEY),
            to,
            from,
            subject,
        });

        const result = await resend.emails.send({
            from,
            to,
            subject: `[Support] ${subject}`,
            replyTo: email || undefined,
            text: `From: ${email || "Anonymous"}\nSubject: ${subject}\n\n${message}`,
        });

        console.log("Resend result", result);

        if (result.error) {
            console.error("Resend send error:", result.error);
            return NextResponse.json(
                { error: "Failed to send email. Please try again later." },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Support email error:", error);
        return NextResponse.json(
            { error: "Failed to send email. Please try again later." },
            { status: 500 },
        );
    }
}