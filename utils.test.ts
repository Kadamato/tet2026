import { describe, it, expect } from 'vitest';
import { isDailyShow } from './utils';

describe('isDailyShow', () => {
    it('should return true for midnight (00:00 - 00:29) from current date to New Year Eve', () => {
        // Current date is Feb 10, 2026 (based on user metadata)
        // New Year Eve is Feb 16, 2026 (based on constants.ts LUNAR_NEW_YEAR_2026 being Feb 17)

        // Test range from Feb 10 to Feb 16
        for (let day = 10; day <= 16; day++) {
            // Test at 00:00:00
            const midnight = new Date(`2026-02-${day}T00:00:00`);
            expect(isDailyShow(midnight)).toBe(true);

            // Test at 00:15:00
            const middle = new Date(`2026-02-${day}T00:15:00`);
            expect(isDailyShow(middle)).toBe(true);

            // Test at 00:29:59
            const end = new Date(`2026-02-${day}T00:29:59`);
            expect(isDailyShow(end)).toBe(true);
        }
    });

    it('should return false after 00:30 from current date to New Year Eve', () => {
        for (let day = 10; day <= 16; day++) {
            // Test at 00:30:00
            const afterDetails = new Date(`2026-02-${day}T00:30:00`);
            expect(isDailyShow(afterDetails)).toBe(false);

            // Test at 12:00:00
            const noon = new Date(`2026-02-${day}T12:00:00`);
            expect(isDailyShow(noon)).toBe(false);
        }
    });
});
