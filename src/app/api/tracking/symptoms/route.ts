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
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('user_symptom_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (startDate && endDate) {
      // Date range query
      query = query.gte('entry_date', startDate).lte('entry_date', endDate);
    } else {
      // Single date query
      query = query.eq('entry_date', date);
    }

    const { data: symptoms, error } = await query;

    if (error) {
      console.error('Error fetching symptoms:', error);
      return NextResponse.json({ error: 'Failed to fetch symptoms' }, { status: 500 });
    }

    return NextResponse.json({ symptoms });
  } catch (error) {
    console.error('Error in symptoms GET:', error);
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
    const { symptom_name, value, notes, entry_date } = body;

    // Validate required fields
    if (!symptom_name || !value) {
      return NextResponse.json({ error: 'Symptom name and value are required' }, { status: 400 });
    }

    // Validate value range
    if (value < 1 || value > 10) {
      return NextResponse.json({ error: 'Value must be between 1 and 10' }, { status: 400 });
    }

    const symptomData = {
      user_id: user.id,
      symptom_name,
      value: parseInt(value),
      notes: notes || null,
      entry_date: entry_date || new Date().toISOString().split('T')[0],
    };

    // Use upsert to handle duplicate entries (update if exists, insert if not)
    const { data: symptom, error } = await supabase
      .from('user_symptom_entries')
      .upsert(symptomData, {
        onConflict: 'user_id,symptom_name,entry_date',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving symptom:', error);
      return NextResponse.json({ error: 'Failed to save symptom' }, { status: 500 });
    }

    return NextResponse.json({ symptom, message: 'Symptom logged successfully' });
  } catch (error) {
    console.error('Error in symptoms POST:', error);
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
    const { id, value, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Symptom entry ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (value !== undefined) {
      if (value < 1 || value > 10) {
        return NextResponse.json({ error: 'Value must be between 1 and 10' }, { status: 400 });
      }
      updateData.value = parseInt(value);
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data: symptom, error } = await supabase
      .from('user_symptom_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own entries
      .select()
      .single();

    if (error) {
      console.error('Error updating symptom:', error);
      return NextResponse.json({ error: 'Failed to update symptom' }, { status: 500 });
    }

    return NextResponse.json({ symptom, message: 'Symptom updated successfully' });
  } catch (error) {
    console.error('Error in symptoms PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 