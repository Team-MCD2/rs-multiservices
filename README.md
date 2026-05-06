# RS Multi-Services — Site vitrine (HTML / CSS / JS)

Site vitrine pour **RS Multi-Services** (Raymond Spire) — bricolage, entretien d'espaces verts, nettoyage et enlèvement d'encombrants à Toulouse et 50 km autour.

> Version **HTML/CSS/JS pure** (étape 1). Une conversion **Astro + Tailwind** est prévue après validation.

---

## Stack

- **HTML5** sémantique (5 pages : Accueil, À propos, Services, Réalisations, Contact)
- **CSS3** vanilla — variables CSS, mobile-first, grid + flex
- **JavaScript** vanilla ES6 — menu mobile, observer reveal, lightbox, carrousel témoignages, formulaire mailto
- **Google Fonts** : Bricolage Grotesque + Karla
- **Font Awesome 6** (CDN)
- **Aucune dépendance NPM** — site 100% statique

---

## Structure

```
rs-multiservice/
├── index.html          # Accueil
├── about.html          # À propos
├── services.html       # Détail des 4 pôles de services
├── projects.html       # Galerie réalisations (lightbox)
├── contact.html        # Formulaire + carte
├── robots.txt
├── sitemap.xml
├── css/
│   ├── style.css       # variables, base, utilitaires
│   ├── components.css  # header, footer, cards, form…
│   └── pages.css       # hero, page-header, sections…
├── js/
│   └── main.js         # menu, scroll, lightbox, carrousel, form
└── WhatsApp Image 2026-05-06 at 11.13.23.jpeg  # logo (carte de visite)
```

---

## Lancer en local

Comme c'est du HTML statique, un simple double-clic sur `index.html` fonctionne. Pour un rendu correct (CDN, fonts, formulaire mailto), préférez un serveur local :

```powershell
# Avec Python 3
python -m http.server 8080

# Avec Node (npx)
npx serve .
```

Puis ouvrir <http://localhost:8080>.

---

## SEO & GEO local

Chaque page intègre :

- **Meta** : `title`, `description`, `keywords`, `author`, `robots`, `canonical`, `theme-color`
- **Open Graph** + **Twitter Card**
- **GEO** : `geo.region` (FR-31), `geo.placename`, `geo.position`, `ICBM`
- **JSON-LD** `LocalBusiness` (HomeAndConstructionBusiness) sur la home avec :
  - Adresse Pechbonnieu 31140
  - Coordonnées 43.7077 / 1.4628
  - 13 villes desservies (`areaServed`)
  - Horaires 7j/7 8h-19h
  - `aggregateRating` 4,1/5 sur 11 avis
  - Catalogue des 4 services principaux
  - SIRET, email, téléphone, `sameAs` Allovoisins
- `robots.txt` + `sitemap.xml`

---

## Données sources

- **Carte de visite** RS Multi-Services (logo, slogan, services, contact, zone)
- **Profil Allovoisins** : <https://www.allovoisins.com/p/rsmultiservices-12>
  - Note 4,1/5 — 11 avis
  - 329 mises en relation, délai de réponse 7 min
  - Identité, téléphone et entreprise vérifiés
- **Inspiration design** : <https://gpjardin.vercel.app/> (structure adaptée, palette personnalisée RS)

### Coordonnées intégrées

| | |
| --- | --- |
| **Marque** | RS Multi-Services (R&S Multi-Services) |
| **Gérant** | Raymond Spire |
| **Téléphone** | 06 19 69 68 12 |
| **Email** | raymond.spire31@gmail.com |
| **SIRET** | 911 195 402 00019 |
| **Zone** | Toulouse + 50 km |
| **Horaires** | 7j/7 · 8h00 - 19h00 |
| **Inscription** | 09 novembre 2023 |

---

## Configuration EmailJS (formulaire de contact)

Le formulaire `@/contact.html` envoie les demandes par **EmailJS** (sans backend). Tant que la configuration n'est pas remplie, il bascule automatiquement sur un envoi `mailto:` (ouverture du client mail).

### Mise en place (5 minutes)

1. Créez un compte gratuit sur [EmailJS](https://www.emailjs.com/) (200 emails/mois offerts).
2. **Email Service** : ajoutez un service (Gmail, Outlook, SMTP custom…) et notez le `SERVICE_ID`.
3. **Email Template** : créez un nouveau template avec les variables suivantes (copier-coller dans le corps du template) :

   ```
   Nouveau devis depuis rsmultiservices.fr

   Nom :       {{from_name}}
   Email :     {{from_email}}
   Téléphone : {{phone}}
   Ville :     {{city}}
   Service :   {{service}}

   Message :
   {{message}}
   ```

   Dans **To Email** mettez `raymond.spire31@gmail.com` et dans **Reply-To** `{{reply_to}}`. Notez le `TEMPLATE_ID`.

4. **Account → General → API Keys** : copiez la `PUBLIC KEY`.

5. Ouvrez `@/contact.html`, repérez le bloc `window.EMAILJS_CONFIG` près du bas du fichier, et remplacez les trois valeurs `VOTRE_...` :

   ```js
   window.EMAILJS_CONFIG = {
     publicKey:  'xxxxxxxxxxxxxxx',
     serviceId:  'service_xxxxxxx',
     templateId: 'template_xxxxxxx'
   };
   ```

6. C'est terminé. Le formulaire envoie désormais directement à votre boîte mail, sans serveur.

> Astuce : pour tester sans publier, ouvrez la console du navigateur sur la page contact, soumettez le formulaire — un message de succès doit s'afficher et l'email doit arriver dans la boîte de réception associée au service EmailJS.

---

## Étape suivante : conversion Astro + Tailwind

Après validation visuelle de cette version, le site sera porté sur **Astro 4** + **Tailwind CSS** :

- `BaseLayout.astro` mutualisant les meta SEO et le JSON-LD
- Composants : `Header`, `Footer`, `Hero`, `ServiceCard`, `ProjectGallery`, `TestimonialCarousel`, `ContactForm`
- Données paramétrables dans `src/data/*.json`
- `@astrojs/sitemap` pour la génération automatique
- Build statique optimisé (Lighthouse 95+)

---

## Crédits images

Photos d'illustration libres de droits — [Unsplash](https://unsplash.com/) (à remplacer par les vraies réalisations RS Multi-Services lorsque disponibles).

---

© 2026 RS Multi-Services — Tous droits réservés.
