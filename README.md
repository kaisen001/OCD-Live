# OCD Live

Site de réservation de lives commerciaux pour entrepreneurs (présentiel Togo / à distance).

## Démarrer

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Parcours

1. Mode + métier (reco pack)
2. Date + créneau + package
3. Fiche business → code suivi + kit prep + notif admin

## Admin

- URL : [/admin](http://localhost:3000/admin)
- Mot de passe local par défaut : `ocd-admin` (override via `ADMIN_PASSWORD`)
- Les réservations restent `pending` jusqu’à **Approuver** → ensuite visibles sur l’accueil

## Notif admin

Sans config : log console serveur.  
Optionnel : `ADMIN_WEBHOOK_URL` dans `.env.local` (voir `.env.example`).
