# 💎 D3D Dashboard

Plateforme ERP (Enterprise Resource Planning) moderne pour la gestion de l'atelier de gravure **2D3D Crystal**.
Développée avec les dernières technologies du web pour une performance, une sécurité et une évolutivité maximales.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## 🚀 Fonctionnalités Principales

### 📦 Gestion des Commandes & Production
*   **Création Intuitive (Wizard)** : Formulaire en 4 étapes (Infos, Client, Produits, Récap).
*   **Pipeline Visuel** : Suivi des statuts (À vérifier 🔵, En production 🟠, Expédition 🟣, Livrée 🟢).
*   **Gestion de Fichiers** : Upload sécurisé des photos clients sur le Cloud.
*   **Séquençage** : Numérotation automatique par préfixe (BOG, WEB, ERIC) ou personnalisé.

### 👥 CRM & Partenaires (B2B/B2C)
*   **Clients** : Base de données centralisée, recherche instantanée, historique complet.
*   **Espace Revendeur** : Portail dédié aux partenaires B2B avec isolation des données (chaque revendeur ne voit que ses commandes).
*   **Système d'Invitation** : Enrôlement sécurisé des nouveaux revendeurs et administrateurs par email.

### 🛍️ Catalogue & Stock
*   **Gestion Fine** : Prix en centimes (précision comptable), dimensions, catégories (Bloc, Cœur, Cadre...).
*   **Stock** : Statuts avancés (Disponible, Rupture de stock, Masqué).
*   **Synchronisation** : Images produits hébergées sur CDN haute performance.

### 💳 Facturation & Admin
*   **Factures PDF** : Génération automatique conforme (HT, TVA 21%, TTC, Mentions légales).
*   **Dashboard** : Statistiques financières en temps réel (CA Net HT, volumes).
*   **Équipe** : Gestion des accès administrateurs et maintenance système.

---

## 🛠️ Stack Technique (L'Architecture)

Ce projet repose sur une **Clean Architecture** séparant strictement les responsabilités.

### 🌐 Core & Frontend
*   **Framework** : [Next.js 16](https://nextjs.org/) (App Router & Server Actions).
*   **Langage** : TypeScript (Typage strict pour une robustesse maximale).
*   **UI Kit** : [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) (Design System cohérent et responsive).
*   **Icônes** : Lucide React.

### 💾 Backend & Data
*   **Base de Données** : PostgreSQL (Hébergé sur [Neon.tech](https://neon.tech/) - Serverless).
*   **ORM** : [Prisma](https://www.prisma.io/) (Gestion des schémas et migrations).
*   **Sécurité** : [NextAuth.js v4](https://next-auth.js.org/) (Sessions JWT, Hachage BCrypt).

### ☁️ Infrastructure & Services
*   **Stockage** : [Cloudinary](https://cloudinary.com/) (Hébergement et optimisation d'images).
*   **Temps Réel** : [Pusher](https://pusher.com/) (WebSockets pour les notifications instantanées).
*   **Emails** : [Nodemailer](https://nodemailer.com/) (SMTP Transactionnel) + Templates HTML.

---

## 🗂️ Structure du Code

L'organisation des dossiers suit les meilleures pratiques Next.js 2025 :

```bash
src/
├── actions/        # ⚡️ MUTATIONS (Server Actions)
│   # Contient uniquement la logique d'écriture (Create/Update/Delete)
│   # Sécurisé par RBAC (vérification des rôles au début de chaque fonction)
│
├── app/            # 🌐 ROUTAGE (Pages & Layouts)
│   ├── (auth)/     # Page de connexion isolée
│   ├── dashboard/  # Application métier protégée
│   └── api/        # Webhooks et endpoints spécifiques
│
├── components/     # 🧩 UI (Interface Utilisateur)
│   ├── ui/         # Composants atomiques (Boutons, Inputs...)
│   └── ...         # Composants métier (Tableaux, Cartes...)
│
├── lib/            # 🧠 LOGIQUE & UTILITAIRES
│   ├── data/       # Lectures seules (Requêtes Prisma optimisées)
│   ├── services/   # Clients tiers (Pusher, Cloudinary, Mailer)
│   └── utils/      # Fonctions pures (Formatage monétaire, dates...)
│
├── types/          # 🛡️ CONTRATS DE DONNÉES
│   # Définitions TypeScript partagées entre Front et Back
│
└── emails/         # 📧 TEMPLATES
    # Modèles d'emails transactionnels (Bienvenue, Notifs...)
```

---

## 📦 Installation & Déploiement

### 1. Installation Locale
```bash
git clone <repo_url>
cd d3d-dashboard
npm install
```

### 2. Configuration (`.env`)
Créez un fichier `.env` à la racine avec les clés suivantes :
```env
# Base de données
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="votre_cle_secrete"
NEXTAUTH_URL="http://localhost:3000"

# Services Tiers
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

PUSHER_APP_ID="..."
NEXT_PUBLIC_PUSHER_KEY="..."
PUSHER_SECRET="..."

GMAIL_USER="..."
GMAIL_APP_PASSWORD="..."
```

### 3. Initialisation
```bash
npx prisma generate   # Génère le client DB
npx prisma db seed    # Remplit la base avec les données de prod (Admins & Produits)
```

### 4. Lancement
```bash
npm run dev
```

---

## 🔒 Sécurité & Maintenance

*   **Rôles (RBAC)** : Le système distingue strictement `ADMIN` et `REVENDEUR`. Chaque Server Action vérifie l'identité et les droits avant d'exécuter une modification.
*   **Nettoyage Automatique** : Un outil intégré dans "Paramètres" permet de scanner Cloudinary et de supprimer les fichiers orphelins.
*   **Validation** : Toutes les entrées utilisateurs sont validées par **Zod** pour empêcher les injections et les données corrompues.

---
Développé avec passion par **Reda** et **Samuël** pour **D3D Crystal**. 💎
