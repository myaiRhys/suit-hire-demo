import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import type { Document } from '../types';

// Initialize PouchDB with the Find plugin
PouchDB.plugin(PouchDBFind);

// Database instance
export const db = new PouchDB<Document>('suit-hire-db');

// Create indexes for common queries
export async function createIndexes() {
  await db.createIndex({
    index: {
      fields: ['type']
    }
  });

  await db.createIndex({
    index: {
      fields: ['type', 'weekStartDate']
    }
  });

  await db.createIndex({
    index: {
      fields: ['type', 'style', 'colour', 'size']
    }
  });

  await db.createIndex({
    index: {
      fields: ['type', 'status']
    }
  });

  await db.createIndex({
    index: {
      fields: ['customerId']
    }
  });

  await db.createIndex({
    index: {
      fields: ['customerName']
    }
  });

  console.log('Database indexes created');
}

// Initialize database
export async function initDatabase() {
  try {
    await createIndexes();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Export the database instance for use in components
export default db;
