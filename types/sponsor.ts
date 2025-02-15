/**
 * Represents the category of a sponsor
 */
export type SponsorCategory = 'Champion' | 'Eagle';

/**
 * Metadata associated with a sponsor
 */
export interface SponsorMetadata {
  /** The category of sponsorship */
  category: SponsorCategory;
  /** Name of the sponsor */
  name: string;
  /** The year this sponsorship is for */
  year: number;
  /** Optional website URL */
  website?: string;
}

/**
 * Complete sponsor information including image data
 */
export interface SponsorData extends SponsorMetadata {
  /** Cloudinary public ID for the sponsor's logo */
  imageId: string;
  /** URL to access the sponsor's logo */
  imageUrl: string;
}
