// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lsdfxmiixmmgawhzyvza.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZGZ4bWlpeG1tZ2F3aHp5dnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MTE2MjEsImV4cCI6MjA2NTE4NzYyMX0.z2WfmeYLXq9rP1dgVQhgyQ9IbYX5QFAsYHQ4BbZO3aM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
    } else {
      console.log('✅ Database connection successful');
      console.log('Data:', data);
    }
    
    // Test Edge Function
    console.log('\nTesting Edge Function...');
    const { data: funcData, error: funcError } = await supabase.functions.invoke('check-product', {
      body: { productUrl: 'https://www.amazon.com/dp/B00TEST123' }
    });
    
    if (funcError) {
      console.error('❌ Edge Function error:', funcError);
    } else {
      console.log('✅ Edge Function successful');
      console.log('Response:', funcData);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection(); 