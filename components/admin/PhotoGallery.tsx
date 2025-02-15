'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CloudinaryResource } from '@/lib/cloudinary';

interface CloudinaryFolder {
  name: string;
  path: string;
}

export default function PhotoGallery() {
  const [resources, setResources] = useState<any[]>([]);
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // First, let's get all resources and folders to debug
        const listResponse = await fetch('/api/cloudinary/list-resources');
        if (!listResponse.ok) throw new Error('Failed to list resources');
        
        const data = await listResponse.json();
        console.log('Cloudinary Data:', data);
        
        setResources(data.resources || []);
        setFolders(data.folders || []);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
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