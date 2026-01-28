import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const validatedData = contactSchema.parse(body);

    // Ici, tu peux ajouter l'envoi d'email (Nodemailer, Resend, etc.)
    // Pour l'instant, on simule juste le succès
    console.log("Nouveau message de contact:", validatedData);

    // TODO: Envoyer un email avec le message
    // Exemple avec Resend ou Nodemailer

    return NextResponse.json(
      { message: "Message envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
