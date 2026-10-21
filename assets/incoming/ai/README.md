# Drop AI images here

Files placed here are **not** published. They are staging only, outside `public/`.

Name them exactly as listed in `../../AI-IMAGE-BRIEF.md`:

```
accommodation-01.jpg
training-01.jpg
hse-briefing-01.jpg
office-team-01.jpg
white-collar-01.jpg
recruitment-01.jpg
payroll-01.jpg
```

JPEG or PNG, 2048 × 1536 minimum, landscape. No text, no logos, no identifiable
faces. Once they are here, run:

```bash
python3 scripts/import-ai-assets.py
```

which crops each to its slot ratio, converts to WebP, and marks the provenance as
`ai-generated` in `public/images/manifest.json`. Then check the result on the site
before it is committed.
