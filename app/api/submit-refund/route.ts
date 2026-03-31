import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Parse fields
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const bookingRef = formData.get('bookingRef') as string;
    const bookingDate = formData.get('bookingDate') as string;
    const refundReason = formData.get('refundReason') as string;
    const additionalDetails = (formData.get('additionalDetails') as string) || '';

    // Error handling for missing required fields
    if (!fullName || !email || !bookingRef || !bookingDate || !refundReason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate reference ID and Submission ID
    const submissionId = crypto.randomUUID();
    const refId = 'REF-' + submissionId.split('-')[0].toUpperCase();

    // 1. Insert into Supabase 'refund_requests' table
    const { error: dbError } = await supabaseAdmin
      .from('refund_requests')
      .insert({
        id: submissionId,
        ref_id: refId,
        full_name: fullName,
        email,
        booking_ref: bookingRef,
        booking_date: bookingDate,
        refund_reason: refundReason,
        additional_details: additionalDetails,
        status: 'pending'
      });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database error while saving request' },
        { status: 500 }
      );
    }

    // 2. Upload Files to Storage
    const files = formData.getAll('files') as File[];
    const fileUrls: { name: string; url: string }[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const fileExt = file.name.split('.').pop() || '';
      const timestamp = Date.now();
      const storagePath = `${submissionId}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const fileBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from('refund-evidence')
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('File upload error:', uploadError, file.name);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('refund-evidence')
        .getPublicUrl(storagePath);
        
      fileUrls.push({ name: file.name, url: publicUrl });

      // Insert file record into refund_request_files table
      const { error: fileDbError } = await supabaseAdmin
        .from('refund_request_files')
        .insert({
          request_id: submissionId,
          filename: file.name,
          storage_path: storagePath,
          url: publicUrl
        });
        
      if (fileDbError) {
        console.error('Failed to link file to request in database', fileDbError);
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      refId,
      fileUrls
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
