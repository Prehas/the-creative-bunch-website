# The Creative Bunch Content API

Separate Vercel deployment that acts as the site content database.

## Required Vercel environment variables

```txt
BLOB_READ_WRITE_TOKEN=...
CONTENT_API_SECRET=generate-a-long-random-secret
CONTENT_ADMIN_EMAIL=raduniculescu22@gmail.com
CONTENT_ADMIN_PASSWORD=Greenice1!
CONTENT_ALLOWED_ORIGINS=https://the-creative-bunch-website.vercel.app,http://localhost:3000
```

## Routes

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/bootstrap?stage=published`
- `GET /api/bootstrap?stage=draft`
- `POST /api/bootstrap` with `{ stage, projects, caseStudies, pricing }`
- `POST /api/publish` with `{ projects, caseStudies, pricing }`
- `POST /api/upload` with `{ fileName, dataUrl }`

Writes require the secure auth cookie set by `/api/auth/login`.

## Deployment flow

1. Create a new Vercel project from this `vercel-content-api` folder.
2. Enable Vercel Blob for that project.
3. Add the environment variables above in Vercel.
4. Deploy.
5. Open:

```txt
https://your-content-api.vercel.app/api/health
```

6. Copy the deployment URL into the main site file:

```js
window.TCB_CONTENT_API_CONFIG = {
    baseUrl: 'https://your-content-api.vercel.app'
};
```

7. Push the main site after the Content API is tested.

## Safe fallback

If `baseUrl` is empty or the Content API is down, the public site keeps using the current static/local fallback content.
