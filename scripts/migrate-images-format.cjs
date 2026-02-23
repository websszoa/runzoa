/**
 * data-marathon.json 의 images 를
 * { cover: [파일명], medal: [], detail: [], souvenir: [] } 형식으로 변환
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/data-marathon.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

function toNewImages(old) {
  const empty = { cover: [], medal: [], detail: [], souvenir: [] };
  if (!old || typeof old !== "object") return empty;
  if (Array.isArray(old.cover)) return { cover: old.cover, medal: old.medal || [], detail: old.detail || [], souvenir: old.souvenir || [] };
  const main = old.main && String(old.main).trim() ? [old.main.trim()] : [];
  const sub = Array.isArray(old.sub) ? old.sub.filter((s) => s != null && String(s).trim()) : [];
  return { cover: main, medal: [], detail: sub, souvenir: [] };
}

data.item = data.item.map((it) => ({
  ...it,
  images: toNewImages(it.images),
}));

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
console.log("Migrated images format for", data.item.length, "items.");
