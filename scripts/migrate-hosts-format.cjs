/**
 * data-marathon.json 의 hosts 를
 * { email, phone, manage, sponsor, souvenir, organizer } 형식으로 변환
 */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/data-marathon.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

function toStr(v) {
  if (v == null) return "";
  if (Array.isArray(v)) return v.filter((x) => x != null && String(x).trim()).join(", ");
  return String(v).trim();
}

function toNewHosts(old) {
  if (!old || typeof old !== "object") {
    return { email: "", phone: "", manage: "", sponsor: "", souvenir: "", organizer: "" };
  }
  return {
    email: toStr(old.email),
    phone: toStr(old.tel),
    manage: toStr(old.operator),
    sponsor: toStr(old.organizer),
    souvenir: toStr(old.souvenir),
    organizer: toStr(old.sponsor),
  };
}

data.item = data.item.map((it) => ({
  ...it,
  hosts: toNewHosts(it.hosts),
}));

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
console.log("Migrated hosts format for", data.item.length, "items.");
