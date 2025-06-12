'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const fileSchema = z.object({
  report_type: z.enum(['lab_report', 'genetic_report']),
  file: z.instanceof(File),
});

export async function uploadLabReport(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to upload a file.' };
  }

  const validatedFields = fileSchema.safeParse({
    report_type: formData.get('report_type'),
    file: formData.get('file'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid form data.' };
  }

  const { report_type, file } = validatedFields.data;

  // Sanitize filename to prevent path traversal issues
  const fileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}_${fileName}`;
  const filePath = `${user.id}/${uniqueFileName}`;

  const { error: uploadError } = await supabase.storage
    .from('lab_reports')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return { error: 'Failed to upload file to storage.' };
  }

  const { error: dbError } = await supabase
    .from('user_lab_reports')
    .insert({
      user_id: user.id,
      file_name: fileName,
      file_path: filePath,
      report_type: report_type,
      status: 'uploaded',
      mimetype: file.type,
    });

  if (dbError) {
    console.error('Database error:', dbError);
    // Clean up uploaded file if database insert fails
    await supabase.storage.from('lab_reports').remove([filePath]);
    return { error: 'Failed to record file upload in database.' };
  }

  return { success: true };
} 