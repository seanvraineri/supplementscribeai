import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { withRetryRecovery } from '@/lib/error-recovery';

// Type definitions for API requests
interface SupplementPostBody {
  supplement_name: string;
  dosage?: string;
  taken: boolean;
  entry_date: string;
}

interface SupplementPutBody {
  id?: string;
  supplement_name?: string;
  taken?: boolean;
  notes?: string;
  entry_date?: string;
}

interface SupplementRecord {
  id: string;
  user_id: string;
  supplement_name: string;
  dosage?: string;
  taken: boolean;
  taken_at?: string;
  entry_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    // Use safe retry for database queries
    const queryResult = await withRetryRecovery(
      async () => {
        const result = await supabase
          .from('user_supplement_adherence')
          .select('*')
          .eq('user_id', user.id)
          .eq('entry_date', date)
          .order('created_at', { ascending: false });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        return result.data;
      },
      {
        context: 'supplement data fetch',
        maxRetries: 2
      }
    );

    if (!queryResult.success) {
      console.error('Failed to fetch supplements:', queryResult.message);
      return NextResponse.json({ error: 'Failed to fetch supplement data' }, { status: 500 });
    }

    return NextResponse.json({ supplements: queryResult.data || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SupplementPostBody = await request.json();
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

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SupplementPutBody = await request.json();
    const { id, supplement_name, taken, notes, entry_date } = body;

    // ✅ Keep any here for flexible update data - database fields can vary
    const updateData: Record<string, any> = {};
    
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