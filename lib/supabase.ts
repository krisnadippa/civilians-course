import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials are missing! "Failed to fetch" often occurs when the dev server needs to be restarted after adding .env.local.\n' +
    'Please RESTART your terminal (Ctrl+C and npm run dev) to load the new credentials.'
  );
} else if (!supabaseUrl.startsWith('http')) {
  console.error('Invalid Supabase URL format! Current value:', supabaseUrl);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Uploads a file to Supabase Storage 'images' bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file: File, folder: string = "general") {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  // Clean folder name to use as bucket name (allow underscores)
  const bucketName = folder.toLowerCase().replace(/[^a-z0-9_]/g, '');

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);

  if (uploadError) {
    if (uploadError.message.includes('Bucket not found')) {
      throw new Error(
        `Bucket '${bucketName}' tidak ditemukan. \n\n` +
        `SOLUSI: \n` +
        `1. Buka Supabase Dashboard > Storage.\n` +
        `2. Buat bucket baru bernama '${bucketName}'.\n` +
        `3. Centang opsi 'Public bucket'.\n` +
        `4. Coba unggah kembali.`
      );
    }
    throw new Error("Gagal mengunggah gambar: " + uploadError.message);
  }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return data.publicUrl;
}
