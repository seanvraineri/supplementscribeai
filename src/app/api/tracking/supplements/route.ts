import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const { data, error } = await supabase
      .from('user_supplement_adherence')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ supplements: data || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { supplement_name, dosage, taken, entry_date } = body;

    // Upsert the supplement adherence record
    const { data, error } = await supabase
      .from('user_supplement_adherence')
      .upsert({
        user_id: user.id,
        supplement_name,
        dosage,
        taken,
        taken_at: taken ? new Date().toISOString() : null,
        entry_date,
      }, {
        onConflict: 'user_id,supplement_name,entry_date',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, supplement_name, taken, notes, entry_date } = body;

    // Support both ID-based and name+date based updates
    let updateData: any = {};
    
    if (taken !== undefined) {
      updateData.taken = taken;
      updateData.taken_at = taken ? new Date().toISOString() : null;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    let query = supabase
      .from('user_supplement_adherence')
      .update(updateData)
      .eq('user_id', user.id); // Ensure user can only update their own entries

    if (id) {
      // Update by ID
      query = query.eq('id', id);
    } else if (supplement_name && entry_date) {
      // Update by supplement name and date
      query = query.eq('supplement_name', supplement_name).eq('entry_date', entry_date);
    } else {
      return NextResponse.json({ error: 'Either ID or supplement_name+entry_date is required' }, { status: 400 });
    }

    const { data: supplement, error } = await query.select().single();

    if (error) {
      console.error('Error updating supplement adherence:', error);
      return NextResponse.json({ error: 'Failed to update supplement adherence' }, { status: 500 });
    }

    return NextResponse.json({ supplement, message: 'Supplement adherence updated successfully' });
  } catch (error) {
    console.error('Error in supplements PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 