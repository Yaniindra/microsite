import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, "registrations.db"));

db.exec("PRAGMA journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    interest TEXT DEFAULT 'Informasi umum',
    note TEXT,
    consent INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

db.exec(`
  INSERT OR IGNORE INTO registrations (id, name, email, phone, company, interest, created_at) VALUES
    (1, 'Andi Prasetyo',   'andi.prasetyo@mailcorp.co.id', '0812-3456-7890', 'PT Sumber Makmur',   'Penawaran harga', '2026-07-21 09:00:00'),
    (2, 'Siti Rahmawati',  'siti.rahma@usahamandiri.id',   '0813-2211-0098', 'CV Usaha Mandiri',    'Demo produk',     '2026-07-22 10:30:00'),
    (3, 'Budi Santoso',    'budi.santoso@gmail.com',       '0857-1234-5566', NULL,                 'Informasi umum',  '2026-07-23 08:15:00'),
    (4, 'Dewi Anggraini',  'dewi.a@karyabersama.com',      '0821-9988-7766', 'PT Karya Bersama',   'Demo produk',     '2026-07-23 14:00:00'),
    (5, 'Rendra Wijaya',   'rendra.w@majujaya.co.id',      '0878-4433-2211', 'PT Maju Jaya Abadi', 'Penawaran harga', '2026-07-24 11:45:00'),
    (6, 'Nur Aini',        'nur.aini@outlook.com',         '0895-6677-8899', 'Toko Aini',          'Informasi umum',  '2026-07-25 16:20:00')
`);

export { db };
