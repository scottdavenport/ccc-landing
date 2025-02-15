'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CloudinaryResource } from '@/lib/cloudinary';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

/**
 * Represents a folder in the Cloudinary storage system
 * 
 * @example
 * ```typescript
 * const folder: CloudinaryFolder = {
 *   name: "sponsors",
 *   path: "sponsors/2024"
 * };
 * ```
 */
interface CloudinaryFolder {
  /** The display name of the folder */
  name: string;
  /** The full path to the folder in Cloudinary */
  path: string;
}

/**
 * A dynamic photo gallery component that displays images from Cloudinary.
 * Handles loading states, errors, and displays both images and folder structure.
 * 
 * @remarks
 * This component automatically fetches and displays images from Cloudinary when mounted.
 * It supports error handling and loading states for a better user experience.
 * 
 * @example
 * ```tsx
 * // In a parent component
 * function AdminDashboard() {
 *   return (
 *     <div>
 *       <h1>Photo Management</h1>
 *       <PhotoGallery />
 *     </div>
 *   );
 * }
 * ```
 */
export default function PhotoGallery() {
  /** All photos retrieved from Cloudinary */
  const [resources, setResources] = useState<any[]>([]);
  /** Available folders in Cloudinary */
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);
  /** Loading state for async operations */
  const [loading, setLoading] = useState(true);
  /** Error message if something goes wrong */
  const [error, setError] = useState<string | null>(null);
  /** Loading state for delete operation */
  const [deleteLoading, setDeleteLoading] = useState(false);

  /**
   * Handles the deletion of an image from Cloudinary
   * 
   * @param publicId - The public ID of the image to delete
   */
  const handleDelete = async (publicId: string) => {
    setDeleteLoading(true);
    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Remove the deleted image from the resources state
      setResources((prev) => prev.filter((resource) => resource.public_id !== publicId));
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete image');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    /**
     * Fetches resources and folders from Cloudinary
     * 
     * @throws Will throw an error if the API request fails
     * @returns A Promise that resolves when resources are fetched
     * 
     * @internal
     */
    const fetchResources = async () => {
      try {
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
            <div className="text-sm space-y-2">
              <div>
                <p className="font-semibold truncate">{resource.public_id}</p>
                <p className="text-gray-500">{new Date(resource.created_at).toLocaleDateString()}</p>
                <p className="text-gray-500">{resource.format} - {(resource.bytes / 1024).toFixed(2)}KB</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    disabled={deleteLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Image
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      image from Cloudinary.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(resource.public_id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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