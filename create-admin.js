const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // CHANGEZ CES VALEURS !
    const email = 'adebiyiherves14@gmail.com';  // ← Votre email
    const password = 'adebiyiherve2002';   // ← Votre mot de passe
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Vérifier si l'admin existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà !');
      console.log('Suppression de l\'ancien utilisateur...');
      await prisma.user.delete({
        where: { email: email }
      });
    }
    
    // Créer l'utilisateur admin
    const admin = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: 'Admin'
      }
    });
    
    console.log('✅ Admin créé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Mot de passe:', password);
    console.log('🆔 User ID:', admin.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Vous pouvez maintenant vous connecter sur /admin/login');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();