import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    console.log("🔐 [LOGIN] Tentative de connexion");
    console.log("📧 [LOGIN] Email reçu:", email);
    console.log("🔑 [LOGIN] Mot de passe reçu (longueur):", password?.length || 0);

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ [LOGIN] Utilisateur non trouvé pour:", email);
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    console.log("✅ [LOGIN] Utilisateur trouvé:", user.email);
    console.log("🔐 [LOGIN] Hash stocké (début):", user.password?.substring(0, 20) + "...");
    console.log("🔐 [LOGIN] Hash stocké (longueur):", user.password?.length || 0);
    console.log("🔐 [LOGIN] Hash commence par $2?:", user.password?.startsWith("$2") || false);

    // Vérifier si le mot de passe est hashé (commence par $2a$, $2b$, $2y$ ou $2x$)
    const isHashed = user.password?.startsWith("$2");
    
    if (!isHashed) {
      console.error("⚠️ [LOGIN] ATTENTION: Le mot de passe stocké n'est PAS hashé !");
      console.error("⚠️ [LOGIN] Le mot de passe semble être en clair:", user.password);
      console.error("⚠️ [LOGIN] Il faut réinitialiser le mot de passe avec un hash bcrypt.");
      return NextResponse.json(
        { error: "Configuration incorrecte. Contactez l'administrateur." },
        { status: 500 }
      );
    }

    // Vérifier le mot de passe
    console.log("🔄 [LOGIN] Comparaison bcrypt en cours...");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("✅ [LOGIN] Résultat de la comparaison:", isValidPassword);

    if (!isValidPassword) {
      console.log("❌ [LOGIN] Mot de passe incorrect");
      console.log("🔍 [LOGIN] Détails:");
      console.log("  - Mot de passe saisi:", password);
      console.log("  - Hash stocké:", user.password);
      console.log("  - Hash semble valide (commence par $2):", user.password?.startsWith("$2"));
      
      // Test de hash pour vérifier si bcrypt fonctionne
      const testHash = await bcrypt.hash("test", 10);
      console.log("🧪 [LOGIN] Test bcrypt.hash fonctionne:", testHash?.startsWith("$2"));
      
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    console.log("✅ [LOGIN] Authentification réussie pour:", email);

    // Créer le token JWT
    const secret = process.env.NEXTAUTH_SECRET || "fallback-secret";
    const token = sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: "7d" }
    );

    // Retourner le token
    const response = NextResponse.json(
      { message: "Connexion réussie", token },
      { status: 200 }
    );

    // Définir le cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error) {
    console.error("❌ [LOGIN] Erreur lors de la connexion:", error);
    
    if (error instanceof z.ZodError) {
      console.error("❌ [LOGIN] Erreur de validation Zod:", error.errors);
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("❌ [LOGIN] Erreur serveur complète:", {
      message: error instanceof Error ? error.message : "Erreur inconnue",
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
