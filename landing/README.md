# Landing page — « Réservez un appel gratuit »

Page d'arrivée de la publicité YouTube. Site statique (HTML, CSS, JS), aucune étape de compilation.

```
landing/
  index.html            # la page
  confidentialite.html  # confidentialité et cookies (à compléter)
  config.js             # ← vos réglages : Google Analytics, Pixel Meta, Calendly, WhatsApp
  styles.css
  main.js               # consentement, mesure, agenda, animation
  assets/               # logo, polices, vidéo de la pub
```

## Avant la mise en ligne

1. **`config.js`** : déjà rempli (Google Analytics `G-N8JDCPL434`, Pixel Meta, Calendly, WhatsApp). `gtmId` reste vide tant que vous n'utilisez pas Google Tag Manager.
2. **`confidentialite.html`** : compléter les passages entre crochets (raison sociale, adresse, e-mail, durée de conservation).
3. Vérifier le lien des mentions légales (`legalUrl` dans `config.js`).

## Mettre en ligne sur un sous-domaine

Envoyer tout le dossier `landing/` à la racine du sous-domaine (par exemple `appel.taochyagency.com`) :

- **Chez votre hébergeur actuel** : créer le sous-domaine dans le panneau d'administration, puis déposer les fichiers par FTP dans son dossier.
- **Ou gratuitement sur Netlify / Cloudflare Pages** : glisser-déposer le dossier, puis ajouter chez votre registraire un enregistrement DNS `CNAME appel → <adresse fournie>`.

Tester en local : `cd landing && python3 -m http.server` puis ouvrir http://localhost:8000.

## Mesure (Google Analytics 4 + Pixel Meta)

- Rien n'est chargé tant que le visiteur n'a pas cliqué sur « Accepter » dans le bandeau cookies : ni Google Analytics, ni le Pixel Meta (aucune requête vers Google ou Meta avant l'accord).
- Chaque événement ci-dessous est envoyé à Google Analytics 4 (et au `dataLayer`, si GTM est un jour ajouté).
- **Dans GA4** : Administration → Événements → marquer `booking_confirmed` (et `whatsapp_click`) comme **événements clés**. Ensuite, dans Google Ads, importer ces événements clés comme conversions.
- **Dans Meta** : la réservation confirmée envoie `Schedule`, le clic WhatsApp envoie `Contact`. Les utiliser comme événements de conversion dans le Gestionnaire de publicités.

| Événement | Quand |
|---|---|
| `booking_confirmed` | Rendez-vous confirmé dans Calendly — **la conversion à suivre** |
| `booking_slot_selected` | Créneau choisi dans Calendly (avant confirmation) |
| `whatsapp_click` | Clic sur le bouton WhatsApp |
| `cta_click` (+ `cta_location`) | Clic sur un bouton « Réserver » (`header`, `hero`, `about`, `mobile-bar`…) |
| `proof_view` / `service_tab` | Navigation dans le carrousel des résultats / les onglets des services |
| `video_play` / `video_complete` | Lecture de la vidéo |
| `consent_choice` | Choix dans le bandeau cookies |
