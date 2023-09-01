import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
    transform(value: any): any {
        // Mock implementation
        return value;
    }
}
