const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('sponsor_levels')
      .select('*')
    
    if (error) throw error
    
    console.log('Successfully connected to database!')
    console.log('Sponsor Levels:', data)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testConnection()
