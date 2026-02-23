/**
 * data-marathon.json 각 항목에 상단 country, region 복원 (location 값 사용)
 */
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../data/data-marathon.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

data.item = data.item.map((it) => ({
  year: it.year,
  month: it.month,
  country: it.location?.country ?? "한국",
  region: it.location?.region ?? "기타",
  ...it,
}));

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
console.log("Restored country & region for", data.item.length, "items.");