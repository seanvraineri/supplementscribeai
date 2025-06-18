"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

interface DataUploadStepProps {
  onNext: () => void;
}

export function DataUploadStep({ onNext }: DataUploadStepProps) {
  const [labFiles, setLabFiles] = useState<FileList | null>(null);
  const [geneticFiles, setGeneticFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'lab' | 'genetic') => {
    if (fileType === 'lab') {
      setLabFiles(e.target.files);
    } else {
      setGeneticFiles(e.target.files);
    }
  };

  const uploadAndContinue = async () => {
    setIsUploading(true);
    
    const labFilesToUpload = labFiles ? Array.from(labFiles) : [];
    const geneticFilesToUpload = geneticFiles ? Array.from(geneticFiles) : [];
    const allFiles = [...labFilesToUpload, ...geneticFilesToUpload];

    if (allFiles.length === 0) {
      // No files - just continue to review
      toast.info('No files uploaded. You can continue with profile-based recommendations.');
      onNext();
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      // Simple file upload to storage (no processing)
      const uploadPromises = allFiles.map(async (file) => {
        const isLabFile = labFilesToUpload.includes(file);
        const reportType = isLabFile ? 'lab_report' : 'genetic_report';
        
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
        const file_path = `${user.id}/${uniqueFileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('lab_reports')
          .upload(file_path, file, { upsert: true });

        if (uploadError) {
          throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
        }

        // Record in database (status: 'uploaded' - not processed yet)
        const { error: dbError } = await supabase.from('user_lab_reports').insert({
          user_id: user.id,
          file_path: file_path,
          file_name: sanitizedFileName,
          report_type: reportType,
          status: 'uploaded', // Will be processed after profile submission
          mimetype: file.type || 'application/octet-stream'
        });

        if (dbError) {
          await supabase.storage.from('lab_reports').remove([file_path]);
          throw new Error(`Database record failed for ${file.name}: ${dbError.message}`);
        }
        
        return file.name;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      toast.success(`📁 Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}`);
      console.log('✅ Files uploaded successfully:', uploadedFiles);
      
      onNext();

    } catch (error: any) {
      console.error("File upload failed:", error);
      toast.error(`Upload failed: ${error.message || 'An unexpected error occurred during file upload.'}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const skipForNow = () => {
    onNext();
  };

  return (
    <div className="space-y-8">
      <Toaster richColors />

      <div>
        <h3 className="text-lg font-medium">Your Health Data</h3>
        <p className="text-sm text-muted-foreground">
          Upload your existing lab and genetic reports. We support all major formats.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <label htmlFor="lab-files" className="block text-sm font-medium text-gray-700">
          Lab Reports
        </label>
        <input
          id="lab-files"
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, 'lab')}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          accept=".pdf,.csv,.txt,.zip"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">Accepts PDF, CSV, TXT, and ZIP files.</p>
      </div>
      
      <div className="space-y-4 rounded-lg border p-4">
        <label htmlFor="genetic-files" className="block text-sm font-medium text-gray-700">
          Genetic Reports
        </label>
        <input
          id="genetic-files"
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, 'genetic')}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          accept=".pdf,.vcf,.zip,.txt,.csv"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">Accepts PDF, VCF, ZIP, TXT, and CSV files.</p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <Button onClick={uploadAndContinue} disabled={isUploading}>
          {isUploading ? 'Uploading Files...' : 'Upload and Continue'}
        </Button>
        <Button onClick={skipForNow} variant="outline" disabled={isUploading}>
          Skip for now
        </Button>
      </div>
    </div>
  );
} 