import { useState, useEffect } from 'react';
import { getSuitsByStyleAndColour, getTrousersByStyleAndColour } from '../db/queries';
import type { Suit, Trousers, SuitStyle, SuitColour } from '../types';

export function useSuits(style: SuitStyle, colour: SuitColour) {
  const [suits, setSuits] = useState<Suit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchSuits() {
      try {
        setLoading(true);
        setError(null);
        const data = await getSuitsByStyleAndColour(style, colour);

        if (isMounted) {
          setSuits(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch suits');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSuits();

    return () => {
      isMounted = false;
    };
  }, [style, colour]);

  return { suits, loading, error };
}

export function useTrousers(style: SuitStyle, colour: SuitColour) {
  const [trousers, setTrousers] = useState<Trousers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrousers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTrousersByStyleAndColour(style, colour);

        if (isMounted) {
          setTrousers(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch trousers');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTrousers();

    return () => {
      isMounted = false;
    };
  }, [style, colour]);

  return { trousers, loading, error };
}
