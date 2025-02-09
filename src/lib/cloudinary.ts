import { Cloudinary } from '@cloudinary/url-gen';
import { Resize } from '@cloudinary/url-gen/actions/resize';

// Create a Cloudinary instance and set your cloud name.
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const getCloudinaryImage = (publicId: string) => {
  return cloudinary
    .image(publicId)
    .resize(Resize.scale().width(200).height(200))
    .format('auto')
    .quality('auto');
};

export default cloudinary;
