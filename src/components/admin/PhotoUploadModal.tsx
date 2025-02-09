import { Fragment, useCallback, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import { AdvancedImage } from '@cloudinary/react';
import { getCloudinaryImage } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoUploadModal({ isOpen, onClose }: PhotoUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'sponsors');
        formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

        const xhr = new XMLHttpRequest();
        const promise = new Promise<string>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded * 100) / event.total);
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress
              }));
            }
          });

          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.public_id);
            } else {
              reject(new Error('Upload failed'));
            }
          };

          xhr.onerror = () => reject(new Error('Upload failed'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`);
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
      const successfulUploads = results.filter((id): id is string => id !== null);
      setUploadedImages((prev) => [...prev, ...successfulUploads]);
      toast.success(`Successfully uploaded ${successfulUploads.length} images`);
      setFiles([]);
      setUploadProgress({});
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
                        <div key={file.name} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                          {uploadProgress[file.name] !== undefined && (
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                              <div className="bg-white rounded-lg px-3 py-1">
                                {uploadProgress[file.name]}%
                              </div>
                            </div>
                          )}
                        </div>
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
                      {uploadedImages.map((id) => (
                        <div key={id} className="relative">
                          <AdvancedImage
                            cldImg={getCloudinaryImage(id)}
                            className="w-full aspect-square object-cover rounded-lg"
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
