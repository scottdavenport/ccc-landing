import { createSponsor } from '../utils/supabase-admin';
import { getPublicSponsors } from '../utils/database-public';

async function testSponsorOperations() {
  try {
    // Test reading sponsors (public operation)
    console.log('Testing getPublicSponsors...');
    const sponsors = await getPublicSponsors();
    console.log('Successfully read sponsors:', sponsors.length);

    // Test creating a sponsor (admin operation)
    console.log('\nTesting createSponsor...');
    const newSponsor = {
      name: 'Test Sponsor',
      level: '5a2a245b-2e0e-40e5-8094-cd8044b8645b', // Champion level
      year: 2024,
      cloudinary_public_id: 'test-sponsor',
      image_url: 'https://example.com/test.jpg'
    };

    const createdSponsor = await createSponsor(newSponsor);
    console.log('Successfully created sponsor:', createdSponsor);

  } catch (error) {
    console.error('Error during test:', error);
  }
}

testSponsorOperations();
