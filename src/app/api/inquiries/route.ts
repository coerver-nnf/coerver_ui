import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  camp: "Kamp",
  academy: "Akademija",
  course: "Tečaj",
  club: "Klub",
  individual: "Individualni trening",
  general: "Opći upit",
};

// Check if string is a valid UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, phone, message, program_id, childAge } = body;

    // Validate required fields
    if (!name || !email || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Only use program_id if it's a valid UUID, otherwise include it in the message
    const validProgramId = program_id && isValidUUID(program_id) ? program_id : null;
    const programSlug = program_id && !isValidUUID(program_id) ? program_id : null;

    // If program_id is a slug (not UUID), prepend it to the message
    let fullMessage = message;
    if (programSlug) {
      fullMessage = `Program: ${programSlug}\n\n${message}`;
    }

    // Insert into Supabase
    const supabase = await createClient();
    const { data: inquiry, error: dbError } = await supabase
      .from("inquiries")
      .insert({
        type,
        name,
        email,
        phone: phone || null,
        message: fullMessage,
        program_id: validProgramId,
        status: "new",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Coerver Croatia <noreply@coervercroatia.com>",
        to: "info@coervercroatia.com",
        subject: `Novi upit: ${INQUIRY_TYPE_LABELS[type] || type} - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #00A651; padding: 20px; text-align: center;">
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
                    <a href="mailto:${email}" style="color: #00A651;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                    <a href="tel:${phone}" style="color: #00A651;">${phone}</a>
                  </td>
                </tr>
                ` : ""}
                ${childAge ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Dob djeteta:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${childAge}</td>
                </tr>
                ` : ""}
                ${programSlug ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Program:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${programSlug}</td>
                </tr>
                ` : ""}
              </table>

              <div style="margin-top: 20px;">
                <h3 style="color: #1a1a1a; margin-bottom: 10px;">Poruka:</h3>
                <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>
            </div>

            <div style="padding: 20px; background-color: #1a1a1a; text-align: center;">
              <p style="color: #888; margin: 0; font-size: 12px;">
                Ovaj email je automatski generiran putem web stranice coervercroatia.com
              </p>
              <p style="color: #888; margin: 10px 0 0; font-size: 12px;">
                <a href="https://coervercroatia.com/dashboard/admin/inquiries" style="color: #00A651;">
                  Pogledaj u admin panelu
                </a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      // The inquiry is already saved to the database
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
