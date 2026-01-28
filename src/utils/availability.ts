import type { Booking } from '../types';

/**
 * Check if a specific item (suit, trousers, shirt, tie, pocket square) is available for a given week
 *
 * An item is available if it's NOT in any booking where:
 * - booking.weekStartDate equals that week AND
 * - booking.status is 'booked' OR 'collected'
 */
export function isItemAvailable(
  itemId: string,
  weekStartDate: string,
  bookings: Booking[]
): boolean {
  return !bookings.some(booking => {
    // Check if this booking blocks the item
    const isItemInBooking =
      booking.suitId === itemId ||
      booking.trousersId === itemId ||
      booking.shirtId === itemId ||
      booking.tieId === itemId ||
      booking.pocketSquareId === itemId;

    // Item is blocked if it's in a booking for this week that's not returned or cancelled
    return (
      isItemInBooking &&
      booking.weekStartDate === weekStartDate &&
      (booking.status === 'booked' || booking.status === 'collected')
    );
  });
}

/**
 * Get all bookings that use a specific item for a specific week
 */
export function getBookingsForItem(
  itemId: string,
  weekStartDate: string,
  bookings: Booking[]
): Booking[] {
  return bookings.filter(booking => {
    const isItemInBooking =
      booking.suitId === itemId ||
      booking.trousersId === itemId ||
      booking.shirtId === itemId ||
      booking.tieId === itemId ||
      booking.pocketSquareId === itemId;

    return (
      isItemInBooking &&
      booking.weekStartDate === weekStartDate &&
      (booking.status === 'booked' || booking.status === 'collected')
    );
  });
}

/**
 * Count how many items of a specific size are available
 */
export function countAvailableBySize(
  allItems: { _id: string; size: string }[],
  size: string,
  weekStartDate: string,
  bookings: Booking[]
): { available: number; total: number } {
  const itemsOfSize = allItems.filter(item => item.size === size);
  const total = itemsOfSize.length;

  const available = itemsOfSize.filter(item =>
    isItemAvailable(item._id, weekStartDate, bookings)
  ).length;

  return { available, total };
}

/**
 * Get status color class for Tailwind CSS
 */
export function getStatusColorClass(status: Booking['status']): string {
  switch (status) {
    case 'booked':
      return 'bg-blue-100 border-blue-300';
    case 'collected':
      return 'bg-green-100 border-green-300';
    case 'returned':
      return 'bg-gray-100 border-gray-300';
    case 'cancelled':
      return 'bg-red-100 border-red-300 line-through';
    default:
      return 'bg-white border-gray-200';
  }
}

/**
 * Get status badge color
 */
export function getStatusBadgeClass(status: Booking['status']): string {
  switch (status) {
    case 'booked':
      return 'bg-blue-500 text-white';
    case 'collected':
      return 'bg-green-500 text-white';
    case 'returned':
      return 'bg-gray-500 text-white';
    case 'cancelled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-gray-800';
  }
}
