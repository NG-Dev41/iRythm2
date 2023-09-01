import { Pipe, PipeTransform } from '@angular/core';
import { intervalToDuration } from 'date-fns';


@Pipe({
	name: 'RecordLongestEpisodeTimeFormat'
})
export class RecordLongestEpisodeTimeFormatPipe implements PipeTransform {

	/**
	 * Formats a number representing the number of seconds into the time format of hhh:mm:ss
	 * @param longestEpisodeDurationSeconds
	 */
	public transform(longestEpisodeDurationSeconds: number): string {

		// Goal: convert this.heatMapResponse.heatMapSummaryMetrics.longestEpisodeDuration from the number of seconds
		// into a string that looks like 000:00:00

		// Convert the longestEpisodeDuration from the heatMapSummaryMetrics to a duration to get the number of minutes and seconds
		let longestEpisodeDuration = intervalToDuration( {
			start: 0,
			end: longestEpisodeDurationSeconds * 1000
		} );

		// Array we will push the number of hours, minutes, and seconds to in order to join with a colon to create desired string
		let durationArray = [];

		// Calculate the number of hours. There are 3600 seconds in an hour
		// Note: We are using this rather than the duration we just calculated because it is easier to divide by 3600 than joining the
		//       duration.years, duration.months, duration.weeks, duration.days, and duration.hours in to a single hour value
		let numHours = Math.floor( longestEpisodeDurationSeconds / 3600 );

		// Format number of hours to '000' format.  If number of hours is less than 100, then pad with leading zeros
		durationArray.push( numHours.toString().padStart( 3, '0' ) );

		// Format number of minutes to '00' format.  If number of minutes is less than 10, then pad with leading zero
		durationArray.push( longestEpisodeDuration.minutes.toString().padStart( 2, '0' ) );

		// Format number of seconds to '00' format.  If number of seconds is less than 10, then pad with leading zero
		durationArray.push( longestEpisodeDuration.seconds.toString().padStart( 2, '0' ) );

		// Join all durations to make the duration string in format of '000:00:00'
		return durationArray.join( ':' );

	}
}
