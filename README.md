# Portfolio Professionnel

Portfolio professionnel complet avec site public et dashboard admin pour la gestion de projets.

## 🚀 Stack Technique

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de données**: PostgreSQL
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: Zod, React Hook Form
- **Upload**: Stockage local (peut être migré vers Cloudinary)

## 📋 Prérequis

- Node.js 18+ et npm
- PostgreSQL installé et configuré
- Git

## 🛠️ Installation

1. **Cloner le projet** (ou utiliser le dossier actuel)

2. **Installer les dépendances**:
```bash
npm install
```

3. **Configurer les variables d'environnement**:
Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-tres-securise-changez-en-production"

# Admin (créé via seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

**⚠️ Important**: Changez `NEXTAUTH_SECRET` et les identifiants admin en production !

4. **Configurer la base de données**:
```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# Créer le compte admin initial
npm run db:seed
```

5. **Lancer le serveur de développement**:
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
portefolio-pro/
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   └── seed.ts                 # Script de seed pour créer l'admin
├── public/
│   └── uploads/                # Images uploadées (créé automatiquement)
├── src/
│   ├── app/
│   │   ├── admin/              # Dashboard admin
│   │   │   ├── login/         # Page de connexion
│   │   │   ├── dashboard/     # Tableau de bord
│   │   │   └── projects/      # Gestion des projets
│   │   ├── api/               # Routes API
│   │   │   ├── auth/          # Authentification
│   │   │   ├── projects/      # CRUD projets
│   │   │   ├── contact/       # Formulaire de contact
│   │   │   └── upload/        # Upload d'images
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Page d'accueil
│   │   └── globals.css        # Styles globaux
│   ├── components/
│   │   ├── sections/          # Sections du site public
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Footer.tsx
│   │   └── Navigation.tsx     # Navigation principale
│   └── lib/
│       └── auth.ts            # Utilitaires d'authentification
├── .env.example               # Exemple de variables d'environnement
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔐 Accès Admin

Après avoir exécuté `npm run db:seed`, vous pouvez vous connecter avec :
- **URL**: http://localhost:3000/admin/login
- **Email**: (celui défini dans `.env`, par défaut `admin@example.com`)
- **Mot de passe**: (celui défini dans `.env`, par défaut `admin123`)

**⚠️ Changez ces identifiants immédiatement après la première connexion !**

## ✨ Fonctionnalités

### Site Public
- ✅ Section Hero avec animations
- ✅ Section Services
- ✅ Portfolio avec modal de détails
- ✅ Section À propos avec compétences
- ✅ Formulaire de contact
- ✅ Footer avec liens sociaux
- ✅ Design responsive et moderne
- ✅ Navigation fluide

### Dashboard Admin
- ✅ Connexion sécurisée (JWT)
- ✅ Tableau de bord avec statistiques
- ✅ Gestion complète des projets (CRUD)
- ✅ Upload d'images multiples
- ✅ Gestion des statuts (publié/brouillon)
- ✅ Interface intuitive et moderne

## 🚢 Déploiement

### Vercel (Recommandé)

1. Push le code sur GitHub/GitLab
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement dans Vercel
4. Configurer PostgreSQL (Vercel Postgres ou autre service)
5. Déployer !

### Variables d'environnement en production

Assurez-vous de définir :
- `DATABASE_URL`: URL de votre base PostgreSQL
- `NEXTAUTH_URL`: URL de votre site (ex: https://votre-site.com)
- `NEXTAUTH_SECRET`: Une clé secrète forte (générez avec `openssl rand -base64 32`)

## 📝 Notes

- Les images sont stockées localement dans `public/uploads/`. Pour la production, considérez l'utilisation de Cloudinary ou AWS S3.
- Le formulaire de contact nécessite une configuration d'email (Resend, Nodemailer, etc.) pour fonctionner complètement.
- Personnalisez les informations de contact dans `src/components/sections/Contact.tsx`

## 🤝 Contribution

N'hésitez pas à proposer des améliorations ou signaler des bugs !

## 📄 Licence

Ce projet est sous licence MIT.
