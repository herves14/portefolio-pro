const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed production...\n');

  try {
    // Vérifier si admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@portfolio.com' }
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin existe déjà');
      console.log('📧 Email: admin@portfolio.com\n');
      return;
    }

    // Créer l'admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@portfolio.com',
        password: hashedPassword,
        name: 'Administrateur'
      }
    });

    console.log('✅ Admin créé avec succès !');
    console.log('📧 Email: admin@portfolio.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  CHANGE LE MOT DE PASSE IMMÉDIATEMENT !\n');

    // Créer des projets de démo
    await prisma.project.createMany({
      skipDuplicates: true,
      data: [
        {
          title: 'Système de gestion restaurant',
          shortDescription: 'Application complète pour restaurants',
          fullDescription: 'Système permettant de gérer les commandes, le stock et les finances en temps réel.',
          problemSolved: 'Réduction des erreurs de 80% et gain de 3h/jour',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Express'],
          status: 'published',
          completionDate: new Date('2024-01-15')
        },
        {
          title: 'Site e-commerce moderne',
          shortDescription: 'Boutique en ligne responsive',
          fullDescription: 'Plateforme e-commerce avec paiement mobile money intégré et gestion complète.',
          problemSolved: 'Augmentation des ventes de 150% en 3 mois',
          technologies: ['Next.js', 'Stripe', 'Tailwind CSS', 'PostgreSQL'],
          status: 'published',
          completionDate: new Date('2024-02-20')
        }
      ]
    });

    console.log('✅ Projets de démo créés !\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });