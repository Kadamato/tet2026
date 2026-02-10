import { LUNAR_NEW_YEAR_2026 } from './constants';

export const isMainEvent = (date: Date): boolean => {
    const diffFromTarget = date.getTime() - LUNAR_NEW_YEAR_2026.getTime();
    return diffFromTarget >= 0 && diffFromTarget < 60 * 60 * 1000;
};

/** Returns true if it's the daily firework show window (00:00–00:29). */
export const isDailyShow = (date: Date): boolean => {
    return date.getHours() === 0 && date.getMinutes() < 30;
};
