import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'recordKeyboardShortcut'
})
export class RecordKeyboardShortcutPipe implements PipeTransform {

    /**
     * Pipe to transform the keyboardShortcut array into html
     * @param value
     * @param typeMeta
     */

    public transform(value, typeMeta): string {
        // Action key i.e. CTRL or ALT
        const actionKey = typeMeta[value].keyboardShortcut[0];

        // Unique character for shortcut
        const character = typeMeta[value].keyboardShortcut[2];

        // We can make icon tag variable when a different icon is needed
        return `${actionKey}+<img class="shift-icon-small" src="./assets/img/icons/icon-shift.svg"/>+${character}`;
    }

}
