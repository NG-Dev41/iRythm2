import { Pipe, PipeTransform } from '@angular/core';
import { RecordMetricType } from '../enums/record-navigation.enum';
import { IRecordMetrics } from '../interfaces/record-metrics.interface';


@Pipe({
	name: 'recordMetric',
    pure: true
})
export class RecordMetricPipe implements PipeTransform {


	/**
	 * Ctor
	 */
	public constructor() {}


	/**
	 * Returns record metric value.
	 *
	 * @param  {RecordMetricType} metricType
	 * @param  {any}      type
	 * @return {any}
	 */
	public transform(metricType: RecordMetricType, type: any, metrics: IRecordMetrics): any {

		// Value to be returned
		let propValue;

		switch(metricType) {

			case RecordMetricType.RHYTHMS:
				propValue = metrics['rhythmMetrics'][type];
				break;

			case RecordMetricType.ECTOPICS:
				propValue = metrics['ectopicMetrics'][type];
				break;

			case RecordMetricType.RECORD_PAGE:
				propValue = metrics[type];
				break;

            case RecordMetricType.ECTOPIC_PATTERNS:
                propValue = metrics['rhythmMetrics'][type];
                break;

			default:
				propValue = 0;

		}

		return propValue;
	}
}
