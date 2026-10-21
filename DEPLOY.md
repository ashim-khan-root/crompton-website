# Crompton International Website — Demo Deployment

Built with Astro 5 (static output). No build step needed on the server — `dist/` is the complete, ready-to-serve static site.

## What's inside

- `dist/` — the fully built website (servable as-is)
  - `/en/` — English site (12 pages)
  - `/ar/` — Arabic (homepage; EN default for other pages)
  - `/` — auto-redirects to `/en/`
- `README-deploy.txt` — these instructions

## Deploy (pick one)

### Option A — Any static file server (nginx / Caddy / Apache / Node)
Point your web server's document root at the extracted `dist/` folder. Nothing else needed — every page is a real `index.html`, so folder-based routing (`/en/about` → `/en/about/index.html`) works out of the box.

### Option B — nginx quick config
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/crompton/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css text/javascript application/javascript application/json image/svg+xml;
}
```

### Option C — Python one-liner (quickest for a demo)
```bash
cd dist
python3 -m http.server 8080
# Open http://SERVER_IP:8080
```

## Verify before showing the company
- Visit `/` → should redirect to `/en/`
- Check all 12 English pages: `/en/about` `/en/services` `/en/industries` `/en/workforce` `/en/clients` `/en/careers` `/en/contact` `/en/hse` `/en/gallery` `/en/certificates` `/en/news`
- Language switch in the top navbar (`عربي`) — note: only the **homepage** is in Arabic; other pages still show English (known limitation for this demo round)
- Phone/WhatsApp numbers and forms use placeholder hooks — company feedback will refine them

## If you want to modify pages before showing
The project source lives in `/home/aiworker/Downloads/crompton-website/`.
```bash
cd crompton-website
npm install
npm run build    # regenerates dist/
```
Then re-zip `dist/`.

## Contact details currently hardcoded
- Phone: +974 4468 1414
- WhatsApp: +974 5501 9646
- Address: NBK-Msheireb Buildings, 4th Floor, Office #405 & 406, Doha, Qatar