import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'findingsMacroReplace',
})
export class FindingsMacroReplacePipe implements PipeTransform {
    transform(value: string, keyValueMap: { [key: string]: string }): string {
        if (!this.hasMacroValue(value)) {
            return value;
        }

        // copy string to ensure we do not modify original
        return this.replaceMacroValues(this.copyString(value), keyValueMap);
    }

    /**
     * Uses regex to find potentials to replace with values in keyValueMap
     */
    private replaceMacroValues(value: string, keyValueMap: { [key: string]: string }): string {
        const matchArray = this.findMacroOccurances(value);
        let hasUnresolvableValue: boolean = false;
        let replacedValues: number = 0;

        matchArray?.forEach((match) => {
            const regexMatch = match[0]; // match e.g. ${thing}
            const group = match[1]; // capture group e.g. thing

            // Check if value exists in the keyValueMap, if not indicate we have an "unresolvable" value
            // Keep count of how many we have replaced for our exit condition
            if (keyValueMap[group]) {
                value = value.replace(regexMatch, keyValueMap[group]);
                replacedValues++;
            } else {
                hasUnresolvableValue = true;
            }
        });

        // The values in the keyValueMap can have additional macros to replace.
        // If we were unable to replace any values and we have set the hasUnresolvableValue flag, then
        // there exists a macro we cannot replace or there exists someone who thinks it's a good idea
        // to write ${like this}
        if (this.hasMacroValue(value) && !(replacedValues === 0 && hasUnresolvableValue)) {
            return this.replaceMacroValues(value, keyValueMap);
        }

        return value;
    }

    /**
     * /(?:\${)([^\${}]+)(?:})/
     * (?:\${) = positive lookahead, non-capturing group
     *  Looks in the string for '${', will be a part of the 'match' but not the 'group'
     * ([^\${}]+) = Any character except $, {, or }, capturing group
     *  Just a capturing group for everything between ${ and }, this is the 'group'
     * (?:}) = positive lookahead, non-capturing group
     *  Needs to have the } after the first two to be a 'match'
     *
     * 'gi' = global and case-insensitive
     *
     * @param value = String to apply regex against
     * @returns array
     */
    private findMacroOccurances(value: string): RegExpMatchArray[] {
        let regex = new RegExp(/(?:\${)([^\${}]+)(?:})/, 'gi');
        return [...value.matchAll(regex)];
    }

    // Simplified search to check if string is even a candidate for macro replacement
    private hasMacroValue(value: string): boolean {
        return value?.includes('${');
    }

    private copyString(value: string): string {
        return value?.slice(0, value.length);
    }
}
