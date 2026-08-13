-- Migration: Cria bucket de Storage para comprovações de lição (prints enviados
-- pelo usuário em tarefas práticas)
-- Date: 2026-08-13
-- Author: PromptLab
-- Description: O upload de comprovação (Lesson.tsx, handleFile) hoje persiste
-- só em localStorage como data URL — some ao trocar de dispositivo/navegador
-- e não é auditável pelo servidor. Este bucket permite persistir o arquivo de
-- verdade, mantendo localStorage como cache local/fallback offline-first.

-- ───────────────────────────────────────────────────────────────────────────────
-- 1. Create private bucket
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('lesson-proofs', 'lesson-proofs', false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────────────
-- 2. Policies — each user can only read/write objects under their own
--    `${auth.uid()}/...` path prefix, mirroring the pattern used for every
--    other user-owned table in this project (auth.uid() = owner).
-- ───────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can upload own lesson proofs" ON storage.objects;
CREATE POLICY "Users can upload own lesson proofs" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'lesson-proofs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update own lesson proofs" ON storage.objects;
CREATE POLICY "Users can update own lesson proofs" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'lesson-proofs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can read own lesson proofs" ON storage.objects;
CREATE POLICY "Users can read own lesson proofs" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'lesson-proofs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own lesson proofs" ON storage.objects;
CREATE POLICY "Users can delete own lesson proofs" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'lesson-proofs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
