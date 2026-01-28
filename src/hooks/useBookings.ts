import { useState, useEffect } from 'react';
import { getBookingsByWeek } from '../db/queries';
import type { Booking } from '../types';

export function useBookings(weekStartDate: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookingsByWeek(weekStartDate);

        if (isMounted) {
          setBookings(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [weekStartDate]);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await getBookingsByWeek(weekStartDate);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh bookings');
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refresh };
}
