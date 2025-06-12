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
    const days = parseInt(searchParams.get('days') || '7');

    // Calculate date range
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get today's adherence
    const { data: todayAdherence, error: todayError } = await supabase
      .rpc('calculate_adherence_percentage', {
        p_user_id: user.id,
        p_start_date: endDate,
        p_end_date: endDate
      });

    if (todayError) {
      console.error('Error calculating today adherence:', todayError);
    }

    // Get weekly average
    const { data: weeklyAdherence, error: weeklyError } = await supabase
      .rpc('calculate_adherence_percentage', {
        p_user_id: user.id,
        p_start_date: startDate,
        p_end_date: endDate
      });

    if (weeklyError) {
      console.error('Error calculating weekly adherence:', weeklyError);
    }

    // Get current streak
    const { data: currentStreak, error: streakError } = await supabase
      .rpc('get_adherence_streak', {
        p_user_id: user.id
      });

    if (streakError) {
      console.error('Error calculating streak:', streakError);
    }

    // Get daily breakdown for the period
    const { data: dailyBreakdown, error: dailyError } = await supabase
      .from('user_supplement_adherence')
      .select('entry_date, taken')
      .eq('user_id', user.id)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .order('entry_date', { ascending: true });

    if (dailyError) {
      console.error('Error fetching daily breakdown:', dailyError);
    }

    // Process daily breakdown
    const dailyStats = dailyBreakdown?.reduce((acc: any, entry: any) => {
      const date = entry.entry_date;
      if (!acc[date]) {
        acc[date] = { total: 0, taken: 0 };
      }
      acc[date].total++;
      if (entry.taken) {
        acc[date].taken++;
      }
      return acc;
    }, {}) || {};

    // Convert to array with percentages
    const dailyArray = Object.entries(dailyStats).map(([date, stats]: [string, any]) => ({
      date,
      adherence: stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0,
      total: stats.total,
      taken: stats.taken
    }));

    const adherenceStats = {
      todayAdherence: todayAdherence || 0,
      weeklyAverage: weeklyAdherence || 0,
      currentStreak: currentStreak || 0,
      dailyBreakdown: dailyArray,
      period: {
        startDate,
        endDate,
        days
      }
    };

    return NextResponse.json({ adherenceStats });
  } catch (error) {
    console.error('Error in adherence GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 