import { useEffect, useState } from 'react';
import type { SponsorLevel } from '@/types/database';

export function useSponsorLevels() {
  const [levels, setLevels] = useState<SponsorLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchLevels() {
      try {
        const response = await fetch('/api/sponsor-levels');
        if (!response.ok) {
          throw new Error('Failed to fetch sponsor levels');
        }
        const data = await response.json();
        setLevels(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchLevels();
  }, []);

  return { levels, isLoading, error };
}
