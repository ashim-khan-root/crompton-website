# AI image brief — the seven slots still empty

**Client decision (2026-10-21):** AI-generated imagery is approved for staff-free
operational and atmosphere shots. It is **not** approved for anything that makes a
factual claim, and it does not replace the shoot for real people or real sites.

## Where the files go

Drop finished images in **`assets/incoming/ai/`** (outside `public/`, so nothing is
published by accident), named exactly:

```
accommodation-01.jpg
training-01.jpg
hse-briefing-01.jpg
office-team-01.jpg
white-collar-01.jpg
recruitment-01.jpg
payroll-01.jpg
```

| Requirement | Value |
|---|---|
| Format | JPEG, quality 90+ (PNG also fine) |
| Size | **2048 × 1536 minimum**, landscape 4:3 |
| Colour | sRGB |
| Text | none — no lettering, signage, watermarks, UI, logos |
| Faces | not identifiable; turned away, cropped, or out of focus |

I crop each one to the exact ratio its slot uses, convert to WebP, and record
`provenance: ai-generated` in `public/images/manifest.json`. Nothing gets used
until you have looked at the cropped result.

## Rules that must survive generation

1. **PPE is correct.** Hard hat, hi-vis, safety glasses, gloves, boots. No one
   under a suspended load, no unguarded machinery, no smoking.
2. **No third-party marks.** No company logos on vests, vehicles or equipment.
   Generators love inventing them.
3. **No readable text.** Signage, documents, screens and charts must be blank or
   blurred; generated lettering is gibberish and immediately reads as fake.
4. **No named people, no named projects.** These illustrate a category of work.
   They must never be captioned as a specific client, site or employee.
5. **Not for certificates, team pages, or client logos.** Those are documents,
   identities and third-party marks — a generated one is a misrepresentation.

---

## 1. `accommodation-01.jpg`

> Photorealistic documentary photograph of a modern labour accommodation camp in
> Qatar at golden hour. Two-storey cream modular housing blocks with external
> walkways and steel staircases, a covered shaded seating area, trimmed palms, a
> row of parked bicycles, an outdoor water cooler. No people. Wide establishing
> shot from slightly above eye level, 35 mm lens, warm late-afternoon light, light
> dust haze in the distance, realistic weathered materials, restrained colour.
> Editorial photography for a manpower company website.

**Negative:** text, lettering, signage, logos, watermark, people, luxury hotel,
swimming pool, marble lobby, CGI render look, oversaturation, fisheye.

## 2. `training-01.jpg`

> Photorealistic documentary photograph inside a bright training room in Doha.
> Eight workers in navy uniforms and yellow hi-vis vests sit at plain tables facing
> an instructor who gestures at a blank wall-mounted display; hard hats rest on the
> tables. Shot from the back of the room, backs and three-quarter views only, faces
> not identifiable. Mixed window and ceiling light, 35 mm lens, shallow depth of
> field, natural skin tones, slight grain.

**Negative:** readable text, charts with lettering, logos, watermark, posed smiling
models, stock-photo lighting, empty room, laptops with visible screens.

## 3. `hse-briefing-01.jpg`

> Photorealistic documentary photograph of a morning toolbox talk on a construction
> site in Doha. A supervisor in a white hard hat and hi-vis vest speaks to a
> semicircle of six workers in blue uniforms and hard hats, one holding a plain
> clipboard. Scaffolding and a tower crane defocused in the background. Low warm
> sun, long shadows, candid moment, 35 mm lens, eye level, no one under a load.

**Negative:** text, lettering, logos, watermark, unsafe practice, missing PPE,
readable clipboard, staged handshake, HDR, oversharpened.

## 4. `office-team-01.jpg`

> Photorealistic documentary photograph of a modest corporate office reception in
> Doha. A receptionist in a navy blazer stands behind a light stone counter; a
> visitor in a shirt waits with a plain folder. Warm wood panelling, glass
> partition, potted plant, soft daylight from the left. Faces turned away or softly
> out of focus. 35 mm lens, natural colour, uncluttered.

**Negative:** text, wall lettering, logos, watermark, luxury hotel lobby, marble,
stock-photo smiles, visible screens, brand marks.

## 5. `white-collar-01.jpg`

> Photorealistic documentary photograph of a small meeting in a Doha engineering
> office. Three professionals in business attire around a table with rolled
> drawings, a plain notebook and a laptop showing a blank screen; one points at a
> drawing. Floor-to-ceiling window with the Doha skyline softly out of focus. Faces
> not clearly visible. Natural window light, 35 mm lens, calm palette.

**Negative:** readable plans, drawings with lettering, logos, watermark, boardroom
cliché, whiteboard text, handshake, oversaturated blue.

## 6. `recruitment-01.jpg`

> Photorealistic documentary photograph of a recruitment interview in a plain
> office in Doha. A recruiter in a shirt sits at a desk with a folder and a stamp;
> an applicant in a simple shirt sits opposite. Documents are angled away with no
> legible text. Faces out of frame or turned to the side. Soft daylight, 50 mm lens,
> shallow depth of field, honest and unglamorous.

**Negative:** readable documents, passport text, logos, watermark, corporate stock
smiles, glass skyscraper office, visible screens.

## 7. `payroll-01.jpg`

> Photorealistic documentary photograph of a payroll clerk's desk, three-quarter
> overhead view. Hands on a keyboard, a calculator, a printed payslip face-down, a
> mug, a notebook; a monitor showing a blurred unreadable spreadsheet. Warm desk
> lamp plus daylight, 50 mm lens, shallow depth of field, tidy but used.

**Negative:** readable numbers, spreadsheet text, logos, watermark, hands with
wrong finger counts, floating objects, neon lighting.
