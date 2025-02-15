// Hey there! 👋 This tells Next.js we want to use special features like clicking and loading things
'use client';

// First, let's get our tools - like getting crayons and paper before drawing
import { useEffect, useState } from 'react';  // These help us remember things and do things when the page loads
import Image from 'next/image';                // This helps us show pictures nicely
import { CloudinaryResource } from '@/lib/cloudinary';  // This helps us talk to our photo storage

// This is like a recipe card that tells us what a folder should look like
interface CloudinaryFolder {
  name: string;  // The name of the folder (like "Vacation Photos")
  path: string;  // Where to find the folder (like "in the bottom drawer")
}

// This is our photo gallery - like a digital photo album!
export default function PhotoGallery() {
  // These are like sticky notes that help us remember things:
  const [resources, setResources] = useState<any[]>([]);        // List of all our photos
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);  // List of our photo folders
  const [loading, setLoading] = useState(true);                    // Are we still getting the photos?
  const [error, setError] = useState<string | null>(null);         // Did something go wrong?

  // When our page first opens, we want to get all our photos
  // It's like opening your photo album when you first sit down to look at it
  useEffect(() => {
    // This is our helper that goes and gets all our photos
    const fetchResources = async () => {
      try {
        // First, let's ask our photo storage for all our pictures
        // It's like asking "Can I see all the photos we have?"
        const listResponse = await fetch('/api/cloudinary/list-resources');
        if (!listResponse.ok) throw new Error('Failed to list resources');
        
        // Turn the response into something we can use
        const data = await listResponse.json();
        // Let's see what we got back (this helps us fix problems)
        console.log('Cloudinary Data:', data);
        
        // Save our photos and folders in our sticky notes
        setResources(data.resources || []);  // All our photos
        setFolders(data.folders || []);      // All our folders
        setError(null);                      // Clear any errors
      } catch (error) {
        // Uh oh! Something went wrong!
        console.error('Error:', error);
        // Let's make a note of what went wrong
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        // We're done loading, whether it worked or not
        setLoading(false);
      }
    };

    // Let's go get those photos!
    fetchResources();
  }, []); // The empty [] means "only do this when the page first loads"

  // If we're still loading, show a loading message
  if (loading) return <div>Loading...</div>;
  // If something went wrong, show the error in red
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Now let's show our photo gallery!
  return (
    <div className="space-y-8">
      {/* This is our debug section - it helps us see what's happening behind the scenes */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <div className="space-y-2">
          <p>Found {resources.length} resources</p>
          <p>Available folders: {folders.map(f => f.name).join(', ') || 'None'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource.public_id} className="bg-white p-4 rounded-lg shadow">
            <div className="relative aspect-square mb-2">
              <Image
                src={resource.secure_url}
                alt={resource.public_id}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="text-sm">
              <p className="font-semibold truncate">{resource.public_id}</p>
              <p className="text-gray-500">{new Date(resource.created_at).toLocaleDateString()}</p>
              <p className="text-gray-500">{resource.format} - {(resource.bytes / 1024).toFixed(2)}KB</p>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No images found. Try uploading some sponsor logos.
        </div>
      )}
    </div>
  );
}