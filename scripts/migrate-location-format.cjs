/**
 * data-marathon.json 의 location 을
 * { country, region, place, lat, lng } 형식으로 변환 (상단에 country, region 포함)
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/data-marathon.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

function toNewLocation(item) {
  const loc = item.location;
  const country = item.country ?? "한국";
  const region = item.region ?? "";
  if (!loc || typeof loc !== "object") {
    return { country, region, place: "", lat: null, lng: null };
  }
  return {
    country,
    region,
    place: loc.place ?? loc.text ?? "",
    lat: loc.latitude ?? loc.lat ?? null,
    lng: loc.longitude ?? loc.lng ?? null,
  };
}

data.item = data.item.map((it) => ({
  ...it,
  location: toNewLocation(it),
}));

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
console.log("Migrated location format for", data.item.length, "items.");
