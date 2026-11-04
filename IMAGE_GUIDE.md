# Taskote Website — Image Management Guide

This guide explains how images are organized across the Taskote public website (`public-site/claude-website/`) and provides exact specifications so you can easily replace any photo with higher-quality assets without editing HTML, CSS, or JavaScript.

---

## 1. How Image Management Works

- **Source Asset Folder**: `public-site/claude-website/assets/img/`
- **Build Output Folder**: `public-site/claude-website/dist/assets/img/`
- **Bilingual Consistency**: Both English (`/`, `/services/...`, `/en/...`) and Malayalam (`/ml/...`) pages share the exact same asset paths (`/assets/img/<filename>`).
- **Zero-Code Replacement**:
  1. Save your new image with the **exact same filename** (e.g., `ac-repair.jpg`).
  2. Overwrite the file inside `public-site/claude-website/assets/img/`.
  3. Run `node build.mjs` (or `npm run build`) inside `public-site/claude-website/`.
  4. The build script automatically copies `assets/` into `dist/assets/`, updating all 48 English and Malayalam pages simultaneously.

---

## 2. Complete Image Inventory & Specifications

The website uses exactly **11 image assets**. Below is the complete catalog:

| # | Filename | Primary Locations | Display Size | Recommended Upload Dimensions | Aspect Ratio | Format & Quality |
|---|---|---|---|---|---|---|
| **1** | `logo.jpg` | Favicon, Header Brand, Footer Brand | 38×38 px (rendered square) | **512×512 px** (min 256×256) | 1:1 (Square) | JPG/PNG, 90%, sRGB |
| **2** | `electrical.jpg` | Electrical Category Hero, Service Card, Homepage Mosaic, Services Directory Hero | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **3** | `cleaning.jpg` | Cleaning Category Hero, Service Card, Homepage Mosaic | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **4** | `appliance-repair.jpg` | Appliance Repair Category Hero, Service Card, Homepage Mosaic, Get Started Visual | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **5** | `ac-repair.jpg` | AC Repair Category Hero, Service Card (Popular & Directory) | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **6** | `plumbing.jpg` | Plumbing Category Hero, Service Card (Popular & Directory) | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **7** | `carpentry.jpg` | Carpentry Category Hero, Service Card (Popular & Directory) | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **8** | `painting.jpg` | Painting Category Hero, Service Card (Popular & Directory) | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **9** | `pest-control.jpg` | Pest Control Category Hero, Service Card, Homepage Quality/Clarity Section | 572×320 px | **1144×640 px** (or 1200×675) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **10** | `professional.jpg` | Homepage Pro Banner, About Portrait, Join Hero, Sign-In Info Visual | 838×470 px | **1676×940 px** (or 1600×900) | 16:9 (~1.78:1) | JPG/WebP, 82-85% |
| **11** | `support-agent.jpg` | Contact Page Support Card | 560×340 px | **1120×680 px** (or 1200×720) | ~1.65:1 (16:10) | JPG/WebP, 82-85% |

---

## 3. Detailed Placement & Visual Guidelines

### 1. `logo.jpg`
- **Where it appears**:
  - Browser tab icon / favicon: `<link rel="icon" href="/assets/img/logo.jpg">`
  - Header brand icon: `<header class="site-header"> .brand img` (38×38 px)
  - Footer brand icon: `<footer class="site-footer"> .brand img` (38×38 px)
- **Visual advice**: Solid violet (`#5E29FF`) background or clean icon on solid background. Must be easily recognizable at small resolutions (16×16, 32×32, 38×38).

### 2–9. Service Photography (`ac-repair.jpg`, `electrical.jpg`, `plumbing.jpg`, `carpentry.jpg`, `appliance-repair.jpg`, `painting.jpg`, `cleaning.jpg`, `pest-control.jpg`)
- **Where they appear**:
  - The dedicated Category Page hero (`/services/<trade>/` and `/ml/services/<trade>/`).
  - The Service Directory card grid (`/services/` and `/ml/services/`).
  - Homepage "Popular services" grid (`ac-repair`, `plumbing`, `carpentry`, `painting`).
  - Homepage Hero Mosaic (`electrical`, `cleaning`, `appliance-repair`).
  - Homepage Clarity section (`pest-control`).
  - Get Started screen visual (`appliance-repair`).
- **Visual advice**:
  - Realistic, professional Kerala context: skilled technicians actively working on real residential or commercial equipment.
  - Good natural lighting, clean composition, uncluttered background.
  - Keep main subject centered or slightly towards the left so key details are not cropped by card borders on mobile devices.
  - Avoid generic Western stock photos or heavy artificial 3D icons.

### 10. `professional.jpg`
- **Where it appears**:
  - Homepage Pro Banner (`.pro-banner-photo`)
  - About Page Portrait (`.about-portrait`)
  - For Professionals Page Hero (`/join/` and `/ml/join/`)
  - Sign-In Public Launch Screen (`/sign-in/` and `/ml/sign-in/`)
- **Visual advice**:
  - Friendly, approachable Indian/Kerala service professional in clean work uniform or appropriate trade attire.
  - Confident, trustworthy expression.
  - Fits wide 16:9 crop at desktop resolutions without cropping the person's face.

### 11. `support-agent.jpg`
- **Where it appears**:
  - Contact Page Hero Card (`/contact/` and `/ml/contact/`, `.support-photo`)
- **Visual advice**:
  - Friendly customer support specialist or help desk representative ready to assist.
  - Bright, welcoming environment.

---

## 4. Best Practices for Compression & Performance

To keep page load speeds instant across 4G mobile connections in Kerala:

1. **Target File Sizes**:
   - `logo.jpg`: < 20 KB
   - Service trade images (572×320 / 1144×640): ~40 KB to 120 KB each
   - Large banner photos (`professional.jpg` at 1676×940): ~80 KB to 180 KB
2. **Color Profile**: Always export in **sRGB**. (Adobe RGB or ProPhoto RGB will look washed out in web browsers).
3. **Format**: Standard baseline or progressive JPEG (`.jpg`).
4. **Tools for Free Compression**:
   - [Squoosh.app](https://squoosh.app/) (Google's web app)
   - [TinyJPG / TinyPNG](https://tinyjpg.com/)
   - Command line: `cwebp` or `imagemin`

---

## 5. Step-by-Step Replacement Checklist

When you have new photos ready:

1. [ ] Resize each image to the recommended dimensions in the table above.
2. [ ] Export as `.jpg` using 80–85% quality in sRGB.
3. [ ] Match the exact filename (e.g. `plumbing.jpg`).
4. [ ] Paste into `public-site/claude-website/assets/img/`.
5. [ ] Open terminal and run:
   ```bash
   cd public-site/claude-website
   npm run build
   ```
6. [ ] Preview locally:
   ```bash
   npm run serve
   ```
7. [ ] Verify that both English (`http://localhost:4173/`) and Malayalam (`http://localhost:4173/ml/`) display the new photo cleanly.

