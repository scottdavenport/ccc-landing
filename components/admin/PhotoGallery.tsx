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
        console.log('Fetching Cloudinary resources...');
        // Add timestamp to bust cache
        const timestamp = new Date().getTime();
        const listResponse = await fetch(`/api/cloudinary/list-resources?t=${timestamp}`, {
          cache: 'no-store'
        });
        
        // First check if the response is ok
        if (!listResponse.ok) {
          const errorData = await listResponse.json();
          throw new Error(
            errorData.error || 
            `Failed to list resources: ${listResponse.status} ${listResponse.statusText}`
          );
        }
        
        const data = await listResponse.json();
        console.log('Cloudinary Data:', {
          resourceCount: data.resources?.length || 0,
          folderCount: data.folders?.length || 0,
          message: data.message
        });
        
        setResources(data.resources || []);
        setFolders(data.folders || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching resources:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        setError(error instanceof Error ? error.message : 'Failed to load resources');
      } finally {
        // We're done loading, whether it worked or not
        setLoading(false);
      }
    };

    // Let's go get those photos!
    fetchResources();
  }, []); // The empty [] means "only do this when the page first loads"

  // If we're still loading, show a loading message with spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading resources...</p>
      </div>
    );
  }

  // If something went wrong, show a nice error message
  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
          <div className="flex items-center mb-2">
            <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error Loading Resources</h3>
          </div>
          <p className="text-red-700 whitespace-pre-wrap">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              "bg-white p-4 rounded-lg shadow transition-colors flex flex-col items-center text-center",
              selectedImages.has(resource.public_id) && "bg-blue-50"
            )}
          >
            <div className="relative aspect-square mb-2 group h-[150px] w-full">
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
            <div className="text-xs space-y-1 w-full">
              <div>
                <p className="font-semibold truncate text-center">{resource.display_name || resource.public_id.split('/').pop()}</p>
                <p className="text-gray-500 text-center">{new Date(resource.created_at).toLocaleDateString()}</p>
                <p className="text-gray-500 text-center">{resource.format.toUpperCase()} • {(resource.bytes / 1024).toFixed(1)} KB</p>
                <p className="text-gray-500 text-center">Original: {resource.width}×{resource.height}</p>
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