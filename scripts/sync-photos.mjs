import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".jfif"]);

const collections = {
  street: {
    folder: "images/street",
    include: /^S\d+\.(jpe?g|png|webp|avif|jfif)$/i,
    overlayLabel: "STREET",
    titlePrefix: "Scene",
    meta: "FOTOZAKI",
    altPrefix: "Street Photography"
  },
  bw: {
    folder: "images/BW",
    include: /^B\d+\.(jpe?g|png|webp|avif|jfif)$/i,
    overlayLabel: "MONO",
    titlePrefix: "Frame",
    meta: "MONOCHROME",
    altPrefix: "B&W Photography"
  },
  landscape: {
    folder: "images/landscape",
    include: /^L\d+\.(jpe?g|png|webp|avif|jfif)$/i,
    overlayLabel: "LANDSCAPE",
    titlePrefix: "View",
    meta: "NATURE",
    altPrefix: "Landscape Photography"
  },
  portrait: {
    folder: "images/portrait",
    include: /^P\d+\.(jpe?g|png|webp|avif|jfif)$/i,
    overlayLabel: "PORTRAIT",
    titlePrefix: "Face",
    meta: "HUMANITY",
    altPrefix: "Portrait Photography"
  }
};

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function walkImages(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkImages(entryPath));
      continue;
    }

    if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(toPosix(entryPath));
    }
  }

  return files;
}

function listImagePaths() {
  if (existsSync("images")) {
    return walkImages("images");
  }

  try {
    return execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "images"], {
      encoding: "utf8"
    })
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((filePath) => imageExtensions.has(path.extname(filePath).toLowerCase()));
  } catch (error) {
    console.error("Unable to find images/ locally or through git ls-tree.");
    process.exitCode = 1;
    return [];
  }
}

function numberFromPath(filePath) {
  const match = path.basename(filePath).match(/(\d+)(?=\.[^.]+$)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function paddedNumber(filePath, index) {
  const match = path.basename(filePath).match(/(\d+)(?=\.[^.]+$)/);
  return match ? match[1].padStart(2, "0") : String(index + 1).padStart(2, "0");
}

function buildManifest(imagePaths) {
  const manifest = {};

  for (const [key, config] of Object.entries(collections)) {
    manifest[key] = imagePaths
      .filter((filePath) => {
        const normalizedPath = filePath.replace(/\\/g, "/");
        return normalizedPath.startsWith(`${config.folder}/`) && config.include.test(path.basename(normalizedPath));
      })
      .sort((a, b) => numberFromPath(a) - numberFromPath(b) || a.localeCompare(b))
      .map((src, index) => {
        const no = paddedNumber(src, index);

        return {
          src,
          no,
          alt: `${config.altPrefix} ${no}`,
          overlay: `${config.overlayLabel} / NO.${no}`,
          title: `${config.titlePrefix} ${no}`,
          meta: config.meta
        };
      });
  }

  return manifest;
}

const manifest = {
  collections: buildManifest(listImagePaths())
};

mkdirSync("assets/js", { recursive: true });
writeFileSync(
  "assets/js/photos.js",
  `window.FOTOZAKI_PHOTOS = ${JSON.stringify(manifest, null, 2)};\n`,
  "utf8"
);

console.log(
  Object.entries(manifest.collections)
    .map(([key, photos]) => `${key}: ${photos.length}`)
    .join("\n")
);
