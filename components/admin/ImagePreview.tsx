'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  /** The file to preview */
  file: File;
  /** Called when the user clicks to remove the image */
  onRemove: () => void;
}

/**
 * Displays a preview of an uploaded image with remove functionality
 */
export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative mt-4 rounded-lg overflow-hidden border border-gray-200">
      <Image
        src={URL.createObjectURL(file)}
        alt="Preview"
        width={400}
        height={400}
        className="w-full h-auto object-contain"
        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
