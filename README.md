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

1. Dès l'accueil, il choisit : en présentiel à Lomé, ou à distance.
2. Il choisit sa date sur le calendrier (tous les jours à partir du 1er décembre 2026), puis son heure.
3. Il choisit son package (6 packages : 1 h 30, 4 h 30, 9 h, vedette, mois).
4. Il présente son business.

L'équipe reçoit aussitôt un message : « Untel fait tel business, a réservé le mardi 1er décembre de 10:00 à 11:30, va venir au studio » ou « sera à distance, depuis le Cameroun ».
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
- **Notification de l'équipe** : `BREVO_API_KEY`, `TEAM_EMAIL` et `BREVO_SENDER_EMAIL` pour l'e-mail (Brevo), ou `TEAM_WEBHOOK_URL`. Sans réglage, le message s'écrit dans le journal du serveur.
- **WhatsApp officiel** : `NEXT_PUBLIC_TEAM_WHATSAPP`.

## Ce qui se change dans un seul fichier

- Les prix et les packages : `src/lib/packages.ts` (seuls 15 000 F et 20 000 F viennent de la vidéo de Bovann ; les autres prix sont des propositions)
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

La police TikTok Sans (TikTok Inc.) est sous licence SIL Open Font License.
La silhouette de l'Afrique vient des données Natural Earth (domaine public).
