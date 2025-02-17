const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabase() {
  try {
    // Test reading sponsor levels
    console.log('Testing SELECT on sponsor_levels...')
    const { data: levels, error: levelsError } = await supabase
      .from('sponsor_levels')
      .select('*')
    
    if (levelsError) throw levelsError
    console.log('Successfully read sponsor levels:', levels)

    // Test inserting a sponsor
    console.log('\nTesting INSERT on sponsors...')
    const { data: sponsor, error: sponsorError } = await supabase
      .from('sponsors')
      .insert([
        {
          name: 'Test Sponsor',
          level: levels[0].id, // Use the first sponsor level
          year: 2025,
          image_url: 'https://example.com/test.jpg'
        }
      ])
      .select()
    
    if (sponsorError) throw sponsorError
    console.log('Successfully inserted sponsor:', sponsor)

  } catch (error) {
    console.error('Error:', error)
  }
}

testDatabase()
