# Guide d'Installation - Portfolio Professionnel

## 📋 Étapes d'Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer PostgreSQL

Assurez-vous que PostgreSQL est installé et en cours d'exécution sur votre machine.

Créez une base de données :
```sql
CREATE DATABASE portfolio_db;
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-tres-securise-changez-en-production"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

**⚠️ IMPORTANT** : 
- Remplacez `user` et `password` par vos identifiants PostgreSQL
- Changez `NEXTAUTH_SECRET` par une clé secrète forte (générez avec `openssl rand -base64 32`)
- Changez les identifiants admin après la première connexion !

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# Créer le compte admin initial
npm run db:seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Première Connexion Admin

1. Allez sur http://localhost:3000/admin/login
2. Connectez-vous avec :
   - **Email** : Celui défini dans `.env` (par défaut `admin@example.com`)
   - **Mot de passe** : Celui défini dans `.env` (par défaut `admin123`)

**⚠️ Changez immédiatement ces identifiants après la première connexion !**

## 📝 Personnalisation

### Modifier les informations de contact

Éditez `src/components/sections/Contact.tsx` pour mettre à jour :
- Email
- Téléphone
- WhatsApp
- Liens réseaux sociaux

### Modifier la section À propos

Éditez `src/components/sections/About.tsx` pour :
- Ajouter votre photo (placez-la dans `public/` et mettez à jour le chemin)
- Modifier la description
- Ajuster les compétences et leurs niveaux

### Modifier les services

Éditez `src/components/sections/Services.tsx` pour personnaliser les services proposés.

## 🚀 Déploiement

### Vercel (Recommandé)

1. Push votre code sur GitHub/GitLab
2. Connectez le repo à Vercel
3. Configurez les variables d'environnement dans Vercel
4. Configurez PostgreSQL (Vercel Postgres ou autre service)
5. Déployez !

### Variables d'environnement en production

Assurez-vous de définir :
- `DATABASE_URL` : URL de votre base PostgreSQL
- `NEXTAUTH_URL` : URL de votre site (ex: https://votre-site.com)
- `NEXTAUTH_SECRET` : Une clé secrète forte

## 🐛 Résolution de Problèmes

### Erreur de connexion à la base de données

- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez que `DATABASE_URL` est correct dans `.env`
- Vérifiez que la base de données existe

### Erreur lors de l'upload d'images

- Vérifiez que le dossier `public/uploads` existe (créé automatiquement)
- Vérifiez les permissions d'écriture

### Erreur d'authentification

- Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`
- Vérifiez que le compte admin existe (relancez `npm run db:seed` si nécessaire)

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
