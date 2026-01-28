import db from './database';
import type {
  Suit,
  Trousers,
  Shirt,
  Accessory,
  Booking,
  Customer,
  SuitStyle,
  SuitColour,
  ShirtColour,
  ShirtSize,
  AccessoryColour
} from '../types';

/**
 * Get all suits by style and colour
 */
export async function getSuitsByStyleAndColour(style: SuitStyle, colour: SuitColour): Promise<Suit[]> {
  const result = await db.find({
    selector: {
      type: 'suit',
      style,
      colour,
      status: 'active'
    },
    sort: [{ sizeNumber: 'asc' }, { sizeCategory: 'asc' }, { instanceNumber: 'asc' }]
  });

  return result.docs as Suit[];
}

/**
 * Get all trousers by style and colour
 */
export async function getTrousersByStyleAndColour(style: SuitStyle, colour: SuitColour): Promise<Trousers[]> {
  const result = await db.find({
    selector: {
      type: 'trousers',
      style,
      colour,
      status: 'active'
    },
    sort: [{ sizeNumber: 'asc' }, { sizeCategory: 'asc' }, { instanceNumber: 'asc' }]
  });

  return result.docs as Trousers[];
}

/**
 * Get all shirts by colour and size
 */
export async function getShirtsByColourAndSize(colour?: ShirtColour, size?: ShirtSize): Promise<Shirt[]> {
  const selector: any = {
    type: 'shirt',
    status: 'active'
  };

  if (colour) selector.colour = colour;
  if (size) selector.size = size;

  const result = await db.find({
    selector,
    sort: [{ colour: 'asc' }, { size: 'asc' }, { instanceNumber: 'asc' }]
  });

  return result.docs as Shirt[];
}

/**
 * Get all accessories (ties or pocket squares) by colour
 */
export async function getAccessoriesByType(
  type: 'tie' | 'pocketsquare',
  colour?: AccessoryColour
): Promise<Accessory[]> {
  const selector: any = {
    type,
    status: 'active'
  };

  if (colour) selector.colour = colour;

  const result = await db.find({
    selector,
    sort: [{ colour: 'asc' }, { instanceNumber: 'asc' }]
  });

  return result.docs as Accessory[];
}

/**
 * Get all bookings for a specific week
 */
export async function getBookingsByWeek(weekStartDate: string): Promise<Booking[]> {
  const result = await db.find({
    selector: {
      type: 'booking',
      weekStartDate,
      status: {
        $in: ['booked', 'collected', 'returned']
      }
    }
  });

  return result.docs as Booking[];
}

/**
 * Get all bookings for a suit/trousers/item for a specific week
 */
export async function getBookingsForItem(itemId: string, weekStartDate: string): Promise<Booking[]> {
  const result = await db.find({
    selector: {
      type: 'booking',
      weekStartDate,
      $or: [
        { suitId: itemId },
        { trousersId: itemId },
        { shirtId: itemId },
        { tieId: itemId },
        { pocketSquareId: itemId }
      ],
      status: {
        $in: ['booked', 'collected']
      }
    }
  });

  return result.docs as Booking[];
}

/**
 * Get a booking by ID
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const doc = await db.get(bookingId);
    return doc.type === 'booking' ? (doc as Booking) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Search customers by name or contact number
 */
export async function searchCustomers(query: string): Promise<Customer[]> {
  const result = await db.find({
    selector: {
      type: 'customer',
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { contactNumbers: { $elemMatch: { $regex: new RegExp(query, 'i') } } }
      ]
    },
    limit: 20
  });

  return result.docs as Customer[];
}

/**
 * Get a customer by ID
 */
export async function getCustomerById(customerId: string): Promise<Customer | null> {
  try {
    const doc = await db.get(customerId);
    return doc.type === 'customer' ? (doc as Customer) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Get all bookings for a customer
 */
export async function getBookingsByCustomer(customerId: string): Promise<Booking[]> {
  const result = await db.find({
    selector: {
      type: 'booking',
      customerId
    },
    sort: [{ weekStartDate: 'desc' }]
  });

  return result.docs as Booking[];
}

/**
 * Create a new customer
 */
export async function createCustomer(customer: Omit<Customer, '_id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
  const now = new Date().toISOString();
  const newCustomer: Customer = {
    _id: `customer:${Date.now()}`,
    type: 'customer',
    ...customer,
    createdAt: now,
    updatedAt: now
  };

  await db.put(newCustomer);
  return newCustomer;
}

/**
 * Create a new booking
 */
export async function createBooking(booking: Omit<Booking, '_id' | 'type' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Booking> {
  const now = new Date().toISOString();
  const newBooking: Booking = {
    _id: `booking:${Date.now()}`,
    type: 'booking',
    ...booking,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: booking.status,
        timestamp: now
      }
    ]
  };

  await db.put(newBooking);
  return newBooking;
}

/**
 * Update a booking's status
 */
export async function updateBookingStatus(
  bookingId: string,
  newStatus: Booking['status'],
  note?: string
): Promise<Booking> {
  const booking = await db.get(bookingId) as Booking;
  const now = new Date().toISOString();

  booking.status = newStatus;
  booking.updatedAt = now;
  booking.statusHistory.push({
    status: newStatus,
    timestamp: now,
    note
  });

  await db.put(booking);
  return booking;
}

/**
 * Update a booking
 */
export async function updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
  const booking = await db.get(bookingId) as Booking;
  const now = new Date().toISOString();

  const updatedBooking = {
    ...booking,
    ...updates,
    updatedAt: now
  };

  await db.put(updatedBooking);
  return updatedBooking;
}

/**
 * Delete a booking
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  const booking = await db.get(bookingId);
  await db.remove(booking);
}
