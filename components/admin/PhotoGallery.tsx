'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CloudinaryResource } from '@/lib/cloudinary';
import { Trash2, CheckSquare, Square } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { SponsorDialog } from './SponsorDialog';

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
  /** Selected image IDs for bulk deletion */
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  /**
   * Handles the deletion of one or more images from Cloudinary
   * 
   * @param publicIds - The public ID(s) of the image(s) to delete
   */
  const handleDelete = async (publicIds: string | string[]) => {
    setDeleteLoading(true);
    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete image(s)');
      }

      // Remove the deleted images from the resources state
      const idsToRemove = Array.isArray(publicIds) ? publicIds : [publicIds];
      setResources((prev) => 
        prev.filter((resource) => !idsToRemove.includes(resource.public_id))
      );
      
      // Clear selected images after successful bulk delete
      if (Array.isArray(publicIds)) {
        setSelectedImages(new Set());
      }
    } catch (error) {
      console.error('Error deleting image(s):', error);
      setError(error instanceof Error ? error.message : 'Failed to delete image(s)');
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Toggles the selection state of an image
   * 
   * @param publicId - The public ID of the image to toggle
   */
  const toggleImageSelection = (publicId: string) => {
    setSelectedImages((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(publicId)) {
        newSelection.delete(publicId);
      } else {
        newSelection.add(publicId);
      }
      return newSelection;
    });
  };

  /**
   * Handles bulk deletion of selected images
   */
  const handleBulkDelete = () => {
    const selectedIds = Array.from(selectedImages);
    handleDelete(selectedIds);
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

  // Now let's show our sponsor logos!
  return (
    <div className="space-y-8">
      {/* This is our debug section - it helps us see what's happening behind the scenes */}
      <div className="space-y-4">
          <SponsorDialog />
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Sponsor Logos</h2>
            <p className="text-gray-600">{resources.length} logos</p>
          </div>
        </div>
        <hr className="border-t border-gray-300 shadow-sm" />

        {selectedImages.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <Trash2 className="h-5 w-5 mr-2" />
                Delete ({selectedImages.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {selectedImages.size} images?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  {selectedImages.size === 1 ? ' this image ' : ' these images '}
                  from Cloudinary.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete {selectedImages.size} images
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {resources.map((resource) => (
          <div 
            key={resource.public_id} 
            className={cn(
              "bg-white p-4 rounded-lg shadow transition-colors",
              selectedImages.has(resource.public_id) && "bg-blue-50"
            )}
          >
            <div className="relative aspect-square mb-2 group h-[150px]">
              <Image
                src={resource.secure_url}
                alt={resource.public_id}
                fill
                className="object-cover rounded-lg"
                sizes="150px"
                unoptimized
                loading="lazy"
              />
              <button
                onClick={() => toggleImageSelection(resource.public_id)}
                className="absolute top-1 right-1 p-0.5 rounded-md bg-white/80 hover:bg-white shadow-sm"
              >
                {selectedImages.has(resource.public_id) ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <div className="text-xs space-y-1">
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