'use client';

import { useState, useEffect } from 'react';
import { civicApi, ApiDevelopmentScore, ApiComparison } from '@/lib/api';
import { CityId } from '@/types';

export function useCivicApi(cityId: CityId) {
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [liveScore, setLiveScore] = useState<ApiDevelopmentScore | null>(null);
  const [liveComparison, setLiveComparison] = useState<ApiComparison | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAndFetch() {
      setIsLoading(true);
      try {
        const health = await civicApi.checkHealth();
        if (health && health.status === 'healthy') {
          if (isMounted) setIsBackendConnected(true);

          // Fetch live development score from backend database
          const score = await civicApi.getDevelopmentScore(cityId);
          if (isMounted) setLiveScore(score);

          // Fetch comparison
          const comp = await civicApi.getComparison('koraput', 'bhubaneswar');
          if (isMounted) setLiveComparison(comp);
        } else {
          if (isMounted) setIsBackendConnected(false);
        }
      } catch {
        if (isMounted) setIsBackendConnected(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkAndFetch();

    return () => {
      isMounted = false;
    };
  }, [cityId]);

  return {
    isBackendConnected,
    liveScore,
    liveComparison,
    isLoading,
  };
}
