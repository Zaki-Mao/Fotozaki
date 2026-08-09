# FotoZaki | Visual Archive

> "Through the lens, we capture not just light and shadow, but the silent whispers of the world."

**FotoZaki** is a minimalist photography portfolio website designed to showcase a curated collection of Street, Black & White, Landscape, and Portrait photography. The site emphasizes visual storytelling through a clean, immersive interface and smooth interactions.

👉 **Website** [fotozaki.com](https://fotozaki.com) 
<img width="3810" height="1905" alt="image" src="https://github.com/user-attachments/assets/0639e37d-442a-41b8-b56a-375fa81644b4" />

## ✨ Features

* **Immersive Hero Section:** Cinematic opening with GSAP animations.
* **Masonry Gallery Layout:** "Pinterest-style" waterfall layout that adapts to image aspect ratios.
* **Responsive Design:** Fully optimized for desktop and mobile devices.
* **Bilingual Support:** Seamless switching between English and Chinese.
* **Smooth Animations:** Powered by GSAP and ScrollTrigger for a premium feel.
* **Categorized Archives:** Dedicated sections for Street, B&W, Landscape, and Portrait.

## 🛠️ Tech Stack

* **Core:** HTML5, CSS3, Vanilla JavaScript
* **Animations:** [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform) + ScrollTrigger
* **Fonts:** Inter, Playfair Display (Google Fonts)
* **Icons:** SVG

## 📂 Structure

* `index.html` - Main landing page with featured collections.
* `street.html` - Street photography collection (Shanghai, Tokyo, etc.).
* `bw.html` - Black & White monochrome collection.
* `landscape.html` - Nature and scenery collection.
* `portrait.html` - Portraiture and human stories.
* `about.html` - Photographer profile and contact info.
* `assets/js/photos.js` - Auto-generated photo manifest used by gallery pages.
* `scripts/sync-photos.mjs` - Scans image folders and regenerates the manifest.

## Photo Upload Workflow

The easiest way to add photos is to upload them to the matching `uploads/` folder. The file names can be anything; GitHub Actions will rename and move them into `images/`.

* Street: upload to `uploads/street/`, then photos become `images/street/S66.jpg`, `S67.jpg`, ...
* Black & White: upload to `uploads/bw/`, then photos become `images/BW/B16.jpg`, `B17.jpg`, ...
* Landscape: upload to `uploads/landscape/`, then photos become `images/landscape/L26.jpg`, `L27.jpg`, ...
* Portrait: upload to `uploads/portrait/`, then photos become `images/portrait/P13.jpg`, `P14.jpg`, ...

After upload files are pushed to `main`, GitHub Actions runs `scripts/import-photos.mjs`, moves them into the right `images/` folder with the next number, then runs `scripts/sync-photos.mjs` and commits the updated `assets/js/photos.js`. The category pages read that manifest automatically, so you no longer need to edit `TOTAL_IMAGES` in each HTML file.

For a local update, run:

```bash
node scripts/import-photos.mjs
node scripts/sync-photos.mjs
```

## 📸 Author

**Zaki** Photographer based in Shanghai.  
*Capturing fleeting moments into eternal visual poetry.*

---
© 2025 Visual Archive. All rights reserved.
