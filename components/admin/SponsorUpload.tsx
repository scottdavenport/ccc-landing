// Hi! 👋 This tells Next.js we want to use special features like uploading files
'use client';

// Let's get our tools ready!
import { useState } from 'react';  // This helps us remember things (like our uploaded image)
import { CldUploadWidget, CldImage } from 'next-cloudinary';  // These help us upload and show images
import { toast } from 'sonner';  // This shows pretty messages when we upload images

// This is our special sponsor upload area! 🎨
// It's like a special photo frame where we can put sponsor logos
export default function SponsorUpload() {
  // This is like a sticky note where we remember our uploaded image
  // It has two parts: public_id (like a name tag) and secure_url (where to find it)
  const [uploadedImage, setUploadedImage] = useState<{ 
    public_id: string; 
    secure_url: string 
  } | null>(null);  // We start with null (empty) because we haven't uploaded anything yet

  // This is what happens when someone uploads an image
  // It's like getting a new photo and putting it in our photo frame
  const handleUpload = (result: any) => {
    // If the upload worked...
    if (result.event === 'success') {
      // Remember the new image's details
      setUploadedImage({
        public_id: result.info.public_id,     // The image's special name
        secure_url: result.info.secure_url    // Where to find the image
      });
      // Show a happy message! 🎉
      toast.success('Image uploaded successfully!');
    }
  };

  // If we have an uploaded image, let's show it!
  // This is like saying "if we have a photo, put it in the frame"
  return uploadedImage ? (
    <div className="mt-4">  {/* Add some space at the top */}
      <p className="text-sm text-gray-600 mb-2">Preview:</p>
      <div className="relative">
        {/* This is our fancy image display */}
        <CldImage
          src={uploadedImage.public_id}  // Which image to show
          width={400}                     // How wide to make it
          height={400}                    // How tall to make it
          alt="Uploaded sponsor image"     // What to call it for screen readers
          className="max-w-full h-auto rounded-lg shadow-md"  // Make it look pretty
        />
      </div>
    </div>
  ) : null;  // If we don't have an image yet, don't show anything
}
