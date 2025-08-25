# Qur'an Homework Tracker — Stage 1

## Quick start
1. Copy .env.example → .env and set DATABASE_URL / NEXTAUTH_SECRET.
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npx prisma db seed`
5. `npm run dev` and open http://localhost:3000

**Seeded admin login**
- Email: `admin@example.com`
- Password: `admin123`

## Import Qur'an word data
- Prepare JSON like `data/quran-words-sample-surah1.json`.
- Run: `npm run import:quran -- data/quran-words-sample-surah1.json`

## Notes
- This repository seeds Surah metadata for 1–3 to keep the demo tiny.
- For production, import all 114 surahs and complete word-level data.
