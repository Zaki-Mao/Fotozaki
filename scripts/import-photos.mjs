import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync } from "node:fs";
import path from "node:path";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".jfif"]);

const collections = {
  street: {
    uploadFolder: "uploads/street",
    targetFolder: "images/street",
    prefix: "S"
  },
  bw: {
    uploadFolder: "uploads/bw",
    targetFolder: "images/BW",
    prefix: "B"
  },
  landscape: {
    uploadFolder: "uploads/landscape",
    targetFolder: "images/landscape",
    prefix: "L"
  },
  portrait: {
    uploadFolder: "uploads/portrait",
    targetFolder: "images/portrait",
    prefix: "P"
  }
};

function listCommittedImages(targetFolder) {
  try {
    return execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", targetFolder], {
      encoding: "utf8"
    })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function listLocalImages(targetFolder) {
  if (!existsSync(targetFolder)) return [];

  return readdirSync(targetFolder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(targetFolder, entry.name).replace(/\\/g, "/"));
}

function imageNumber(filePath, prefix) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = path.basename(filePath).match(new RegExp(`^${escapedPrefix}(\\d+)`, "i"));
  return match ? Number(match[1]) : 0;
}

function nextNumber(targetFolder, prefix) {
  const files = [...listCommittedImages(targetFolder), ...listLocalImages(targetFolder)];
  return Math.max(0, ...files.map((filePath) => imageNumber(filePath, prefix))) + 1;
}

function uploadFiles(uploadFolder) {
  if (!existsSync(uploadFolder)) return [];

  return readdirSync(uploadFolder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => entry.name !== ".gitkeep")
    .filter((entry) => imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(uploadFolder, entry.name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

let imported = 0;

for (const [key, config] of Object.entries(collections)) {
  const files = uploadFiles(config.uploadFolder);
  let number = nextNumber(config.targetFolder, config.prefix);

  if (!files.length) {
    continue;
  }

  mkdirSync(config.targetFolder, { recursive: true });

  for (const filePath of files) {
    const targetName = `${config.prefix}${String(number).padStart(2, "0")}${path.extname(filePath).toLowerCase()}`;
    const targetPath = path.join(config.targetFolder, targetName);

    renameSync(filePath, targetPath);
    console.log(`${key}: ${path.basename(filePath)} -> ${targetPath.replace(/\\/g, "/")}`);

    number += 1;
    imported += 1;
  }
}

if (!imported) {
  console.log("No new upload files found.");
}
