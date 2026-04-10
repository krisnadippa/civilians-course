-- ============================================================
-- MIGRATION: Tambah kolom progress kursus pada course_orders
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE course_orders
  ADD COLUMN IF NOT EXISTS progress_status TEXT DEFAULT 'Belum Mulai',
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Update semua row existing agar punya nilai default
UPDATE course_orders
  SET progress_status = 'Belum Mulai'
  WHERE progress_status IS NULL;
