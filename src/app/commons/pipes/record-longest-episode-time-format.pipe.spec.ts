import { RecordLongestEpisodeTimeFormatPipe } from './record-longest-episode-time-format.pipe';
import { intervalToDuration } from 'date-fns';

describe('RecordLongestEpisodeTimeFormat', () => {
    const pipe = new RecordLongestEpisodeTimeFormatPipe();

    describe('transform', () => {
        it('should return the expected result', () => {
            const actualResult = pipe.transform(3600);
            expect(actualResult).toBe("001:00:00");
            expect(actualResult.split(":").length).toBe(3);
        })
    })
});
