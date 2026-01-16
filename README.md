# D3D Dashboard - Gestion de Commandes

Application de gestion interne pour l'atelier de gravure **D3D Crystal**.
Permet de gérer les commandes, les clients, le catalogue produits et le suivi de production.

## 🚀 Fonctionnalités Clés

- **Gestion des Commandes :** Création multi-étapes, upload de fichiers clients, suivi de statut interactif.
- **Facturation :** Génération de numéros de séquence (Auto/Manuel), impression PDF propre.
- **Clients & Produits :** Gestion complète (CRUD), recherche instantanée, historique.
- **Dashboard :** Vue d'ensemble avec statistiques en temps réel.
- **Sécurité :** Authentification, Validation stricte (Zod), Uploads sécurisés.

## 🛠️ Stack Technique

- **Framework :** [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Langage :** TypeScript (Strict mode)
- **Base de données :** PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **UI :** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Auth :** NextAuth.js v4

## 📦 Installation

### Pré-requis
- Node.js 18+
- PostgreSQL (Local ou Docker)

### 1. Cloner et installer les dépendances
```bash
git clone <repo_url>
cd d3d-dashboard
npm install
```

### 2. Configurer l'environnement
Copiez le fichier d'exemple (créez-en un si absent) :
```bash
cp .env.example .env
```
Remplissez les variables :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/d3d_db"
NEXTAUTH_SECRET="votre_cle_secrete_super_longue"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialiser la Base de Données
```bash
npx prisma migrate dev --name init
npx prisma db seed # (Optionnel : si un seed.ts est configuré)
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## 🗂️ Structure du Projet

```
src/
├── actions/        # Server Actions (Mutations : create, update, upload...)
├── app/            # Pages & Routes (App Router)
│   ├── api/        # Routes API (Search, Cron...)
│   ├── dashboard/  # Espace protégé (Admin)
│   └── (auth)/     # Login
├── components/     # Composants UI (Shadcn + Métier)
├── lib/            # Utilitaires & Data Access Layer
│   ├── data/       # Fonctions de lecture DB (Getters)
│   └── ...         # Helpers (Dates, Money, Prisma...)
├── types/          # Définitions TypeScript partagées
└── scripts/        # Scripts de maintenance (Cleanup...)
```

## 🛠️ Commandes Utiles

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Lance le serveur de production (après build) |
| `npm run lint` | Vérifie la qualité du code (ESLint) |
| `npm run cleanup` | Nettoie les fichiers uploadés orphelins (> 24h) |

## 🔒 Sécurité & Maintenance

- **Uploads :** Les fichiers clients sont stockés dans `public/uploads/orders`. Lancez régulièrement `npm run cleanup` pour supprimer les fichiers abandonnés.
- **Rôles :** Actuellement, tout utilisateur connecté a les droits d'administration.

---
Développé avec ❤️ par **Reda** ([@redasnkrs](https://github.com/redasnkrs)) et **Samuël** ([@Eultype](https://github.com/Eultype)) pour **D3D Crystal**.