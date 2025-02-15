'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  /** Called when files are dropped or selected */
  onFileSelect: (file: File) => void;
  /** Whether the component is in a disabled state */
  disabled?: boolean;
}

/**
 * A customizable drop zone for file uploads
 * 
 * @remarks
 * This component provides a drag-and-drop interface for file uploads with:
 * - Visual feedback for drag states
 * - File type validation
 * - Accessible button for manual file selection
 */
export function DropZone({ onFileSelect, disabled = false }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag and drop an image, or click to select</p>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Supported formats: PNG, JPG, GIF, WebP
        </p>
      </div>
    </div>
  );
}
