import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  camp: "Kamp",
  academy: "Akademija",
  course: "Tečaj",
  club: "Klub",
  individual: "Individualni trening",
  general: "Opći upit",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, phone, message, program, childAge } = body;

    // Validate required fields
    if (!name || !email || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email notification
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Coerver Croatia <noreply@coervercroatia.com>",
      to: "info@coervercroatia.com",
      subject: `Novi upit: ${INQUIRY_TYPE_LABELS[type] || type} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #95C121; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Novi Upit</h1>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Detalji upita</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Tip upita:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${INQUIRY_TYPE_LABELS[type] || type}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Ime i prezime:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <a href="mailto:${email}" style="color: #95C121;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <a href="tel:${phone}" style="color: #95C121;">${phone}</a>
                </td>
              </tr>
              ` : ""}
              ${childAge ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Dob djeteta:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${childAge}</td>
              </tr>
              ` : ""}
              ${program ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Program:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${program}</td>
              </tr>
              ` : ""}
            </table>

            <div style="margin-top: 20px;">
              <h3 style="color: #1a1a1a; margin-bottom: 10px;">Poruka:</h3>
              <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                ${(message || "").replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>

          <div style="padding: 20px; background-color: #1a1a1a; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">
              Ovaj email je automatski generiran putem web stranice coervercroatia.com
            </p>
            <p style="color: #888; margin: 10px 0 0; font-size: 12px;">
              <a href="https://coervercroatia.com/dashboard/admin/inquiries" style="color: #95C121;">
                Pogledaj u admin panelu
              </a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
