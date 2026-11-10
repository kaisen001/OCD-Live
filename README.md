# OCD Live

Site de réservation de lives de vente sur le TikTok House of Challenge.
Au studio de Lomé ou à distance. Un live dure 1 h 30.

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Le parcours du vendeur

1. Il choisit : au studio ou à distance.
2. Il choisit sa date sur le calendrier (à partir du 1er décembre 2026), puis son créneau.
3. Il choisit son pack (6 packs, de 1 à 12 lives).
4. Il présente son business.

L'équipe reçoit aussitôt un message : « Untel fait tel business, a réservé le mardi 1er décembre de 10:30 à 12:00 ».
Le vendeur reçoit un code, un numéro de membre OCD et une liste pour se préparer.
Quand l'équipe approuve, il reçoit son affiche à partager et sa carte de membre.

## Les pages

| Page | Rôle |
| --- | --- |
| `/` | Accueil, prix, programme des lives approuvés |
| `/reserver` | Réservation en 4 étapes |
| `/suivi?code=OCD-XXXXXX` | Suivi, affiche, carte OCD, préparation |
| `/histoire` | Pourquoi « Les Opportunités C'est Dehors » |
| `/admin` | Espace équipe : approuver, annuler, écrire au vendeur sur WhatsApp |

## Réglages

Copier `.env.example` vers `.env.local` et remplir.

- **Espace équipe** : `ADMIN_PASSWORD` et `ADMIN_SECRET`. En ligne, sans mot de passe défini, personne ne peut entrer.
- **Base de données** : `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`. Coller une fois `supabase/schema.sql` dans l'éditeur SQL de Supabase. Sans ces deux valeurs, les réservations vont dans `data/reservations.json` : bien pour tester, pas pour la mise en ligne.
- **Notification de l'équipe** : `RESEND_API_KEY` et `TEAM_EMAIL` pour l'e-mail, ou `TEAM_WEBHOOK_URL`. Sans réglage, le message s'écrit dans le journal du serveur.
- **WhatsApp officiel** : `NEXT_PUBLIC_TEAM_WHATSAPP`.

## Ce qui se change dans un seul fichier

- Les prix et les packs : `src/lib/packages.ts`
- Les horaires, la date d'ouverture, les jours fermés : `src/lib/slots.ts`
- Le compte TikTok, la ville du studio : `src/lib/site.ts`
- Le logo : fichiers dans `public/brand/` et `src/assets/` (copies de petite taille, à remplacer par les originaux du compte @OCD)
- Les couleurs : en haut de `src/app/globals.css`

## Emplacements à compléter avec du vrai contenu

- Les avis des vendeurs, sur l'accueil (après les premiers lives).
- L'histoire de Bovann, sur `/histoire` (son texte, ses photos).

## Crédits photos

Photos de Lomé sous licence CC BY-SA 4.0 (Wikimedia Commons). Le crédit affiché sous chaque photo est obligatoire.

- « Création, petit sac en pagne Wax » et « Création, Objets d'art, à Lomé », par Step may
- « Marché de Hédzranawoé à Lomé (Togo) 06 », par Akouete

Les photos ont été recadrées et allégées.

Les polices Anton et Figtree sont sous licence SIL Open Font License.
