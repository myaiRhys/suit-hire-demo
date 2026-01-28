import { useState } from 'react';
import { getCurrentWeekFriday, formatWeekDate, getNextWeek, getPreviousWeek } from '../utils/dates';

export function useWeekNavigation() {
  const [currentWeek, setCurrentWeek] = useState<string>(() => {
    return formatWeekDate(getCurrentWeekFriday());
  });

  const goToNextWeek = () => {
    setCurrentWeek(prev => getNextWeek(prev));
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => getPreviousWeek(prev));
  };

  const goToWeek = (weekDate: string) => {
    setCurrentWeek(weekDate);
  };

  const goToToday = () => {
    setCurrentWeek(formatWeekDate(getCurrentWeekFriday()));
  };

  return {
    currentWeek,
    goToNextWeek,
    goToPreviousWeek,
    goToWeek,
    goToToday
  };
}
