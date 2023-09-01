import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'RecordLongestEpisodeTimeFormat'
})
export class RecordLongestEpisodeTimeFormatPipeMock implements PipeTransform {

    public transform() {
        return null;
    }
}
