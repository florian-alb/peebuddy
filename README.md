# PeeBuddy

PeeBuddy est une application qui aide les utilisateurs à trouver des toilettes publiques à proximité. Elle fournit une interface cartographique interactive permettant de localiser, évaluer et naviguer vers les toilettes les plus proches.

## Table des matières

- [Architecture technique](#architecture-technique)
- [Structure du projet](#structure-du-projet)
- [Stack technique](#stack-technique)
- [API](#api)
  - [Endpoints](#endpoints)
  - [Authentification](#authentification)
- [Frontend](#frontend)
  - [PWA](#pwa)
  - [Web](#web)
- [Base de données](#base-de-données)
- [Déploiement](#déploiement)
- [Développement](#développement)

## Architecture technique

PeeBuddy est structuré comme un monorepo utilisant Turborepo pour gérer les différentes applications et packages. Cette architecture permet de partager du code entre les différentes parties de l'application tout en maintenant une séparation claire des responsabilités.

### Structure du projet

```
peebuddy/
├── apps/                   # Applicationspanel-1-13
│   ├── api/                # Backend API (Next.js API Routes)
│   ├── pwa/                # Progressive Web App (frontend mobile)
│   └── web/                # Site web (frontend desktop)
├── packages/               # Packages partagés
│   ├── auth/               # Authentification
│   ├── database/           # Couche d'accès à la base de données (Prisma)
│   ├── eslint-config/      # Configuration ESLint partagée
│   ├── map/                # Composants et utilitaires pour la carte
│   ├── typescript-config/  # Configuration TypeScript partagée
│   └── ui/                 # Composants UI partagés
└── scripts/                # Scripts utilitaires
```

## Stack technique

PeeBuddy utilise une stack moderne et typée:

- **Framework**: [Next.js](https://nextjs.org/) pour l'API et les applications frontend
- **Langage**: [TypeScript](https://www.typescriptlang.org/) pour un typage fort et une meilleure maintenabilité
- **Base de données**: [PostgreSQL](https://www.postgresql.org/) avec [Prisma](https://www.prisma.io/) comme ORM
- **Authentification**: Solution personnalisée basée sur les sessions
- **Cartographie**: [Leaflet](https://leafletjs.com/) pour l'affichage des cartes interactives
- **UI**: Composants personnalisés avec [Tailwind CSS](https://tailwindcss.com/)
- **Gestion de monorepo**: [Turborepo](https://turbo.build/repo) avec [pnpm](https://pnpm.io/) comme gestionnaire de paquets
- **Déploiement**: Configuration pour déploiement cloud (détails non spécifiés dans le code)

## API

L'API de PeeBuddy est construite avec Next.js API Routes et fournit des endpoints RESTful pour interagir avec les données de l'application.

### Endpoints

#### Toilettes

- `GET /api/toilets` - Récupérer toutes les toilettes avec filtrage optionnel
- `POST /api/toilets` - Créer une nouvelle toilette
- `GET /api/toilets/[id]` - Récupérer une toilette spécifique
- `PUT /api/toilets/[id]` - Mettre à jour une toilette
- `DELETE /api/toilets/[id]` - Supprimer une toilette
- `GET /api/toilets/nearby` - Trouver les toilettes à proximité d'une position donnée
- `POST /api/toilets/verify` - Vérifier une toilette (admin uniquement)
- `POST /api/toilets/unverify` - Annuler la vérification d'une toilette (admin uniquement)

#### Photos

- `GET /api/pictures` - Récupérer toutes les photos
- `POST /api/pictures` - Ajouter une nouvelle photo
- `GET /api/pictures/[id]` - Récupérer une photo spécifique
- `DELETE /api/pictures/[id]` - Supprimer une photo
- `POST /api/pictures/verify` - Vérifier une photo (admin uniquement)
- `POST /api/pictures/unverify` - Annuler la vérification d'une photo (admin uniquement)

#### Avis

- `GET /api/reviews` - Récupérer tous les avis
- `POST /api/reviews` - Créer un nouvel avis
- `GET /api/reviews/[id]` - Récupérer un avis spécifique
- `PUT /api/reviews/[id]` - Mettre à jour un avis
- `DELETE /api/reviews/[id]` - Supprimer un avis
- `POST /api/reviews/verify` - Vérifier un avis (admin uniquement)
- `POST /api/reviews/unverify` - Annuler la vérification d'un avis (admin uniquement)

#### Utilisateurs

- `GET /api/users` - Récupérer tous les utilisateurs (admin uniquement)
- `GET /api/users/[id]` - Récupérer un utilisateur spécifique

#### Autres

- `GET /api/search` - Rechercher des toilettes
- `GET /api/stats` - Obtenir des statistiques sur l'application
- `GET /api/feed` - Obtenir un flux d'activité récente
- `GET /api/docs` - Documentation de l'API

### Authentification

L'API utilise un système d'authentification basé sur les sessions avec différents niveaux d'accès:

- **Routes publiques**: Accessibles sans authentification (principalement les requêtes GET)
- **Routes protégées**: Nécessitent une authentification utilisateur
- **Routes admin**: Nécessitent une authentification avec le rôle admin

Le middleware d'authentification vérifie les tokens de session et ajoute les informations utilisateur aux en-têtes des requêtes pour les gestionnaires de routes.

## Frontend

### PWA (Progressive Web App)

L'application mobile est construite comme une PWA utilisant Next.js et React. Elle offre:

- **Carte interactive**: Affichage des toilettes à proximité sur une carte Leaflet
- **Géolocalisation**: Détection de la position de l'utilisateur
- **Navigation**: Itinéraires vers les toilettes sélectionnées
- **Filtres**: Recherche de toilettes selon différents critères (gratuites, publiques, accessibles aux personnes handicapées, etc.)
- **Avis et évaluations**: Possibilité de laisser des avis et des notes sur les toilettes visitées
- **Mode hors ligne**: Fonctionnalités de base disponibles sans connexion internet

### Web

L'application web offre une expérience similaire à la PWA mais optimisée pour les écrans plus grands, avec des fonctionnalités supplémentaires pour la gestion de compte et l'administration.

## Base de données

PeeBuddy utilise PostgreSQL avec Prisma comme ORM. Le schéma de base de données comprend:

- **User**: Informations utilisateur et authentification
- **Session**: Sessions utilisateur pour l'authentification
- **Account**: Comptes liés aux utilisateurs (authentification externe)
- **Verification**: Vérifications d'email et autres
- **Toilet**: Informations sur les toilettes (position, caractéristiques)
- **Picture**: Photos des toilettes
- **Review**: Avis et évaluations des toilettes

## Développement

### Prérequis

- Node.js >=20
- pnpm 8.15.4 ou supérieur
- PostgreSQL

### Installation

```bash
# Cloner le dépôt
git clone <repository-url>
cd peebuddy

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Générer le client Prisma
pnpm -F @workspace/db db:generate

# Lancer les migrations de base de données
pnpm -F @workspace/db db:migrate

# Démarrer le développement
pnpm dev
```

### Scripts disponibles

- `pnpm build`: Construire toutes les applications et packages
- `pnpm dev`: Démarrer tous les services en mode développement
- `pnpm lint`: Exécuter le linting sur tous les projets
- `pnpm format`: Formater le code avec Prettier

## Déploiement

Les détails spécifiques de déploiement ne sont pas explicitement définis dans le code source, mais l'architecture est compatible avec divers services cloud comme Vercel, Netlify ou des solutions auto-hébergées.
