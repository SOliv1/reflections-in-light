# ReflectionsInLightConstellations Migration

This app has outgrown feature-branch status. The cleanest next step is to treat it as a standalone project in the `Insp-Home-Cinematic` collection.

## Recommended Identity

- Product name: `ReflectionsInLightConstellations`
- GitHub repo name: `reflections-in-light-constellations`
- Deployment target: Railway
- Project shape: one repo, two deployable services

## Recommended Repo Structure

```text
reflections-in-light-constellations/
  apps/
    web/
      package.json
      public/
      src/
    api/
      package.json
      server.js
      db.js
      cloudinary.js
      models/
      routes/
      utils/
  README.md
  .gitignore
```

This keeps the frontend and backend together while letting Railway deploy them as separate services from one GitHub repo.

## What To Move

### Frontend

Move these from the current root into `apps/web/`:

- `package.json`
- `package-lock.json`
- `public/`
- `src/`
- `.gitignore`

Important frontend details already worth preserving:

- `UnifiedDrawer` flow
- Constellations and inter-related logo logic
- Veil and cinematic layering
- Quote panel and weather-linked mood logic
- `fetchFromApi` based API access

### Backend

Move these from `server/` into `apps/api/`:

- `package.json`
- `server.js`
- `db.js`
- `cloudinary.js`
- `models/`
- `routes/`
- `utils/`

The backend already covers the right shape for this new site:

- weather API
- background image selection
- gallery reads/deletes
- day-by-day photo and mood state
- uploads to Cloudinary
- random atmospheric image selection

## Environment Variables

### Web service

Set these on the frontend service in Railway:

- `REACT_APP_API_BASE_URL`

Example:

```text
https://your-api-service.up.railway.app
```

### API service

Set these on the backend service in Railway:

- `PORT`
- `MONGODB_URI`
- `MONGO_DB_NAME`
- `OPENWEATHER_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CORS_ALLOWED_ORIGINS`

Example `CORS_ALLOWED_ORIGINS` value:

```text
https://your-web-service.up.railway.app,https://your-custom-domain.com
```

## Current Codebase Notes

These are the main things to preserve or clean up during migration:

1. The app is already split into React plus Express, so this is a restructuring task more than a rewrite.
2. The carousel randomizer no longer needs a hardcoded localhost URL and now uses the shared API client pathing.
3. Most frontend API calls already flow through `src/api.js` and `src/config.js`, which is a strong base for Railway.
4. The current local git repository should not be trusted as the source of record for branch history.

## Railway Setup

Create one Railway project with two services:

1. `web`
   - Root directory: `apps/web`
   - Start command: Railway can use the React build output or a static deployment flow
2. `api`
   - Root directory: `apps/api`
   - Start command: `npm start`

Recommended backend improvement after migration:

- add a `dev` script with `node --watch server.js` or `nodemon`
- add a lightweight `/health` check as the service health endpoint

## First Migration Pass

Do this in order:

1. Create a fresh folder outside this corrupted repo.
2. Initialize the new repo there.
3. Copy frontend files into `apps/web`.
4. Copy backend files into `apps/api`.
5. Update any moved import paths only if needed.
6. Set Railway service root directories.
7. Add environment variables.
8. Deploy the API first.
9. Point the frontend at the Railway API URL.
10. Deploy the web service.

## Git Commands For The Fresh Repo

Run these in the new clean folder once the files are moved:

```powershell
git init
git add .
git commit -m "Initialize ReflectionsInLightConstellations app"
git branch -M main
git remote add origin https://github.com/<your-user>/reflections-in-light-constellations.git
git push -u origin main
```

## What I Recommend Next

1. Create the new GitHub repo: `reflections-in-light-constellations`
2. Create a fresh local folder for it
3. Transplant the current working frontend and backend into the new structure
4. Connect the new repo to Railway
5. Keep the old `reflections-in-light` repo untouched as archival history

This gives the Constellations app its own clean future without being constrained by the old repo's damaged git state.
