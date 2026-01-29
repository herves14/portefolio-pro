import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  // Sécurité simple
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  
  if (secret !== 'INIT_DB_2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Vérifier si admin existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@portfolio.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin déjà créé',
        email: 'admin@portfolio.com'
      });
    }

    // Créer admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        email: 'admin@portfolio.com',
        password: hashedPassword,
        name: 'Administrateur'
      }
    });

    // Créer projets de démo
    await prisma.project.createMany({
      data: [
        {
          title: 'Système de gestion restaurant',
          shortDescription: 'Application complète pour restaurants',
          fullDescription: 'Gestion des commandes, stock et finances en temps réel.',
          problemSolved: 'Réduction des erreurs de 80% et gain de 3h/jour',
          technologies: ['React', 'Node.js', 'PostgreSQL'],
          status: 'published',
          completionDate: new Date('2024-01-15')
        },
        {
          title: 'Site e-commerce moderne',
          shortDescription: 'Boutique en ligne responsive',
          fullDescription: 'Plateforme e-commerce avec paiement mobile money intégré.',
          problemSolved: 'Augmentation des ventes de 150% en 3 mois',
          technologies: ['Next.js', 'Stripe', 'Tailwind CSS'],
          status: 'published',
          completionDate: new Date('2024-02-20')
        }
      ]
    });

    return NextResponse.json({ 
      success: true,
      message: '✅ Base de données initialisée !',
      admin: {
        email: 'admin@portfolio.com',
        password: 'admin123'
      },
      warning: '⚠️ CHANGE LE MOT DE PASSE IMMÉDIATEMENT !'
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: 'Échec du seed',
      details: error.message 
    }, { status: 500 });
  }
}