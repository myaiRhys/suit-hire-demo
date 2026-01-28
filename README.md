# Suit Hire Management System

A tablet-friendly Progressive Web App (PWA) for managing suit rental bookings at a formal wear rental business. Built with React, TypeScript, and PouchDB for offline-first functionality.

## Features

### 📅 Weekly View (Main Screen)
- Digital replacement for paper tracking sheets
- View availability by suit style, colour, and size
- See all bookings for a specific week at a glance
- Quick navigation between weeks
- Real-time availability counts

### 📦 Inventory Management
- **270 Suit Jackets** (5 styles × 3 colours × multiple sizes)
- **270 Matching Trousers**
- **100 Dress Shirts** (White/Black in sizes S-XXL)
- **100 Ties** (5 colours)
- **100 Pocket Squares** (5 colours)

### 🎯 Key Capabilities
- **Offline-first**: Works without internet connection using PouchDB
- **Tablet-optimized**: Large touch targets (min 44px) and readable fonts
- **Status tracking**: Booked → Collected → Returned
- **Customer management**: Store contact details and booking history
- **Booking extras**: Add shirts, ties, and pocket squares to bookings

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS (mobile/tablet-first approach)
- **Database**: PouchDB (offline-first, IndexedDB under the hood)
- **Build Tool**: Vite 5
- **Date Handling**: date-fns
- **PWA**: Service Worker ready (to be implemented)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd suit-hire-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### First Run

1. On first launch, click "Seed Database with Inventory"
2. This creates 740 inventory items in the local database
3. The Weekly View will appear showing current/next Friday
4. Select suit style and colour to view availability

## Project Structure

```
suit-hire-demo/
├── src/
│   ├── components/
│   │   └── WeeklyView/           # Main weekly availability view
│   │       ├── WeeklyView.tsx
│   │       ├── WeekNavigator.tsx
│   │       ├── SuitFilters.tsx
│   │       └── AvailabilityTable.tsx
│   ├── db/
│   │   ├── database.ts           # PouchDB setup and indexes
│   │   ├── seed.ts               # Generate initial inventory
│   │   └── queries.ts            # Database query functions
│   ├── hooks/
│   │   ├── useBookings.ts        # Booking data hook
│   │   ├── useInventory.ts       # Inventory data hooks
│   │   └── useWeekNavigation.ts  # Week navigation logic
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── availability.ts       # Availability checking logic
│   │   └── dates.ts              # Friday week calculations
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── public/                       # Static assets
└── package.json
```

## Data Model

### Suit Inventory
- **5 Styles**: Lehman, WSC, Carlton, Windsor, Preston
- **3 Colours per Style**: Black, Blue, Grey
- **10 Sizes**: R34, S36, R36, L36, S38, R38, R40, L40, S42, R42
- Each size has 1-3 instances depending on demand

### Booking Structure
```typescript
interface Booking {
  _id: string;
  customerId: string;
  customerName: string;
  weekStartDate: string;        // Always a Friday (YYYY-MM-DD)
  suitId: string;               // Specific jacket
  trousersId: string;           // Specific trousers
  shirtId?: string;             // Optional extras
  tieId?: string;
  pocketSquareId?: string;
  status: 'booked' | 'collected' | 'returned' | 'cancelled';
  // ... measurements, notes, audit fields
}
```

## Availability Logic

An item is **available** for a week if:
- It exists and status is 'active'
- It's NOT in any booking where:
  - `weekStartDate` matches the target week AND
  - `status` is 'booked' OR 'collected'

## Development Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Data layer (PouchDB, types, queries)
- [x] Seed data generation
- [x] Weekly View UI
- [x] Week navigation
- [x] Suit filtering by style/colour
- [x] Availability display by size

### 🚧 Phase 2: Booking Management (Next)
- [ ] Booking form wizard
- [ ] Customer search and creation
- [ ] Item selection with availability checking
- [ ] Booking detail view
- [ ] Status updates (collect/return)
- [ ] Cancel booking

### 📋 Phase 3: Additional Features
- [ ] Search screen (by customer/phone)
- [ ] Inventory overview screen
- [ ] Settings (export/import data)
- [ ] PWA configuration (service worker, manifest)
- [ ] Install prompt for tablets

### 🔮 Future Enhancements
- [ ] CouchDB sync for multi-device
- [ ] Print booking confirmations
- [ ] SMS/email notifications
- [ ] Reporting and analytics
- [ ] Inter-branch transfers
- [ ] User authentication

## Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The production files will be in the `dist/` directory.

## Browser Compatibility

- Modern browsers with IndexedDB support
- Optimized for tablets (iPad, Android tablets)
- Touch-friendly interface (minimum 44px touch targets)
- Works offline after initial load

## Database Management

### Reset Database
1. Click the Settings button (⚙️) in top-right
2. Click "Clear & Reseed Database"
3. Confirms deletion of all bookings and customers
4. Regenerates clean inventory

### Export/Import (To Be Implemented)
- JSON export of all data
- Import for backup restoration

## Contributing

This is a demo application for client presentation. Future development will be based on client feedback.

## License

Proprietary - Not for public distribution

## Demo Scenarios

For client demonstration:
1. **Fresh Database**: Show empty weekly view with full availability
2. **Create Bookings**: Make 5-6 bookings across different weeks/suits
3. **Filter View**: Demonstrate style and colour filtering
4. **Status Updates**: Mark bookings as collected/returned
5. **Cancel Booking**: Show how availability is restored
6. **Week Navigation**: Navigate forward/backward through weeks
7. **Availability**: Show how size availability updates in real-time

## Support

For questions or issues, contact the development team.
