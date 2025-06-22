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
      .from('user_symptom_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ symptoms: data || [] });
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
    const { symptom_name, value, entry_date } = body;

    // Validate value range (1-10)
    if (value < 1 || value > 10) {
      return NextResponse.json({ error: 'Value must be between 1 and 10' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_symptom_entries')
      .upsert({
        user_id: user.id,
        symptom_name,
        value,
        entry_date,
      }, {
        onConflict: 'user_id,symptom_name,entry_date'
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