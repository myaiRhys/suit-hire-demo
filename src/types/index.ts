// Database Document Types

export interface Suit {
  _id: string; // e.g., "suit:lehman:black:r34:001"
  type: 'suit';
  style: string; // "Lehman", "WSC", "Carlton", "Windsor", "Preston"
  colour: string; // "Black", "Blue", "Grey"
  size: string; // "R34", "S36", etc.
  sizeCategory: 'S' | 'R' | 'L'; // Short, Regular, Long
  sizeNumber: number; // 34, 36, 38, 40, 42
  instanceNumber: number; // For multiple suits of same size (1, 2, 3...)
  status: 'active' | 'retired';
  homeStore: string; // Store ID
  createdAt: string;
}

export interface Trousers {
  _id: string; // e.g., "trousers:lehman:black:r34:001"
  type: 'trousers';
  style: string;
  colour: string;
  size: string;
  sizeCategory: 'S' | 'R' | 'L';
  sizeNumber: number;
  instanceNumber: number;
  status: 'active' | 'retired';
  homeStore: string;
  createdAt: string;
}

export interface Shirt {
  _id: string; // e.g., "shirt:white:m:001"
  type: 'shirt';
  colour: 'White' | 'Black';
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  instanceNumber: number;
  status: 'active' | 'retired';
  homeStore: string;
  createdAt: string;
}

export interface Accessory {
  _id: string; // e.g., "tie:sage:001" or "pocketsquare:navy:001"
  type: 'tie' | 'pocketsquare';
  colour: string; // "Sage", "Dusty Pink", "Mint Green", "Navy", "Burgundy"
  instanceNumber: number;
  status: 'active' | 'retired';
  homeStore: string;
  createdAt: string;
}

export interface Customer {
  _id: string; // e.g., "customer:uuid"
  type: 'customer';
  name: string;
  contactNumbers: string[]; // Can have multiple
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Booking {
  _id: string; // e.g., "booking:uuid"
  type: 'booking';

  // Customer
  customerId: string;
  customerName: string; // Denormalised for quick display
  customerContact: string; // Primary contact denormalised

  // Week (always a Friday)
  weekStartDate: string; // ISO date of the Friday, e.g., "2025-12-19"

  // Jacket
  suitId: string; // Reference to the specific suit
  suitStyle: string; // Denormalised
  suitColour: string; // Denormalised
  suitSize: string; // Denormalised

  // Trousers
  trousersId: string;
  trousersStyle: string;
  trousersColour: string;
  trousersSize: string;
  waistMeasurement?: number;
  legLength?: number;

  // Extras (optional)
  shirtId?: string;
  shirtSize?: string;
  shirtColour?: string;

  tieId?: string;
  tieColour?: string;

  pocketSquareId?: string;
  pocketSquareColour?: string;

  // Status
  status: 'booked' | 'collected' | 'returned' | 'cancelled';

  // Notes
  fittingNotes?: string;

  // Audit
  storeId: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

// Union type for all inventory items
export type InventoryItem = Suit | Trousers | Shirt | Accessory;

// Union type for all document types
export type Document = Suit | Trousers | Shirt | Accessory | Customer | Booking;

// Helper types for creating new documents
export type NewSuit = Omit<Suit, '_id' | 'createdAt'>;
export type NewTrousers = Omit<Trousers, '_id' | 'createdAt'>;
export type NewShirt = Omit<Shirt, '_id' | 'createdAt'>;
export type NewAccessory = Omit<Accessory, '_id' | 'createdAt'>;
export type NewCustomer = Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>;
export type NewBooking = Omit<Booking, '_id' | 'createdAt' | 'updatedAt' | 'statusHistory'>;

// Constants
export const SUIT_STYLES = ['Lehman', 'WSC', 'Carlton', 'Windsor', 'Preston'] as const;
export const SUIT_COLOURS = ['Black', 'Blue', 'Grey'] as const;
export const SUIT_SIZES = ['R34', 'S36', 'R36', 'L36', 'S38', 'R38', 'R40', 'L40', 'S42', 'R42'] as const;
export const SHIRT_COLOURS = ['White', 'Black'] as const;
export const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export const ACCESSORY_COLOURS = ['Sage', 'Dusty Pink', 'Mint Green', 'Navy', 'Burgundy'] as const;

export type SuitStyle = typeof SUIT_STYLES[number];
export type SuitColour = typeof SUIT_COLOURS[number];
export type SuitSize = typeof SUIT_SIZES[number];
export type ShirtColour = typeof SHIRT_COLOURS[number];
export type ShirtSize = typeof SHIRT_SIZES[number];
export type AccessoryColour = typeof ACCESSORY_COLOURS[number];
