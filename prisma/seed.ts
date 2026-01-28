import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Créer ou mettre à jour l'admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin créé/mis à jour:", admin.email);
  console.log("📧 Email:", adminEmail);
  console.log("🔑 Mot de passe:", adminPassword);
  console.log("\n⚠️  Changez le mot de passe après la première connexion !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
