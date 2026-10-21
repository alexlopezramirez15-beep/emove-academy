# EMOVE Profe

**Free Erasmus+ training and classroom resources for European teachers, by [eMove Academy](https://www.emoveacademy.com).**

A public website plus an installable web app (PWA). Teachers request access, the super-admin approves each account, and approved teachers can:

- **Academy**: the interactive microcourse *Erasmus+ from scratch* (5 units, 7 activity types: learn, discover, decide, true or false, sort, order, reflect), a final quiz, a printable certificate and an Erasmus+ glossary.
- **Resources**: a library of classroom activities, routines and templates organised by the seven eMove pathways, with filters, favourites and print/PDF.
- **eMove courses**: the Summer 2027 catalogue. Every unit, resource and quiz result recommends the eMove course of its pathway.
- **Profile**: progress, certificates, notes from the reflect activities, personal details and password.

The **super-admin** (Admin tab) approves or rejects requests, resets passwords, deletes accounts, sees each teacher's progress and which eMove courses they opened, and exports the list to CSV.

Everything is in English. All access is free; there are no payments.

## Structure

```
src/
  data-emove.js      eMove pathways, courses, stages, countries
  data-course.js     the microcourse (units and activities), quiz and glossary
  data-resources.js  the resource library
  core.js            helpers, icons, brand mark, state, shell and router
  accounts.js        sign in, request access, sync between devices, super-admin panel
  academy.js         course map, lesson player, activity types, quiz, certificate, glossary
  pages.js           home, resources, eMove courses, profile
  styles.css         visual system (eMove colours, Inter)
web/
  website.py         public website: home, guides, resources preview, privacy
  guides.py          the Erasmus+ guides
  web.css            styles of the public website
netlify/functions/
  api.mjs            accounts API (Netlify Functions + Netlify Blobs)
public/              icons, eMove logo and service worker
tools/               data export for the website and a local dev server
build.py             builds everything into dist/
```

Adding content means editing the `data-*.js` files: a new unit or activity in `COURSES`, a new resource in `RESOURCES`. No other code needs to change.

## Run it locally

```
python3 build.py
ADMIN_EMAILS=you@example.com node tools/dev.mjs     # http://localhost:8888
```

The dev server keeps accounts in `.store/`. Request access with the email in `ADMIN_EMAILS`: that account is approved automatically and sees the Admin tab.

## Publish on Netlify

1. Netlify → Add new site → Import from GitHub → choose this repository. Build settings come from `netlify.toml`.
2. Site settings → Environment variables:
   - `ADMIN_EMAILS`: the super-admin email (several separated by commas).
   - `AUTH_SECRET`: a random text of at least 32 characters.
3. Deploy. The website is at `/`, the platform at `/app/`.

Environment variables only reach the accounts API after a new deploy: after changing them, push a commit or use *Deploys → Trigger deploy*.
