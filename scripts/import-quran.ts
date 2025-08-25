/**
 * Import Qur'an word-by-word text (Uthmani), with page mappings (Madani, 15 lines).
 *
 * Expected JSON shape (array of entries):
 * {
 *   surahNumber: number,
 *   ayahNumber: number,
 *   wordIndex: number,
 *   textUthmani: string,
 *   pageNumber: number,
 *   juzNumber?: number
 * }
 *
 * Example data provided in data/quran-words-sample-surah1.json (Al-Fatiha only)
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run(filePath: string) {
  const abs = path.resolve(filePath);
  const raw = fs.readFileSync(abs, "utf8");
  const entries = JSON.parse(raw) as Array<{
    surahNumber: number;
    ayahNumber: number;
    wordIndex: number;
    textUthmani: string;
    pageNumber: number;
    juzNumber?: number;
  }>;

  // build Ayah rows (dedupe by surah+ayah)
  const ayahKey = (e: any) => `${e.surahNumber}:${e.ayahNumber}`;
  const ayahMap = new Map<string, { surahNumber: number; numberInSurah: number; pageNumber: number; juzNumber: number }>();

  for (const e of entries) {
    const key = ayahKey(e);
    const val = ayahMap.get(key);
    if (!val) {
      ayahMap.set(key, {
        surahNumber: e.surahNumber,
        numberInSurah: e.ayahNumber,
        pageNumber: e.pageNumber,
        juzNumber: e.juzNumber ?? 1,
      });
    }
  }

  console.log(`Upserting ${ayahMap.size} ayahs...`);
  for (const a of ayahMap.values()) {
    await prisma.ayah.upsert({
      where: { surahNumber_numberInSurah: { surahNumber: a.surahNumber, numberInSurah: a.numberInSurah } },
      update: { pageNumber: a.pageNumber, juzNumber: a.juzNumber },
      create: { ...a },
    });
  }

  console.log(`Inserting ${entries.length} words...`);
  for (const w of entries) {
    await prisma.word.upsert({
      where: { surahNumber_ayahNumber_wordIndex: { surahNumber: w.surahNumber, ayahNumber: w.ayahNumber, wordIndex: w.wordIndex } },
      update: { textUthmani: w.textUthmani, pageNumber: w.pageNumber },
      create: { ...w },
    });
  }

  console.log("Import complete.");
}

const file = process.argv[2] ?? "data/quran-words-sample-surah1.json";
run(file).finally(() => prisma.$disconnect());
