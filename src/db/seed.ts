import db from './database';
import type {
  Suit,
  Trousers,
  Shirt,
  Accessory,
  SuitSize
} from '../types';
import {
  SUIT_STYLES,
  SUIT_COLOURS,
  SHIRT_COLOURS,
  SHIRT_SIZES,
  ACCESSORY_COLOURS
} from '../types';

const STORE_ID = 'store-001';

// Size distribution per suit type
const SIZE_DISTRIBUTION: Record<string, number> = {
  'R34': 2,
  'S36': 1,
  'R36': 2,
  'L36': 2,
  'S38': 2,
  'R38': 2,
  'R40': 3,
  'L40': 2,
  'S42': 1,
  'R42': 1
};

function parseSuitSize(size: SuitSize): { category: 'S' | 'R' | 'L', number: number } {
  const category = size.charAt(0) as 'S' | 'R' | 'L';
  const number = parseInt(size.substring(1));
  return { category, number };
}

function generateSuitId(style: string, colour: string, size: string, instance: number): string {
  return `suit:${style.toLowerCase()}:${colour.toLowerCase()}:${size.toLowerCase()}:${instance.toString().padStart(3, '0')}`;
}

function generateTrousersId(style: string, colour: string, size: string, instance: number): string {
  return `trousers:${style.toLowerCase()}:${colour.toLowerCase()}:${size.toLowerCase()}:${instance.toString().padStart(3, '0')}`;
}

function generateShirtId(colour: string, size: string, instance: number): string {
  return `shirt:${colour.toLowerCase()}:${size.toLowerCase()}:${instance.toString().padStart(3, '0')}`;
}

function generateAccessoryId(type: 'tie' | 'pocketsquare', colour: string, instance: number): string {
  return `${type}:${colour.toLowerCase().replace(/ /g, '-')}:${instance.toString().padStart(3, '0')}`;
}

export async function generateSeeedData() {
  const documents: (Suit | Trousers | Shirt | Accessory)[] = [];
  const now = new Date().toISOString();

  // Generate Suits and Trousers
  for (const style of SUIT_STYLES) {
    for (const colour of SUIT_COLOURS) {
      for (const [size, quantity] of Object.entries(SIZE_DISTRIBUTION)) {
        const { category, number } = parseSuitSize(size as SuitSize);

        for (let instance = 1; instance <= quantity; instance++) {
          // Create jacket
          const suitId = generateSuitId(style, colour, size, instance);
          const suit: Suit = {
            _id: suitId,
            type: 'suit',
            style,
            colour,
            size,
            sizeCategory: category,
            sizeNumber: number,
            instanceNumber: instance,
            status: 'active',
            homeStore: STORE_ID,
            createdAt: now
          };
          documents.push(suit);

          // Create matching trousers
          const trousersId = generateTrousersId(style, colour, size, instance);
          const trousers: Trousers = {
            _id: trousersId,
            type: 'trousers',
            style,
            colour,
            size,
            sizeCategory: category,
            sizeNumber: number,
            instanceNumber: instance,
            status: 'active',
            homeStore: STORE_ID,
            createdAt: now
          };
          documents.push(trousers);
        }
      }
    }
  }

  // Generate Shirts
  for (const colour of SHIRT_COLOURS) {
    for (const size of SHIRT_SIZES) {
      for (let instance = 1; instance <= 10; instance++) {
        const shirtId = generateShirtId(colour, size, instance);
        const shirt: Shirt = {
          _id: shirtId,
          type: 'shirt',
          colour,
          size,
          instanceNumber: instance,
          status: 'active',
          homeStore: STORE_ID,
          createdAt: now
        };
        documents.push(shirt);
      }
    }
  }

  // Generate Ties
  for (const colour of ACCESSORY_COLOURS) {
    for (let instance = 1; instance <= 20; instance++) {
      const tieId = generateAccessoryId('tie', colour, instance);
      const tie: Accessory = {
        _id: tieId,
        type: 'tie',
        colour,
        instanceNumber: instance,
        status: 'active',
        homeStore: STORE_ID,
        createdAt: now
      };
      documents.push(tie);
    }
  }

  // Generate Pocket Squares
  for (const colour of ACCESSORY_COLOURS) {
    for (let instance = 1; instance <= 20; instance++) {
      const pocketSquareId = generateAccessoryId('pocketsquare', colour, instance);
      const pocketSquare: Accessory = {
        _id: pocketSquareId,
        type: 'pocketsquare',
        colour,
        instanceNumber: instance,
        status: 'active',
        homeStore: STORE_ID,
        createdAt: now
      };
      documents.push(pocketSquare);
    }
  }

  return documents;
}

export async function seedDatabase() {
  try {
    // Check if database already has data
    const existingDocs = await db.allDocs({ limit: 1 });
    if (existingDocs.rows.length > 0) {
      console.log('Database already contains data. Skipping seed.');
      return;
    }

    console.log('Generating seed data...');
    const documents = await generateSeeedData();

    console.log(`Inserting ${documents.length} documents...`);
    const result = await db.bulkDocs(documents);

    const successful = result.filter((r: any) => r.ok).length;
    const failed = result.filter((r: any) => !r.ok).length;

    console.log(`Seed complete: ${successful} documents inserted, ${failed} failed`);

    return result;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export async function clearDatabase() {
  try {
    const allDocs = await db.allDocs({ include_docs: true });
    const docsToDelete = allDocs.rows
      .filter(row => row.doc)
      .map(row => ({
        _id: row.doc!._id,
        _rev: row.doc!._rev,
        _deleted: true
      }));

    if (docsToDelete.length > 0) {
      await db.bulkDocs(docsToDelete as any);
    }
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}
