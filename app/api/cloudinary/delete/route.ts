import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Deletes an image from Cloudinary by its public ID
 * 
 * @route DELETE /api/cloudinary/delete
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response indicating success or failure
 */
export async function DELETE(request: Request) {
  try {
    const { publicIds } = await request.json();
    const idsToDelete = Array.isArray(publicIds) ? publicIds : [publicIds];

    if (!idsToDelete.length) {
      return NextResponse.json(
        { error: 'At least one Public ID is required' },
        { status: 400 }
      );
    }

    // Configure Cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Delete the images from Cloudinary
    const results = await Promise.allSettled(
      idsToDelete.map((id) => cloudinary.uploader.destroy(id))
    );

    // Check results and collect any failures
    const failures = results.reduce((acc, result, index) => {
      if (result.status === 'rejected' || (result.status === 'fulfilled' && result.value.result !== 'ok')) {
        acc.push(idsToDelete[index]);
      }
      return acc;
    }, [] as string[]);

    if (failures.length > 0) {
      return NextResponse.json(
        {
          message: 'Some images failed to delete',
          failures,
          totalDeleted: idsToDelete.length - failures.length
        },
        { status: 207 }
      );
    }

    return NextResponse.json({
      message: `Successfully deleted ${idsToDelete.length} image${idsToDelete.length === 1 ? '' : 's'}`
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
