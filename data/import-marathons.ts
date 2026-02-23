import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

// .env.local 파일 로드
config({ path: path.resolve(__dirname, "../.env.local") });

// Supabase 클라이언트 설정 (서비스 역할 키는 NEXT_PUBLIC_ 없이 둔 경우가 많음)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("환경 변수가 설정되지 않았습니다.");
  console.error("필요: NEXT_PUBLIC_SUPABASE_URL (또는 SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY (또는 NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)");
  console.error(".env.local 에 위 변수를 설정한 뒤 다시 실행하세요.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// JSON 파일 로드 (스키마 형식: year, month, country, region, event_start_at, registration_status 등)
const filePath = path.resolve(__dirname, "./data-marathon.json");
const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function importEvents() {
  const items = jsonData.item;

  if (!items || items.length === 0) {
    console.error("데이터가 없습니다.");
    return;
  }

  console.log(`총 ${items.length}개의 마라톤 데이터를 처리합니다...`);

  for (const m of items) {
    const row = {
      year: m.year,
      month: m.month,
      country: m.country ?? "한국",
      region: m.region ?? "기타",
      name: m.name,
      slug: m.slug,
      description: m.description,
      event_start_at: m.event_start_at,
      event_end_at: m.event_end_at ?? null,
      event_scale: m.event_scale ?? null,
      event_type: m.event_type ?? "마라톤",
      event_site: m.event_site ?? null,
      registration_status: m.registration_status ?? "접수대기",
      registration_start_at: m.registration_start_at ?? null,
      registration_end_at: m.registration_end_at ?? null,
      registration_add_start_at: m.registration_add_start_at ?? null,
      registration_add_end_at: m.registration_add_end_at ?? null,
      registration_price: m.registration_price ?? null,
      registration_site: m.registration_site ?? null,
      images: m.images ?? null,
      location: m.location ?? null,
      hosts: m.hosts ?? null,
      sns: m.sns ?? null,
    };

    console.log(`Importing: ${m.name} (${m.slug})`);

    const { error } = await supabase
      .from("marathons")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      console.error(`Error inserting ${m.slug}:`, error.message);
    } else {
      console.log(`Inserted: ${m.slug}`);
    }
  }

  console.log("\n🎉 모든 마라톤 import 완료!");
}

importEvents();
