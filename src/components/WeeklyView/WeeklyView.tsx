import { useState } from 'react';
import { useWeekNavigation } from '../../hooks/useWeekNavigation';
import { useBookings } from '../../hooks/useBookings';
import { useSuits } from '../../hooks/useInventory';
import { formatWeekDisplay } from '../../utils/dates';
import { countAvailableBySize } from '../../utils/availability';
import { SUIT_STYLES, SUIT_COLOURS, SUIT_SIZES } from '../../types';
import type { SuitStyle, SuitColour } from '../../types';
import WeekNavigator from './WeekNavigator';
import SuitFilters from './SuitFilters';
import AvailabilityTable from './AvailabilityTable';

export default function WeeklyView() {
  const [selectedStyle, setSelectedStyle] = useState<SuitStyle>('Lehman');
  const [selectedColour, setSelectedColour] = useState<SuitColour>('Black');

  const { currentWeek, goToNextWeek, goToPreviousWeek, goToToday } = useWeekNavigation();
  const { bookings, loading: bookingsLoading, refresh: refreshBookings } = useBookings(currentWeek);
  const { suits, loading: suitsLoading } = useSuits(selectedStyle, selectedColour);

  const loading = bookingsLoading || suitsLoading;

  // Group suits by size for display
  const sizeGroups = SUIT_SIZES.map(size => {
    const suitsOfSize = suits.filter(s => s.size === size);
    const { available, total } = countAvailableBySize(suitsOfSize, size, currentWeek, bookings);
    const bookingsForSize = bookings.filter(b =>
      b.suitStyle === selectedStyle &&
      b.suitColour === selectedColour &&
      b.suitSize === size &&
      (b.status === 'booked' || b.status === 'collected')
    );

    return {
      size,
      available,
      total,
      suits: suitsOfSize,
      bookings: bookingsForSize
    };
  }).filter(group => group.total > 0); // Only show sizes that exist

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Weekly View</h1>
            <button
              onClick={goToToday}
              className="btn btn-secondary text-sm"
            >
              Today
            </button>
          </div>

          <WeekNavigator
            currentWeek={currentWeek}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
          />

          <SuitFilters
            selectedStyle={selectedStyle}
            selectedColour={selectedColour}
            onStyleChange={setSelectedStyle}
            onColourChange={setSelectedColour}
            styles={SUIT_STYLES}
            colours={SUIT_COLOURS}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedStyle} - {selectedColour}
              </h2>
              <span className="text-sm text-gray-600">
                {formatWeekDisplay(currentWeek)}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading availability...</p>
              </div>
            </div>
          ) : (
            <AvailabilityTable
              sizeGroups={sizeGroups}
              weekStartDate={currentWeek}
              onBookingUpdated={refreshBookings}
            />
          )}
        </div>
      </main>
    </div>
  );
}
