import { formatWeekDisplay } from '../../utils/dates';

interface WeekNavigatorProps {
  currentWeek: string;
  onPrevious: () => void;
  onNext: () => void;
}

export default function WeekNavigator({ currentWeek, onPrevious, onNext }: WeekNavigatorProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onPrevious}
        className="btn btn-secondary"
        aria-label="Previous week"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2">Previous</span>
      </button>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {formatWeekDisplay(currentWeek)}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {currentWeek}
        </p>
      </div>

      <button
        onClick={onNext}
        className="btn btn-secondary"
        aria-label="Next week"
      >
        <span className="mr-2">Next</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
