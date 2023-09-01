import { FindingsMacroReplacePipe } from './findings-macro-replace.pipe';

describe('MacroReplacePipe', () => {
    let pipe: FindingsMacroReplacePipe;
    let keyValueMap: { [key: string]: string };

    beforeAll(() => {
        pipe = new FindingsMacroReplacePipe();
        keyValueMap = {
            maxHR: '179',
            avgHR: '69',
            minHR: '45',
            seashells: 'seashells',
            sealocation: 'sea ${shore}',
            shore: 'shore',
            transaction: 'sells ${seashells}',
            directionAndLocation: '${direction} by the ${sealocation}',
            direction: 'down',
            website: 'iowataxandtags.org',
            action: 'renew',
            legalpaper: 'registration',
            virtualworld: 'online',
            websiteAndAction: '${website} ${linkingWord} ${action}',
            legalItem: '${your} ${legalpaper}',
            locationAndBenefit: '${virtualworld} and avoid the wait!',
        };
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('Real world examples', () => {
        it('replaces all values in string when key is present', () => {
            const originalValue =
                'Patient had a min HR of ${minHR} bpm, max HR of ${maxHR} bpm, and avg HR of ${avgHR} bpm.';
            const resultValue = pipe.transform(originalValue, keyValueMap);
            expect(originalValue).not.toEqual(resultValue);
            expect(resultValue).toBe('Patient had a min HR of 45 bpm, max HR of 179 bpm, and avg HR of 69 bpm.');
        });

        it('does not replace any value in string when key does not match', () => {
            const originalValue = 'Predominant underlying rhythm was ${noMacroValue}.';
            const resultValue = pipe.transform(originalValue, keyValueMap);
            expect(originalValue).toEqual(resultValue);
        });

        it('handles a no macro string', () => {
            const originalValue = 'No macros mwahaha';
            const pipeSpy = jest.spyOn(pipe as any, 'replaceMacroValues');
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(originalValue);
            expect(pipeSpy).not.toHaveBeenCalled();
        });

        it('handles null', () => {
            const originalValue: string = null;
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(originalValue);
        });

        it('handles undefined', () => {
            const originalValue: string = undefined;
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(originalValue);
        });
    });

    describe('recurrsion testing', () => {
        it('handles macros having other macros, 1 level deep', () => {
            const originalValue = 'Sally sells ${seashells} down by the ${sealocation}';
            const expectedValue = 'Sally sells seashells down by the sea shore';
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(expectedValue);
        });

        it('handles macros having other macros, multiple levels', () => {
            const originalValue = 'Sally ${transaction} ${directionAndLocation}';
            const expectedValue = 'Sally sells seashells down by the sea shore';
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(expectedValue);
        });

        it('handles unresolvable macros', () => {
            const originalValue = 'Maggie ${moo}';
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(originalValue);
        });

        it('handles mix of resolvable and unresolvable macros', () => {
            const originalValue =
                'Visit ${website} to ${action} your ${legalpaper} ${virtualworld} and avoid the wait! ${superlatives}';
            const expectedValue =
                'Visit iowataxandtags.org to renew your registration online and avoid the wait! ${superlatives}';
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(expectedValue);
        });

        it('handles nested resolvable and unresolvable macros', () => {
            const originalValue = 'Visit ${websiteAndAction} ${legalItem} ${locationAndBenefit} ${superlatives}';
            const expectedValue =
                'Visit iowataxandtags.org ${linkingWord} renew ${your} registration online and avoid the wait! ${superlatives}';
            const result = pipe.transform(originalValue, keyValueMap);
            expect(result).toEqual(expectedValue);
        });
    });
});
