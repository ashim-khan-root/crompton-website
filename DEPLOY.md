# Deploying

Production is **`cromtongroup.com`** and **`www.cromtongroup.com`**, served by nginx on a
single AlmaLinux VPS through a Cloudflare Tunnel. There is no other deployment target.

The built site is fully static. `npm run build` produces `dist/`, which is what gets served.

---

## Where it runs

| Piece | Value |
|---|---|
| Document root | `/var/www/cromtongroup.com/html` (owner `nginx:nginx`, SELinux `httpd_sys_content_t`) |
| nginx site file | `/etc/nginx/conf.d/cromtongroup.com.conf` (`server_name cromtongroup.com www.cromtongroup.com`) |
| Edge | Cloudflare, TLS terminates there; nginx listens on `:80` only |
| Tunnel | dashboard-managed `cloudflared`; carries all hostnames on the box |
| Firewall | `firewalld`, SSH only — ports 80/443 stay closed at the origin |

`cromptongroup.com` is a **parked lookalike owned by someone else** and `crompton-intl.com`
was never registered. Neither is a deploy target, ever.

Do not add `listen 443`, Certbot, or `~/.cloudflared/config.yml`. See
`dev-agency/docs/INFRASTRUCTURE.md` for the full contract.

---

## The deploy is a two-machine operation

**1. On the workstation** — edit, build, commit, push:

```bash
npm ci
npm run build
git add -A && git commit -m "<what changed>"
git push
```

**2. On the VPS** — pull and rebuild:

```bash
cd /home/aiworker/Downloads/crompton-website
git pull --ff-only
npm ci            # only when package.json / package-lock.json changed
npm run build
```

**3. The owner runs the deploy** (requires root; agents here have no passwordless sudo):

```bash
cd /home/aiworker/Downloads/dev-agency
sudo ./deploy/scripts/deploy-static-site.sh cromtongroup.com \
     /home/aiworker/Downloads/crompton-website/dist
```

That script provisions SELinux context, **deletes and replaces** the document root, rewrites
the nginx site file from its template, runs `nginx -t`, and reloads nginx. It does not back
up the previous build and does not touch DNS, the tunnel, firewalld or TLS.

Because it rewrites the site file, any nginx directive added by hand in
`/etc/nginx/conf.d/cromtongroup.com.conf` (gzip, cache headers, redirects) is lost on the next
deploy. Add such changes to `dev-agency/deploy/nginx/cromtongroup.com.conf` instead.

Suggested guard before deploying — take a backup first, since the script won't:

```bash
sudo mkdir -p /var/backups/cromtongroup
sudo cp -a /var/www/cromtongroup.com/html \
          /var/backups/cromtongroup/$(date +%Y%m%d-%H%M%S)
```

---

## Verify after deploying

```bash
curl -I -H 'Host: cromtongroup.com' http://localhost        # expect 200
curl -sI https://cromtongroup.com | head -1                 # expect 200 through Cloudflare
```

Then compare the served files against the build. Astro output is **not** byte-reproducible —
hydrated islands carry random `uid="..."` — so normalise those before checksumming:

```bash
find /var/www/cromtongroup.com/html -type f | sort | xargs md5sum | md5sum
```

If a previous fingerprint is recorded in `dev-agency/tasks/CROMPTON-DEPLOY.md`, compare
against it only after stripping `uid="..."` from HTML.

Rollback is re-deploying the previous `dist/` (or restoring the backup above). nginx config
rollback is restoring the previous `.conf` and `systemctl reload nginx`.

---

## Local preview only

```bash
npm run preview            # Astro's preview server
# or, to serve the exact build output:
cd dist && python3 -m http.server 8080
```

Neither is a deploy. Both are for looking at the site on your own machine.

---

## Not yet in place

- **`error_page 404 /404.html;` is missing from the nginx site file**, so the built
  `dist/404.html` is not served yet — unknown paths still return nginx's default page.
  Add it to `dev-agency/deploy/nginx/cromtongroup.com.conf`, not to the live file.
- No gzip and no `Cache-Control` headers from nginx. The self-hosted fonts in
  `public/fonts/` are immutable and should carry a long `max-age`.
- No analytics, no uptime monitoring.
- `www` is not redirected to the apex; both serve the same content.

`robots.txt` and `sitemap-index.xml` are now generated (`public/robots.txt`, `@astrojs/sitemap`).
