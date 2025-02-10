'use client';

import { Fragment, useCallback, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import { CldImage } from 'next-cloudinary';
import { toast } from 'sonner';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (uploadedImages: { public_id: string; secure_url: string }[]) => void;
}

export default function PhotoUploadModal({ isOpen, onClose, onUploadComplete }: PhotoUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { progress: number; speed: number; timeLeft: number } }>({});
  const [uploadedImages, setUploadedImages] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageTransforms, setImageTransforms] = useState<{ [key: string]: { rotate: number; crop: { x: number; y: number; width: number; height: number } | null } }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateUploadStats = (loaded: number, total: number, startTime: number) => {
    const progress = Math.round((loaded * 100) / total);
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // seconds
    const speed = loaded / elapsedTime; // bytes per second
    const remainingBytes = total - loaded;
    const timeLeft = remainingBytes / speed; // seconds

    return {
      progress,
      speed: speed / 1024, // Convert to KB/s
      timeLeft: Math.round(timeLeft)
    };
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadStartTime = Date.now();
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'sponsors');
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');

        // Add image transformations if they exist
        const transform = imageTransforms[file.name];
        if (transform) {
          if (transform.rotate) {
            formData.append('angle', transform.rotate.toString());
          }
          if (transform.crop) {
            formData.append('crop', 'crop');
            formData.append('x', transform.crop.x.toString());
            formData.append('y', transform.crop.y.toString());
            formData.append('width', transform.crop.width.toString());
            formData.append('height', transform.crop.height.toString());
          }
        }

        const xhr = new XMLHttpRequest();
        const promise = new Promise<string>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const stats = calculateUploadStats(event.loaded, event.total, uploadStartTime);
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: stats
              }));
            }
          });

          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve({
                public_id: response.public_id,
                secure_url: response.secure_url
              });
            } else {
              reject(new Error('Upload failed'));
            }
          };

          xhr.onerror = () => reject(new Error('Upload failed'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
        xhr.send(formData);

        return promise;
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((result): result is { public_id: string; secure_url: string } => result !== null);
      setUploadedImages((prev) => [...prev, ...successfulUploads]);
      onUploadComplete?.(successfulUploads);
      toast.success(`Successfully uploaded ${successfulUploads.length} images`);
      setFiles([]);
      setUploadProgress({});
      setImageTransforms({});
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Some uploads failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) {
      const confirmed = window.confirm('Upload in progress. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    onClose();
    setFiles([]);
    setUploadProgress({});
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Upload Photos
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-ccc-teal bg-ccc-teal/5' : 'border-gray-300 hover:border-ccc-teal'}`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-ccc-teal">Drop the files here...</p>
                  ) : (
                    <div className="space-y-2">
                      <p>Drag and drop images here, or click to select files</p>
                      <p className="text-sm text-gray-500">
                        Supports: PNG, JPG, GIF (up to 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <motion.div
                          key={file.name}
                          className="relative"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          layoutId={`image-${file.name}`}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className={`w-full aspect-square object-cover rounded-lg cursor-pointer transition-transform duration-200 ${selectedImageIndex === index ? 'ring-4 ring-ccc-teal' : ''}`}
                            onClick={() => setSelectedImageIndex(index)}
                            style={{
                              transform: `rotate(${imageTransforms[file.name]?.rotate || 0}deg)`
                            }}
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                              onClick={() => {
                                const currentRotation = imageTransforms[file.name]?.rotate || 0;
                                setImageTransforms(prev => ({
                                  ...prev,
                                  [file.name]: { ...prev[file.name], rotate: currentRotation + 90 }
                                }));
                              }}
                              className="bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeFile(index)}
                              className="bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                          {uploadProgress[file.name] && (
                            <div className="absolute inset-x-4 bottom-4">
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg space-y-1">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-ccc-teal transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress[file.name].progress}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span>{uploadProgress[file.name].progress}%</span>
                                  <span>{Math.round(uploadProgress[file.name].speed)} KB/s</span>
                                  <span>{uploadProgress[file.name].timeLeft}s left</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isUploading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="px-4 py-2 text-sm font-medium text-white bg-ccc-teal rounded-md hover:bg-ccc-teal-dark disabled:opacity-50"
                      >
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </div>
                )}

                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Recently Uploaded</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.public_id} className="relative">
                          <CldImage
                            src={image.public_id}
                            width={400}
                            height={400}
                            alt={`Recently uploaded image ${image.public_id}`}
                            className="w-full aspect-square object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
