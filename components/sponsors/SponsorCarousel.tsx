'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import AutoPlay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { SponsorLightbox } from './SponsorLightbox';

type Sponsor = {
  name: string;
  level: 'Champion' | 'Eagle';
  imageUrl: string;
  year: number;
  website?: string;
};

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: 'center',
  containScroll: 'trimSnaps',
  dragFree: true,
  skipSnaps: true,
  slidesToScroll: 1,
};

const AUTOPLAY_OPTIONS = {
  delay: 4000,
  stopOnInteraction: false,
  rootNode: (emblaRoot: any) => emblaRoot.parentElement,
};

export default function SponsorCarousel() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [AutoPlay(AUTOPLAY_OPTIONS)]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('/api/cloudinary/list-resources');
        const data = await response.json();
        
        // Safely map resources with error checking
        const sponsorData = (data.resources || []).map((resource: any) => ({
          name: resource.context?.name || resource.public_id.split('/').pop(),
          level: resource.tags?.[0] || resource.context?.level || 'Champion',
          imageUrl: resource.secure_url,
          year: parseInt(resource.context?.year) || new Date().getFullYear(),
          website: resource.context?.website,
        }));

        // Safely duplicate sponsors if needed (prevent infinite loop)
        const minSponsors = 3;
        if (sponsorData.length > 0 && sponsorData.length < minSponsors) {
          const duplicatesNeeded = minSponsors - sponsorData.length;
          const duplicates = Array(duplicatesNeeded)
            .fill(null)
            .flatMap(() => sponsorData);
          sponsorData.push(...duplicates.slice(0, duplicatesNeeded));
        }

        setSponsors(sponsorData);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />;
  }

  if (!sponsors.length) {
    return null;
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Our Sponsors</h2>
        
        <div className="overflow-hidden relative" ref={emblaRef}>
          <div className="flex cursor-grab active:cursor-grabbing">
            {sponsors.map((sponsor, index) => (
              <div 
                key={`${sponsor.name}-${index}`}
                className={cn(
                  "flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-4 transition-opacity duration-300",
                  selectedIndex === index ? 'opacity-100' : 'opacity-70'
                )}
              >
                <div 
                  className={cn(
                    "bg-white rounded-lg shadow-lg p-6 h-full transition-all duration-300 transform",
                    selectedIndex === index ? 'scale-105 shadow-xl' : 'scale-100',
                    'hover:shadow-xl hover:scale-105'
                  )}
                >
                  <div 
                    className="relative aspect-[3/2] cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedSponsor(sponsor)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedSponsor(sponsor)}
                  >
                    <Image
                      src={sponsor.imageUrl}
                      alt={`${sponsor.name} logo`}
                      fill
                      className="object-contain p-4"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex justify-center mt-4">
                    <span 
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                        sponsor.level === 'Champion' 
                          ? "bg-[#66D1FF] text-[#003D5B]"
                          : "bg-[#FFD700] text-[#8B6F00]"
                      )}
                    >
                      {sponsor.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {sponsors.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  selectedIndex === index 
                    ? "bg-[#66D1FF] w-4"
                    : "bg-gray-300 hover:bg-[#66D1FF]/50"
                )}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <SponsorLightbox
          isOpen={!!selectedSponsor}
          onClose={() => setSelectedSponsor(null)}
          sponsor={selectedSponsor}
        />
      </div>
    </section>
  );
}
