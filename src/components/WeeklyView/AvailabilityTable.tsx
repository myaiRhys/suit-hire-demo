import type { Suit, Booking } from '../../types';
import { getStatusColorClass, getStatusBadgeClass } from '../../utils/availability';

interface SizeGroup {
  size: string;
  available: number;
  total: number;
  suits: Suit[];
  bookings: Booking[];
}

interface AvailabilityTableProps {
  sizeGroups: SizeGroup[];
  weekStartDate: string;
  onBookingUpdated: () => void;
}

export default function AvailabilityTable({
  sizeGroups,
  weekStartDate,
  onBookingUpdated
}: AvailabilityTableProps) {
  if (sizeGroups.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No suits found for this style and colour combination.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Size
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Available
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Trousers
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
              W
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
              L
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Extras
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sizeGroups.map((group) => (
            <SizeGroupRows
              key={group.size}
              group={group}
              weekStartDate={weekStartDate}
              onBookingUpdated={onBookingUpdated}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SizeGroupRows({
  group,
}: {
  group: SizeGroup;
  weekStartDate: string;
  onBookingUpdated: () => void;
}) {
  const hasBookings = group.bookings.length > 0;

  // Show bookings or an available row
  if (!hasBookings) {
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-4 text-sm font-medium text-gray-900">
          {group.size}
        </td>
        <td className="px-4 py-4 text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {group.available}/{group.total} available
          </span>
        </td>
        <td colSpan={7} className="px-4 py-4 text-sm text-gray-500 italic">
          No bookings
        </td>
        <td className="px-4 py-4 text-sm text-right">
          <button
            className="btn btn-primary text-sm py-2"
            onClick={() => alert('Open booking form - to be implemented')}
          >
            Book
          </button>
        </td>
      </tr>
    );
  }

  // Show each booking as a row
  return (
    <>
      {group.bookings.map((booking, idx) => (
        <tr
          key={booking._id}
          className={`hover:bg-gray-50 border-l-4 ${getStatusColorClass(booking.status)}`}
        >
          {idx === 0 && (
            <>
              <td
                className="px-4 py-4 text-sm font-medium text-gray-900"
                rowSpan={group.bookings.length}
              >
                {group.size}
              </td>
              <td
                className="px-4 py-4 text-sm"
                rowSpan={group.bookings.length}
              >
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  group.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {group.available}/{group.total}
                </span>
              </td>
            </>
          )}
          <td className="px-4 py-4 text-sm font-medium text-gray-900">
            {booking.customerName}
          </td>
          <td className="px-4 py-4 text-sm text-gray-600">
            {booking.customerContact}
          </td>
          <td className="px-4 py-4 text-sm text-gray-600">
            {booking.trousersSize}
          </td>
          <td className="px-4 py-4 text-sm text-center text-gray-600">
            {booking.waistMeasurement || '-'}
          </td>
          <td className="px-4 py-4 text-sm text-center text-gray-600">
            {booking.legLength || '-'}
          </td>
          <td className="px-4 py-4 text-sm text-gray-600">
            <div className="flex flex-wrap gap-1">
              {booking.shirtSize && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Shirt: {booking.shirtSize}
                </span>
              )}
              {booking.tieColour && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Tie: {booking.tieColour}
                </span>
              )}
              {booking.pocketSquareColour && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  PS: {booking.pocketSquareColour}
                </span>
              )}
            </div>
          </td>
          <td className="px-4 py-4 text-sm">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
              {booking.status}
            </span>
          </td>
          <td className="px-4 py-4 text-sm text-right">
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => alert(`View booking ${booking._id} - to be implemented`)}
            >
              View
            </button>
          </td>
        </tr>
      ))}
      {/* Show "Add Booking" button if there's availability */}
      {group.available > 0 && (
        <tr className="bg-gray-50">
          <td colSpan={2}></td>
          <td colSpan={7} className="px-4 py-2 text-sm text-gray-500 italic">
            {group.available} more available
          </td>
          <td className="px-4 py-2 text-sm text-right">
            <button
              className="btn btn-secondary text-sm py-1.5"
              onClick={() => alert('Open booking form - to be implemented')}
            >
              + Book
            </button>
          </td>
        </tr>
      )}
    </>
  );
}
