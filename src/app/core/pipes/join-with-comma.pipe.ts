import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinWithCommaPipe'
})
export class JoinWithCommaPipe implements PipeTransform {

  transform(value: Array<any>, ...args: unknown[]): unknown {
    return value.join(', ');
  }

}
