import { Component, OnInit } from '@angular/core';

import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';


@Component({
  selector: 'app-episode-duration-text',
  templateUrl: './episode-duration-text.component.html',
  styleUrls: ['./episode-duration-text.component.scss']
})
export class EpisodeDurationTextComponent implements OnInit {
	
	/**
	 * Ctor
	 *
	 * @param ecgDto
	 * @param config
	 */
	public constructor(
		public ecgDto: EcgDto,
		public config: EcgStripConfigDto
	) { }
	
	public ngOnInit(): void {
	}

}
